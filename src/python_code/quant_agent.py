"""
Quant Agent - Kết nối thực tế với Groq LLM
"""

from typing import Dict, Any
import pandas as pd
import numpy as np
from llm_client import llm_client


class QuantAgent:
    """Phòng Nghiên cứu & Định lượng - Sử dụng Groq (Free)"""
    
    SYSTEM_PROMPT = """Bạn là Quant Agent - Phòng Nghiên cứu & Định lượng của công ty Crypto AI.

NHIỆM VỤ:
1. Phân tích các chỉ báo kỹ thuật (RSI, MACD, EMA, Bollinger Bands)
2. Xác định xu hướng hiện tại
3. Đưa ra tín hiệu LONG/SHORT/NEUTRAL
4. Tính Confidence Score (0-100)

QUY TẮC:
- Chỉ đưa tín hiệu khi ≥3 chỉ báo đồng thuận
- Confidence < 40: Không giao dịch
- KHÔNG dự đoán giá, chỉ phân tích xu hướng
- Mọi tính toán toán học đã được Python tính sẵn, bạn chỉ TỔNG HỢP

OUTPUT JSON:
{
  "direction": "LONG|SHORT|NEUTRAL",
  "confidence": 0-100,
  "reasoning": "string - giải thích ngắn gọn",
  "key_levels": {
    "support": 0,
    "resistance": 0
  },
  "indicators_summary": {
    "rsi": 0,
    "trend": "up|down|sideways",
    "momentum": "strong|weak|neutral"
  }
}"""
    
    def __init__(self):
        self.provider = 'groq'
        self.model = 'llama-3.3-70b-versatile'
    
    def calculate_indicators(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Tính toán chỉ báo kỹ thuật (Python thuần - FREE)"""
        close = df['close']
        
        # RSI
        delta = close.diff()
        gain = delta.where(delta > 0, 0).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        
        # EMA
        ema_20 = close.ewm(span=20, adjust=False).mean()
        ema_50 = close.ewm(span=50, adjust=False).mean()
        
        # MACD
        ema_12 = close.ewm(span=12, adjust=False).mean()
        ema_26 = close.ewm(span=26, adjust=False).mean()
        macd_line = ema_12 - ema_26
        signal_line = macd_line.ewm(span=9, adjust=False).mean()
        histogram = macd_line - signal_line
        
        # Bollinger Bands
        sma_20 = close.rolling(window=20).mean()
        std_20 = close.rolling(window=20).std()
        bb_upper = sma_20 + 2 * std_20
        bb_lower = sma_20 - 2 * std_20
        
        return {
            'current_price': float(close.iloc[-1]),
            'rsi': float(rsi.iloc[-1]),
            'ema_20': float(ema_20.iloc[-1]),
            'ema_50': float(ema_50.iloc[-1]),
            'macd': float(macd_line.iloc[-1]),
            'macd_signal': float(signal_line.iloc[-1]),
            'macd_histogram': float(histogram.iloc[-1]),
            'bb_upper': float(bb_upper.iloc[-1]),
            'bb_middle': float(sma_20.iloc[-1]),
            'bb_lower': float(bb_lower.iloc[-1]),
            'trend': 'up' if ema_20.iloc[-1] > ema_50.iloc[-1] else 'down',
            'momentum': 'strong' if abs(histogram.iloc[-1]) > 0 else 'weak'
        }
    
    def analyze(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Phân tích và gọi Groq LLM để tổng hợp"""
        
        # Step 1: Tính chỉ báo (Python - FREE)
        indicators = self.calculate_indicators(df)
        
        # Step 2: Tạo user message cho LLM
        user_message = f"""DỮ LIỆU THỊ TRƯỜNG BTC/USDT:
{json.dumps(indicators, indent=2)}

Hãy phân tích và đưa ra tín hiệu giao dịch."""
        
        # Step 3: Gọi Groq LLM (FREE)
        response = llm_client.call_llm(
            provider=self.provider,
            system_prompt=self.SYSTEM_PROMPT,
            user_message=user_message,
            model=self.model
        )
        
        if 'error' in response:
            # Fallback: dùng logic Python thuần
            return self._fallback_analysis(indicators)
        
        # Step 4: Kết hợp kết quả LLM với indicators
        result = response['content']
        result['indicators'] = indicators
        result['token_usage'] = {
            'input_tokens': response['input_tokens'],
            'output_tokens': response['output_tokens'],
            'cost': response['cost']
        }
        
        return result
    
    def _fallback_analysis(self, indicators: Dict) -> Dict[str, Any]:
        """Fallback khi LLM không khả dụng - dùng logic Python"""
        rsi = indicators['rsi']
        trend = indicators['trend']
        
        signals = []
        if rsi < 30:
            signals.append(('LONG', 75))
        elif rsi > 70:
            signals.append(('SHORT', 70))
        
        if trend == 'up':
            signals.append(('LONG', 60))
        else:
            signals.append(('SHORT', 60))
        
        long_count = sum(1 for s in signals if s[0] == 'LONG')
        short_count = sum(1 for s in signals if s[0] == 'SHORT')
        
        if long_count >= 2:
            return {
                'direction': 'LONG',
                'confidence': 70,
                'reasoning': f'RSI={rsi:.1f}, Trend={trend}',
                'indicators': indicators
            }
        elif short_count >= 2:
            return {
                'direction': 'SHORT',
                'confidence': 65,
                'reasoning': f'RSI={rsi:.1f}, Trend={trend}',
                'indicators': indicators
            }
        
        return {
            'direction': 'NEUTRAL',
            'confidence': 30,
            'reasoning': 'Không đủ đồng thuận',
            'indicators': indicators
        }


# Usage example
if __name__ == "__main__":
    import json
    
    # Tạo dữ liệu mẫu
    df = pd.DataFrame({
        'close': [68000 + i * 10 for i in range(100)]
    })
    
    agent = QuantAgent()
    result = agent.analyze(df)
    
    print(json.dumps(result, indent=2))
