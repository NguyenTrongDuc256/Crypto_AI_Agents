import { useState } from 'react';

const codeSamples = [
  {
    id: 'data',
    title: 'Data Agent - Kéo dữ liệu giá',
    icon: '📊',
    description: 'Kết nối Binance API qua CCXT',
    code: `import ccxt
import pandas as pd
from datetime import datetime, timezone

class DataAgent:
    def __init__(self):
        self.exchange = ccxt.binance({
            'enableRateLimit': True,
            'options': {'defaultType': 'future'}
        })
        self.cache = {}

    def fetch_ohlcv(self, symbol, timeframe='1h', limit=100):
        ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
        df = pd.DataFrame(ohlcv, columns=['timestamp','open','high','low','close','volume'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms', utc=True)
        return df.dropna()

    def get_market_snapshot(self, symbol='BTC/USDT'):
        df = self.fetch_ohlcv(symbol)
        latest = df.iloc[-1]
        return {
            'symbol': symbol,
            'price': latest['close'],
            'volume_24h': latest['volume'],
            'timestamp': datetime.now(timezone.utc).isoformat()
        }`
  },
  {
    id: 'quant',
    title: 'Quant Agent - Phân tích kỹ thuật',
    icon: '🧠',
    description: 'Tính RSI, MACD, EMA và đưa tín hiệu',
    code: `import pandas as pd
import numpy as np

class QuantAgent:
    def calculate_rsi(self, prices, period=14):
        delta = prices.diff()
        gain = delta.where(delta > 0, 0).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))

    def calculate_ema(self, prices, period):
        return prices.ewm(span=period, adjust=False).mean()

    def analyze(self, df):
        close = df['close']
        rsi = self.calculate_rsi(close).iloc[-1]
        ema_20 = self.calculate_ema(close, 20).iloc[-1]
        ema_50 = self.calculate_ema(close, 50).iloc[-1]

        signals = []
        if rsi < 30:
            signals.append(('LONG', 75))
        elif rsi > 70:
            signals.append(('SHORT', 70))

        if ema_20 > ema_50:
            signals.append(('LONG', 60))
        else:
            signals.append(('SHORT', 60))

        long_count = sum(1 for s in signals if s[0] == 'LONG')
        short_count = sum(1 for s in signals if s[0] == 'SHORT')

        if long_count >= 2:
            return {'direction': 'LONG', 'confidence': 70}
        elif short_count >= 2:
            return {'direction': 'SHORT', 'confidence': 65}
        return {'direction': 'NEUTRAL', 'confidence': 30}`
  },
  {
    id: 'risk',
    title: 'Risk Agent - Quản lý rủi ro',
    icon: '🛡️',
    description: 'Tính SL/TP, Position Size, quyền VETO',
    code: `class RiskAgent:
    def __init__(self, balance):
        self.balance = balance
        self.max_risk = 0.02  # 2% per trade
        self.max_trades = 3
        self.min_confidence = 65
        self.fee_rate = 0.0007

    def calculate_position_size(self, entry, sl):
        risk_amount = self.balance * self.max_risk
        distance = abs(entry - sl)
        if distance == 0: return 0
        size = (risk_amount / distance) * entry
        return min(size, self.balance * 0.5)

    def calculate_tp(self, entry, sl, direction):
        distance = abs(entry - sl)
        if direction == 'LONG':
            return entry + (distance * 2) * (1 + self.fee_rate)
        else:
            return entry - (distance * 2) * (1 - self.fee_rate)

    def evaluate(self, signal, cmm_trap_score, open_trades):
        if cmm_trap_score > 70:
            return {'decision': 'REJECT', 'reason': 'Trap detected'}
        if signal['confidence'] < self.min_confidence:
            return {'decision': 'REJECT', 'reason': 'Low confidence'}
        if len(open_trades) >= self.max_trades:
            return {'decision': 'REJECT', 'reason': 'Max trades reached'}

        price = signal['current_price']
        atr = price * 0.02
        sl = price - atr * 1.5 if signal['direction'] == 'LONG' else price + atr * 1.5
        tp = self.calculate_tp(price, sl, signal['direction'])
        size = self.calculate_position_size(price, sl)

        return {
            'decision': 'APPROVE',
            'direction': signal['direction'],
            'entry': price, 'stop_loss': sl, 'take_profit': tp,
            'position_size': size, 'leverage': 5
        }`
  },
  {
    id: 'treasury',
    title: 'Treasury Agent - Sổ cái kép',
    icon: '🧾',
    description: 'Double-entry ledger, reconciliation',
    code: `from decimal import Decimal
from datetime import datetime, timezone

class TreasuryAgent:
    def __init__(self):
        self.cash = Decimal('100.00')
        self.positions = {}
        self.realized_pnl = Decimal('0')
        self.fees_paid = Decimal('0')
        self.ledger = []
        self.tax_lots = []

    def record_fill(self, trade_id, price, size, fee):
        cost = price * size + fee
        self.cash -= cost
        self.fees_paid += fee
        self.positions[trade_id] = {
            'entry_price': price, 'size': size, 'fee': fee
        }
        self.ledger.append({
            'type': 'FILL', 'trade_id': trade_id,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })

    def record_close(self, trade_id, exit_price, fee):
        pos = self.positions[trade_id]
        pnl = (exit_price - pos['entry_price']) * pos['size']
        total_fee = pos['fee'] + fee
        net_pnl = pnl - total_fee

        self.cash += exit_price * pos['size'] - fee
        self.realized_pnl += net_pnl
        self.fees_paid += fee

        self.tax_lots.append({
            'trade_id': trade_id,
            'cost_basis': float(pos['entry_price'] * pos['size']),
            'proceeds': float(exit_price * pos['size']),
            'gain_loss': float(net_pnl)
        })
        del self.positions[trade_id]
        return {'net_pnl': net_pnl}

    def reconcile(self, exchange_balance):
        internal = self.cash + self.realized_pnl
        drift = abs(internal - exchange_balance)
        drift_pct = (drift / exchange_balance * 100)
        if drift_pct > 0.5:
            return {'status': 'CRITICAL', 'action': 'KILL_SWITCH'}
        return {'status': 'OK', 'drift_pct': float(drift_pct)}`
  },
  {
    id: 'cfo',
    title: 'CFO Agent - Hòa vốn & Lợi nhuận',
    icon: '💰',
    description: 'Break-even analysis, OPEX tracking',
    code: `class CFOAgent:
    def __init__(self):
        self.opex = {
            'server': 0, 'database': 0,
            'llm_api': 2.43, 'data_api': 0
        }
        self.target_opex = 5.00

    def break_even(self, win_rate, avg_win, avg_loss, trades_month):
        ev = (win_rate * avg_win) - ((1 - win_rate) * avg_loss)
        monthly_profit = ev * trades_month
        total_opex = sum(self.opex.values())
        net = monthly_profit - total_opex

        if ev > 0:
            be_trades = total_opex / ev
        else:
            be_trades = float('inf')

        return {
            'expected_value': round(ev, 4),
            'monthly_net': round(net, 2),
            'breakeven_trades': round(be_trades),
            'profitable': net > 0
        }

    def audit_trade(self, gross_pnl, fees, funding, slippage):
        net = gross_pnl - fees - abs(funding) - abs(slippage)
        return {
            'gross': round(gross_pnl, 4),
            'total_costs': round(fees + abs(funding) + abs(slippage), 4),
            'net_pnl': round(net, 4),
            'actually_profitable': net > 0
        }

    def monthly_report(self, stats):
        analysis = self.break_even(
            stats['win_rate'], stats['avg_win'],
            stats['avg_loss'], stats['trades_per_month']
        )
        total_opex = sum(self.opex.values())
        status = 'OK' if total_opex <= self.target_opex else 'OVER'
        return {
            'opex': total_opex, 'status': status,
            'break_even': analysis,
            'recommendation': 'Scale up' if analysis['profitable'] else 'Optimize'
        }`
  },
  {
    id: 'acc',
    title: 'ACC Agent - Kiểm soát Token Burn',
    icon: '🤖',
    description: 'Theo dõi chi phí AI, tối ưu LLM',
    code: `class ACCAgent:
    PRICING = {
        'claude-3.5-sonnet': {'input': 3.0, 'output': 15.0},
        'groq-llama3': {'input': 0, 'output': 0},
        'gemini-flash': {'input': 0, 'output': 0},
    }
    ALLOCATION = {
        'data': None, 'quant': 'groq-llama3',
        'macro': 'groq-llama3', 'risk': 'claude-3.5-sonnet',
        'execution': None, 'cfo': 'gemini-flash',
        'bi': 'gemini-flash', 'cmm': 'claude-3.5-sonnet',
        'wfi': 'groq-llama3', 'treasury': None,
    }

    def __init__(self):
        self.daily_burn = {}
        self.monthly_budget = 5.00

    def record_usage(self, agent, input_tokens, output_tokens):
        model = self.ALLOCATION.get(agent)
        if not model:
            return {'cost': 0}
        pricing = self.PRICING[model]
        cost = (input_tokens / 1e6) * pricing['input'] + \\
               (output_tokens / 1e6) * pricing['output']
        return {'agent': agent, 'model': model, 'cost': round(cost, 6)}

    def daily_report(self):
        total_cost = sum(b.get('cost', 0) for b in self.daily_burn.values())
        projection = total_cost * 30
        return {
            'daily_cost': round(total_cost, 4),
            'monthly_projection': round(projection, 2),
            'budget_remaining': round(self.monthly_budget - projection, 2),
            'status': 'OK' if projection <= self.monthly_budget else 'OVER'
        }

    def optimize(self):
        suggestions = []
        for agent, data in self.daily_burn.items():
            model = self.ALLOCATION.get(agent)
            if model == 'claude-3.5-sonnet' and data.get('calls', 0) > 50:
                suggestions.append(f"{agent}: Consider Groq for simple tasks")
        return suggestions or ["All optimal"]`
  },
  {
    id: 'orchestrator',
    title: 'Main Orchestrator - LangGraph',
    icon: '🔄',
    description: 'Điều phối 11 Agents',
    code: `class CryptoAICompany:
    def __init__(self, balance=100.0):
        self.data = DataAgent()
        self.quant = QuantAgent()
        self.risk = RiskAgent(balance)
        self.treasury = TreasuryAgent()
        self.cfo = CFOAgent()
        self.acc = ACCAgent()
        self.balance = balance
        self.open_trades = []

    def run_cycle(self, symbol='BTC/USDT'):
        # Phase A: Data
        snapshot = self.data.get_market_snapshot(symbol)
        df = self.data.fetch_ohlcv(symbol)

        # Phase B: Analysis
        signal = self.quant.analyze(df)
        self.acc.record_usage('quant', 2000, 500)

        # Phase C: Risk
        trap_score = 30  # from CMM agent
        decision = self.risk.evaluate(signal, trap_score, self.open_trades)
        self.acc.record_usage('risk', 1500, 400)

        if decision['decision'] == 'REJECT':
            return {'status': 'REJECTED', 'reason': decision['reason']}

        # Phase D: Execute
        # exec_result = execution_agent.execute(decision)
        # self.treasury.record_fill(...)

        # Summary
        report = self.acc.daily_report()
        return {
            'status': 'APPROVED',
            'trade': decision,
            'ai_cost': report['daily_cost']
        }

# Main
company = CryptoAICompany(balance=100.0)
for i in range(10):
    result = company.run_cycle('BTC/USDT')
    print(f"Cycle {i+1}: {result['status']}")`
  }
];

export default function CodeSamples() {
  const [selected, setSelected] = useState(codeSamples[0]);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🐍 Code Python Mẫu</h2>
        <span className="text-gray-400 text-sm">{codeSamples.length} modules</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <p className="text-gray-400 text-xs font-medium">📁 crypto_ai_company/agents/</p>
          </div>
          <div className="p-2 space-y-1">
            {codeSamples.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-all flex items-center gap-2 ${
                  selected.id === s.id
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <span>{s.icon}</span>
                <span className="truncate">{s.id}_agent.py</span>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-3 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <span className="text-lg">{selected.icon}</span>
              <div>
                <h3 className="text-white text-sm font-medium">{selected.title}</h3>
                <p className="text-gray-400 text-xs">{selected.description}</p>
              </div>
            </div>
            <button
              onClick={copyCode}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                copied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
              <code>{selected.code}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">🏗️ Kiến trúc hệ thống</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-medium mb-1">Phase A: Data</p>
            <p className="text-gray-400 text-xs">Data → WFI → Macro → Treasury</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-yellow-300 text-sm font-medium mb-1">Phase B: Analysis</p>
            <p className="text-gray-400 text-xs">Quant → CMM → Risk → CFO</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-red-300 text-sm font-medium mb-1">Phase C: Execute</p>
            <p className="text-gray-400 text-xs">Execution → Treasury → BI → ACC</p>
          </div>
        </div>
        <div className="mt-3 bg-gray-700/50 rounded-lg p-3">
          <p className="text-green-300 text-sm font-medium mb-1">Tech Stack</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Python', 'LangGraph', 'CCXT', 'PostgreSQL', 'Redis', 'Docker', 'Claude', 'Groq', 'Gemini'].map(t => (
              <span key={t} className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
