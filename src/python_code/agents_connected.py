"""
Các Agent kết nối LLM - Risk, CMM, Macro
"""

from typing import Dict, Any
import json
from llm_client import llm_client


class RiskAgent:
    """Phòng Quản lý Rủi ro - Sử dụng Claude (Đắt nhưng cần thiết)"""
    
    SYSTEM_PROMPT = """Bạn là Risk Agent - Phòng Quản lý Rủi ro.

NHIỆM VỤ:
1. Kiểm tra chéo tín hiệu từ Quant + CMM
2. Tính Position Size (risk 2% tài khoản)
3. Xác định SL/TP (R:R tối thiểu 1:2)
4. QUYẾT ĐỊNH CUỐI CÙNG: APPROVE hoặc REJECT

QUY TẮC CỨNG:
- Rủi ro tối đa mỗi lệnh: 2% tài khoản
- Max 3 lệnh cùng lúc
- Trap Score > 70 → REJECT
- TP phải cộng thêm 0.07% phí sàn

OUTPUT JSON:
{
  "decision": "APPROVE|REJECT",
  "direction": "LONG|SHORT",
  "entry": 0,
  "stop_loss": 0,
  "take_profit": 0,
  "position_size": 0,
  "reasoning": "string"
}"""
    
    def __init__(self, balance: float):
        self.provider = 'claude'
        self.model = 'claude-3-5-sonnet-20241022'
        self.balance = balance
        self.max_risk = 0.02
        self.max_trades = 3
        self.min_confidence = 65
    
    def evaluate(self, quant_signal: Dict, cmm_analysis: Dict, open_trades: list) -> Dict[str, Any]:
        """Đánh giá và quyết định"""
        
        # Check CMM trap
        if cmm_analysis.get('trap_score', 0) > 70:
            return {'decision': 'REJECT', 'reason': 'Trap detected by CMM'}
        
        # Check confidence
        if quant_signal.get('confidence', 0) < self.min_confidence:
            return {'decision': 'REJECT', 'reason': 'Low confidence'}
        
        # Check max trades
        if len(open_trades) >= self.max_trades:
            return {'decision': 'REJECT', 'reason': 'Max trades reached'}
        
        # Gọi Claude để suy luận phức tạp
        user_message = f"""DỮ LIỆU:
- Quant Signal: {json.dumps(quant_signal)}
- CMM Analysis: {json.dumps(cmm_analysis)}
- Balance: ${self.balance}
- Open Trades: {len(open_trades)}

Hãy quyết định APPROVE hoặc REJECT."""
        
        response = llm_client.call_llm(
            provider=self.provider,
            system_prompt=self.SYSTEM_PROMPT,
            user_message=user_message,
            model=self.model
        )
        
        if 'error' in response:
            # Fallback: dùng logic Python
            return self._fallback_evaluate(quant_signal)
        
        result = response['content']
        result['token_usage'] = {
            'input_tokens': response['input_tokens'],
            'output_tokens': response['output_tokens'],
            'cost': response['cost']
        }
        
        return result
    
    def _fallback_evaluate(self, quant_signal: Dict) -> Dict:
        """Fallback logic"""
        price = quant_signal.get('current_price', 68500)
        atr = price * 0.02
        
        if quant_signal['direction'] == 'LONG':
            sl = price - atr * 1.5
            tp = price + atr * 3
        else:
            sl = price + atr * 1.5
            tp = price - atr * 3
        
        risk_amount = self.balance * self.max_risk
        distance = abs(price - sl)
        size = (risk_amount / distance) * price if distance > 0 else 0
        
        return {
            'decision': 'APPROVE',
            'direction': quant_signal['direction'],
            'entry': price,
            'stop_loss': sl,
            'take_profit': tp,
            'position_size': min(size, self.balance * 0.5),
            'reasoning': 'Fallback: Python logic'
        }


class CMMAgent:
    """Phòng Pháp chế & Vi cấu trúc - Sử dụng Claude"""
    
    SYSTEM_PROMPT = """Bạn là CMM Agent - Phòng Pháp chế & Vi cấu trúc.

NHIỆM VỤ:
1. Phân tích hành vi cá mập (Wyckoff)
2. Phát hiện Stop Hunt, Spoofing
3. Tính Trap Score (0-100)

OUTPUT JSON:
{
  "trap_score": 0-100,
  "whale_behavior": "accumulation|distribution|neutral",
  "warnings": ["string"],
  "recommendation": "string"
}"""
    
    def __init__(self):
        self.provider = 'claude'
        self.model = 'claude-3-5-sonnet-20241022'
    
    def analyze(self, market_data: Dict, whale_events: list) -> Dict[str, Any]:
        """Phân tích vi cấu trúc thị trường"""
        
        user_message = f"""DỮ LIỆU:
- Market: {json.dumps(market_data)}
- Whale Events: {json.dumps(whale_events[:5])}

Phân tích và tính Trap Score."""
        
        response = llm_client.call_llm(
            provider=self.provider,
            system_prompt=self.SYSTEM_PROMPT,
            user_message=user_message,
            model=self.model
        )
        
        if 'error' in response:
            return {'trap_score': 30, 'whale_behavior': 'neutral', 'warnings': []}
        
        result = response['content']
        result['token_usage'] = {
            'cost': response['cost'],
            'total_tokens': response['total_tokens']
        }
        
        return result


class MacroAgent:
    """Phòng Vĩ mô & Tin tức - Sử dụng Groq (Free)"""
    
    SYSTEM_PROMPT = """Bạn là Macro Agent - Phòng Vĩ mô & Tin tức.

NHIỆM VỤ:
1. Đọc và phân tích tin tức
2. Chấm điểm Sentiment (-10 đến +10)
3. Phân loại tác động (LOW/MED/HIGH/CRITICAL)

OUTPUT JSON:
{
  "sentiment_score": -10 to +10,
  "impact_level": "LOW|MED|HIGH|CRITICAL",
  "red_flags": ["string"],
  "macro_context": "string"
}"""
    
    def __init__(self):
        self.provider = 'groq'
        self.model = 'llama-3.3-70b-versatile'
    
    def analyze(self, news_items: list, economic_calendar: Dict) -> Dict[str, Any]:
        """Phân tích tin tức và vĩ mô"""
        
        user_message = f"""TIN TỨC:
{json.dumps(news_items[:10])}

LỊCH KINH TẾ:
{json.dumps(economic_calendar)}

Phân tích sentiment và tác động."""
        
        response = llm_client.call_llm(
            provider=self.provider,
            system_prompt=self.SYSTEM_PROMPT,
            user_message=user_message,
            model=self.model
        )
        
        if 'error' in response:
            return {'sentiment_score': 0, 'impact_level': 'LOW', 'red_flags': []}
        
        result = response['content']
        result['token_usage'] = {
            'cost': response['cost'],
            'total_tokens': response['total_tokens']
        }
        
        return result


class Orchestrator:
    """CEO Agent - Điều phối toàn bộ 11 Agents"""
    
    def __init__(self, initial_balance: float = 100.0):
        from quant_agent import QuantAgent
        
        self.balance = initial_balance
        self.quant = QuantAgent()
        self.risk = RiskAgent(initial_balance)
        self.cmm = CMMAgent()
        self.macro = MacroAgent()
        self.open_trades = []
        self.total_token_cost = 0
    
    def run_trading_cycle(self, symbol: str = 'BTC/USDT', df=None) -> Dict[str, Any]:
        """Chạy một chu kỳ giao dịch hoàn chỉnh"""
        
        print(f"\n{'='*60}")
        print(f"🔄 TRADING CYCLE: {symbol}")
        print(f"{'='*60}")
        
        # Phase 1: Quant Analysis (Groq - Free)
        print("\n🧠 Phase 1: Quant Analysis...")
        quant_signal = self.quant.analyze(df)
        print(f"   Signal: {quant_signal['direction']} ({quant_signal['confidence']:.0f}%)")
        self.total_token_cost += quant_signal.get('token_usage', {}).get('cost', 0)
        
        # Phase 2: CMM Analysis (Claude - Paid)
        print("\n⚖️ Phase 2: CMM Analysis...")
        cmm_analysis = self.cmm.analyze(
            market_data={'price': quant_signal['indicators']['current_price']},
            whale_events=[]
        )
        print(f"   Trap Score: {cmm_analysis.get('trap_score', 0)}")
        self.total_token_cost += cmm_analysis.get('token_usage', {}).get('cost', 0)
        
        # Phase 3: Risk Decision (Claude - Paid)
        print("\n🛡️ Phase 3: Risk Decision...")
        risk_decision = self.risk.evaluate(quant_signal, cmm_analysis, self.open_trades)
        print(f"   Decision: {risk_decision['decision']}")
        self.total_token_cost += risk_decision.get('token_usage', {}).get('cost', 0)
        
        if risk_decision['decision'] == 'REJECT':
            return {
                'status': 'REJECTED',
                'reason': risk_decision['reason'],
                'total_cost': self.total_token_cost
            }
        
        # Phase 4: Execute (Python - Free)
        print("\n⚡ Phase 4: Execute...")
        print(f"   Entry: ${risk_decision['entry']:.2f}")
        print(f"   SL: ${risk_decision['stop_loss']:.2f}")
        print(f"   TP: ${risk_decision['take_profit']:.2f}")
        
        return {
            'status': 'APPROVED',
            'trade_plan': risk_decision,
            'total_cost': self.total_token_cost
        }


# Main
if __name__ == "__main__":
    import pandas as pd
    
    # Tạo dữ liệu mẫu
    df = pd.DataFrame({
        'close': [68000 + i * 10 for i in range(100)]
    })
    
    orchestrator = Orchestrator(initial_balance=100.0)
    result = orchestrator.run_trading_cycle('BTC/USDT', df)
    
    print(f"\n{'='*60}")
    print(f"📊 KẾT QUẢ: {result['status']}")
    print(f"💰 Total AI Cost: ${result['total_cost']:.4f}")
    print(f"{'='*60}")
