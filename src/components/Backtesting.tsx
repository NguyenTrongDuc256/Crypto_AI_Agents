import { useState, useEffect, useRef } from 'react';

interface BacktestTrade {
  id: number;
  entryDate: number;
  exitDate: number;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  fee: number;
  holdTime: number; // hours
}

interface BacktestResult {
  trades: BacktestTrade[];
  equityCurve: number[];
  drawdownCurve: number[];
  monthlyReturns: number[][];
  stats: {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalReturn: number;
    annualizedReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    avgHoldTime: number;
    totalFees: number;
  };
}

// Generate synthetic historical BTC data (365 days)
function generateHistoricalData(days: number = 365): number[] {
  const prices: number[] = [];
  let price = 42000; // Start price
  const dailyVolatility = 0.025;

  for (let i = 0; i < days * 24; i++) { // hourly data
    const trend = Math.sin(i / 200) * 0.001; // Long-term trend
    const noise = (Math.random() - 0.48) * dailyVolatility * 0.1;
    price = price * (1 + trend + noise);
    price = Math.max(price, 20000);
    prices.push(price);
  }
  return prices;
}

// Simple backtest strategy
function runBacktest(prices: number[], strategy: string): BacktestResult {
  const trades: BacktestTrade[] = [];
  const equityCurve: number[] = [100]; // Start with $100
  let balance = 100;
  let peak = 100;
  const drawdownCurve: number[] = [0];
  let tradeId = 0;

  // Strategy parameters
  const rsiPeriod = 14;
  const emaShort = 20;
  const emaLong = 50;
  const riskPerTrade = 0.02;
  const leverage = 5;

  let inPosition = false;
  let positionDirection: 'LONG' | 'SHORT' = 'LONG';
  let entryPrice = 0;
  let entryIdx = 0;
  let stopLoss = 0;
  let takeProfit = 0;

  for (let i = emaLong + rsiPeriod; i < prices.length; i++) {
    // Calculate indicators
    const slice = prices.slice(i - rsiPeriod, i + 1);
    let gains = 0, losses = 0;
    for (let j = 1; j < slice.length; j++) {
      const diff = slice[j] - slice[j - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / rsiPeriod;
    const avgLoss = losses / rsiPeriod;
    const rsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));

    const emaS = prices.slice(i - emaShort, i + 1).reduce((a, b) => a + b, 0) / emaShort;
    const emaL = prices.slice(i - emaLong, i + 1).reduce((a, b) => a + b, 0) / emaLong;

    const currentPrice = prices[i];

    // Check exit if in position
    if (inPosition) {
      let shouldExit = false;
      let exitPrice = currentPrice;

      if (positionDirection === 'LONG') {
        if (currentPrice <= stopLoss) { exitPrice = stopLoss; shouldExit = true; }
        else if (currentPrice >= takeProfit) { exitPrice = takeProfit; shouldExit = true; }
      } else {
        if (currentPrice >= stopLoss) { exitPrice = stopLoss; shouldExit = true; }
        else if (currentPrice <= takeProfit) { exitPrice = takeProfit; shouldExit = true; }
      }

      if (shouldExit) {
        const rawPnl = positionDirection === 'LONG'
          ? ((exitPrice - entryPrice) / entryPrice) * balance * riskPerTrade * leverage
          : ((entryPrice - exitPrice) / entryPrice) * balance * riskPerTrade * leverage;
        const fee = balance * riskPerTrade * leverage * 0.0007;
        const netPnl = rawPnl - fee;
        balance += netPnl;

        tradeId++;
        trades.push({
          id: tradeId,
          entryDate: entryIdx,
          exitDate: i,
          direction: positionDirection,
          entryPrice,
          exitPrice,
          pnl: netPnl,
          pnlPercent: (netPnl / (balance - netPnl)) * 100,
          fee,
          holdTime: (i - entryIdx)
        });

        inPosition = false;
      }
    }

    // Check entry if not in position
    if (!inPosition) {
      let signal: 'LONG' | 'SHORT' | null = null;

      if (strategy === 'rsi_ema') {
        if (rsi < 30 && emaS > emaL) signal = 'LONG';
        else if (rsi > 70 && emaS < emaL) signal = 'SHORT';
      } else if (strategy === 'ema_cross') {
        const prevEmaS = prices.slice(i - 1 - emaShort, i).reduce((a, b) => a + b, 0) / emaShort;
        const prevEmaL = prices.slice(i - 1 - emaLong, i).reduce((a, b) => a + b, 0) / emaLong;
        if (prevEmaS <= prevEmaL && emaS > emaL) signal = 'LONG';
        else if (prevEmaS >= prevEmaL && emaS < emaL) signal = 'SHORT';
      } else if (strategy === 'mean_reversion') {
        const sma20 = prices.slice(i - 20, i).reduce((a, b) => a + b, 0) / 20;
        const std20 = Math.sqrt(prices.slice(i - 20, i).reduce((sum, p) => sum + Math.pow(p - sma20, 2), 0) / 20);
        if (currentPrice < sma20 - 2 * std20) signal = 'LONG';
        else if (currentPrice > sma20 + 2 * std20) signal = 'SHORT';
      }

      if (signal && balance > 10) {
        inPosition = true;
        positionDirection = signal;
        entryPrice = currentPrice;
        entryIdx = i;
        const atr = currentPrice * 0.02;
        if (signal === 'LONG') {
          stopLoss = currentPrice - atr * 1.5;
          takeProfit = currentPrice + atr * 3;
        } else {
          stopLoss = currentPrice + atr * 1.5;
          takeProfit = currentPrice - atr * 3;
        }
      }
    }

    // Update equity curve (every 24 ticks = 1 day)
    if (i % 24 === 0) {
      equityCurve.push(balance);
      if (balance > peak) peak = balance;
      const dd = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
      drawdownCurve.push(dd);
    }
  }

  // Calculate stats
  const wins = trades.filter(t => t.pnl > 0);
  const lossesArr = trades.filter(t => t.pnl <= 0);
  const grossProfit = wins.reduce((a, b) => a + b.pnl, 0);
  const grossLoss = Math.abs(lossesArr.reduce((a, b) => a + b.pnl, 0));

  const totalReturn = ((balance - 100) / 100) * 100;
  const annualizedReturn = totalReturn; // ~1 year of data

  const stats = {
    totalTrades: trades.length,
    wins: wins.length,
    losses: lossesArr.length,
    winRate: trades.length > 0 ? (wins.length / trades.length) * 100 : 0,
    totalReturn,
    annualizedReturn,
    maxDrawdown: Math.max(...drawdownCurve),
    sharpeRatio: trades.length > 0 ? (totalReturn / (Math.max(...drawdownCurve) || 1)) : 0,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0,
    avgWin: wins.length > 0 ? grossProfit / wins.length : 0,
    avgLoss: lossesArr.length > 0 ? grossLoss / lossesArr.length : 0,
    largestWin: wins.length > 0 ? Math.max(...wins.map(t => t.pnl)) : 0,
    largestLoss: lossesArr.length > 0 ? Math.min(...lossesArr.map(t => t.pnl)) : 0,
    avgHoldTime: trades.length > 0 ? trades.reduce((a, b) => a + b.holdTime, 0) / trades.length : 0,
    totalFees: trades.reduce((a, b) => a + b.fee, 0)
  };

  // Monthly returns (12 months x 1 row)
  const monthlyReturns: number[][] = [];
  const monthsData: number[] = new Array(12).fill(0);
  trades.forEach(t => {
    const month = Math.floor(t.exitDate / (24 * 30));
    if (month < 12) monthsData[month] += t.pnl;
  });
  monthlyReturns.push(monthsData);

  return { trades, equityCurve, drawdownCurve, monthlyReturns, stats };
}

export default function Backtesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [strategy, setStrategy] = useState('rsi_ema');
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<BacktestTrade | null>(null);

  const runBacktestHandler = () => {
    setIsRunning(true);
    setTimeout(() => {
      const prices = generateHistoricalData(365);
      const res = runBacktest(prices, strategy);
      setResult(res);
      setIsRunning(false);
    }, 500);
  };

  const EquityChart = () => {
    if (!result) return null;
    const data = result.equityCurve;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 100, h = 100;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');

    const isUp = data[data.length - 1] >= data[0];

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#eqGrad)" />
        <polyline points={points} fill="none" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1={h - ((100 - min) / range) * h} x2={w} y2={h - ((100 - min) / range) * h} stroke="#6b7280" strokeWidth="0.5" strokeDasharray="2" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  };

  const DrawdownChart = () => {
    if (!result) return null;
    const data = result.drawdownCurve;
    const max = Math.max(...data) || 1;
    const w = 100, h = 60;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = (v / max) * h;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <polygon points={`0,0 ${points} ${w},0`} fill="url(#ddGrad)" />
        <polyline points={points} fill="none" stroke="#ef4444" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">📊 Backtesting Engine</h2>
        <div className="flex gap-2">
          <select
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2"
          >
            <option value="rsi_ema">RSI + EMA Combo</option>
            <option value="ema_cross">EMA Crossover</option>
            <option value="mean_reversion">Mean Reversion (Bollinger)</option>
          </select>
          <button
            onClick={runBacktestHandler}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isRunning ? '⏳ Đang chạy...' : '🚀 Chạy Backtest'}
          </button>
        </div>
      </div>

      {!result ? (
        <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
          <p className="text-4xl mb-4">📊</p>
          <h3 className="text-white font-medium mb-2">Chọn chiến lược và chạy Backtest</h3>
          <p className="text-gray-400 text-sm">Dữ liệu mô phỏng 365 ngày BTC/USDT hourly</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-6 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Total Return</p>
              <p className={`text-lg font-bold ${result.stats.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.stats.totalReturn >= 0 ? '+' : ''}{result.stats.totalReturn.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Win Rate</p>
              <p className={`text-lg font-bold ${result.stats.winRate >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                {result.stats.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Profit Factor</p>
              <p className={`text-lg font-bold ${result.stats.profitFactor >= 1.5 ? 'text-green-400' : 'text-red-400'}`}>
                {result.stats.profitFactor === 999 ? '∞' : result.stats.profitFactor.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Max Drawdown</p>
              <p className="text-lg font-bold text-red-400">-{result.stats.maxDrawdown.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Sharpe Ratio</p>
              <p className={`text-lg font-bold ${result.stats.sharpeRatio >= 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                {result.stats.sharpeRatio.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Total Trades</p>
              <p className="text-lg font-bold text-white">{result.stats.totalTrades}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium text-sm mb-2">📈 Equity Curve</h3>
              <EquityChart />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Start: $100</span>
                <span>End: ${result.equityCurve[result.equityCurve.length - 1].toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium text-sm mb-2">📉 Drawdown</h3>
              <DrawdownChart />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Max DD: -{result.stats.maxDrawdown.toFixed(1)}%</span>
                <span>Avg DD: -{(result.drawdownCurve.reduce((a, b) => a + b, 0) / result.drawdownCurve.length).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium text-sm mb-3">📊 Thống kê lệnh</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Tổng lệnh</span><span className="text-white">{result.stats.totalTrades}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Thắng</span><span className="text-green-400">{result.stats.wins}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Thua</span><span className="text-red-400">{result.stats.losses}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Avg Hold Time</span><span className="text-white">{result.stats.avgHoldTime.toFixed(0)}h</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Total Fees</span><span className="text-yellow-400">${result.stats.totalFees.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium text-sm mb-3">💰 PnL Analysis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Avg Win</span><span className="text-green-400">+${result.stats.avgWin.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Avg Loss</span><span className="text-red-400">-${result.stats.avgLoss.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Largest Win</span><span className="text-green-400">+${result.stats.largestWin.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Largest Loss</span><span className="text-red-400">${result.stats.largestLoss.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">R:R Ratio</span><span className="text-white">1:{(result.stats.avgWin / (result.stats.avgLoss || 1)).toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium text-sm mb-3">🎯 Đánh giá</h3>
              <div className="space-y-2 text-sm">
                {result.stats.winRate >= 50 && result.stats.profitFactor >= 1.5 ? (
                  <div className="bg-green-900/20 border border-green-800/30 rounded p-2">
                    <p className="text-green-300 text-xs">✅ Chiến lược KHẢ QUAN</p>
                    <p className="text-gray-400 text-[10px] mt-1">Win rate &gt; 50%, PF &gt; 1.5</p>
                  </div>
                ) : (
                  <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-2">
                    <p className="text-yellow-300 text-xs">⚠️ Cần tối ưu thêm</p>
                    <p className="text-gray-400 text-[10px] mt-1">Xem xét điều chỉnh tham số</p>
                  </div>
                )}
                {result.stats.maxDrawdown > 10 && (
                  <div className="bg-red-900/20 border border-red-800/30 rounded p-2">
                    <p className="text-red-300 text-xs">🚨 Drawdown quá cao</p>
                    <p className="text-gray-400 text-[10px] mt-1">Giảm leverage hoặc risk per trade</p>
                  </div>
                )}
                {result.stats.totalFees > result.stats.avgWin * result.stats.wins * 0.1 && (
                  <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-2">
                    <p className="text-yellow-300 text-xs">💸 Phí giao dịch cao</p>
                    <p className="text-gray-400 text-[10px] mt-1">Xem xét giảm tần suất</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Returns */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">📅 Monthly Returns</h3>
            <div className="grid grid-cols-12 gap-1">
              {result.monthlyReturns[0].map((ret, i) => (
                <div key={i} className={`rounded p-2 text-center ${
                  ret > 0 ? 'bg-green-900/30 border border-green-800/30' :
                  ret < 0 ? 'bg-red-900/30 border border-red-800/30' :
                  'bg-gray-700/30 border border-gray-600/30'
                }`}>
                  <p className="text-gray-400 text-[10px]">T{i + 1}</p>
                  <p className={`text-xs font-medium ${ret > 0 ? 'text-green-400' : ret < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {ret >= 0 ? '+' : ''}{ret.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trade List */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">📜 Danh sách lệnh ({result.trades.length})</h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="text-gray-400 sticky top-0 bg-gray-800">
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Dir</th>
                    <th className="text-right py-2">Entry</th>
                    <th className="text-right py-2">Exit</th>
                    <th className="text-right py-2">PnL</th>
                    <th className="text-right py-2">PnL %</th>
                    <th className="text-right py-2">Hold</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.map(t => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTrade(t)}
                      className={`border-b border-gray-700/30 cursor-pointer hover:bg-gray-700/30 ${selectedTrade?.id === t.id ? 'bg-blue-900/20' : ''}`}
                    >
                      <td className="py-1.5 text-gray-300">{t.id}</td>
                      <td className="py-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${t.direction === 'LONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {t.direction}
                        </span>
                      </td>
                      <td className="py-1.5 text-right text-gray-300">${t.entryPrice.toFixed(0)}</td>
                      <td className="py-1.5 text-right text-gray-300">${t.exitPrice.toFixed(0)}</td>
                      <td className={`py-1.5 text-right font-medium ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                      </td>
                      <td className={`py-1.5 text-right ${t.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent.toFixed(2)}%
                      </td>
                      <td className="py-1.5 text-right text-gray-400">{t.holdTime}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
