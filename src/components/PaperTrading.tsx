import { useState, useEffect, useRef } from 'react';

interface Trade {
  id: number;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number | null;
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  leverage: number;
  status: 'OPEN' | 'CLOSED_TP' | 'CLOSED_SL' | 'CLOSED_MANUAL';
  pnl: number;
  fee: number;
  openedAt: number;
  closedAt: number | null;
  reasoning: string;
}

interface AgentSignal {
  agent: string;
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number;
  reasoning: string;
  timestamp: number;
}

interface MarketData {
  price: number;
  volume24h: number;
  rsi: number;
  macd: number;
  ema20: number;
  ema50: number;
  fundingRate: number;
  openInterest: number;
  fearGreed: number;
  change24h: number;
}

// Generate realistic BTC price movement
function generatePrice(prevPrice: number, volatility: number = 0.002): number {
  const change = (Math.random() - 0.48) * volatility * prevPrice;
  return Math.max(prevPrice + change, prevPrice * 0.95);
}

// Simple RSI calculation
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export default function PaperTrading() {
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(100); // $100 starting balance
  const [equity, setEquity] = useState(100);
  const [prices, setPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState(68500);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [openTrades, setOpenTrades] = useState<Trade[]>([]);
  const [signals, setSignals] = useState<AgentSignal[]>([]);
  const [marketData, setMarketData] = useState<MarketData>({
    price: 68500,
    volume24h: 28500000000,
    rsi: 50,
    macd: 0,
    ema20: 68500,
    ema50: 68200,
    fundingRate: 0.01,
    openInterest: 15200000000,
    fearGreed: 55,
    change24h: 0
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    wins: 0,
    losses: 0,
    totalPnl: 0,
    maxDrawdown: 0,
    winRate: 0,
    profitFactor: 0
  });
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [cmmWarning, setCmmWarning] = useState<string | null>(null);
  const tradeIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Add log entry
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
  };

  // Generate agent signals based on market data
  const generateSignals = (data: MarketData, price: number): AgentSignal[] => {
    const newSignals: AgentSignal[] = [];

    // Quant Agent
    let quantSignal: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
    let quantConfidence = 30;
    let quantReasoning = '';
    if (data.rsi < 30) {
      quantSignal = 'LONG';
      quantConfidence = 75;
      quantReasoning = `RSI=${data.rsi.toFixed(1)} quá bán, tiềm năng hồi`;
    } else if (data.rsi > 70) {
      quantSignal = 'SHORT';
      quantConfidence = 70;
      quantReasoning = `RSI=${data.rsi.toFixed(1)} quá mua, tiềm năng giảm`;
    } else if (data.ema20 > data.ema50 && data.macd > 0) {
      quantSignal = 'LONG';
      quantConfidence = 60;
      quantReasoning = `EMA20 > EMA50, MACD dương - xu hướng tăng`;
    } else if (data.ema20 < data.ema50 && data.macd < 0) {
      quantSignal = 'SHORT';
      quantConfidence = 60;
      quantReasoning = `EMA20 < EMA50, MACD âm - xu hướng giảm`;
    } else {
      quantReasoning = `Thị trường sideway, không có tín hiệu rõ ràng`;
    }
    newSignals.push({
      agent: 'Quant',
      signal: quantSignal,
      confidence: quantConfidence,
      reasoning: quantReasoning,
      timestamp: Date.now()
    });

    // Macro Agent
    let macroSignal: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
    let macroConfidence = 50;
    let macroReasoning = '';
    if (data.fearGreed < 25) {
      macroSignal = 'LONG';
      macroConfidence = 65;
      macroReasoning = `Fear & Greed=${data.fearGreed} - Sợ hãi cực độ, cơ hội mua`;
    } else if (data.fearGreed > 75) {
      macroSignal = 'SHORT';
      macroConfidence = 60;
      macroReasoning = `Fear & Greed=${data.fearGreed} - Tham lam cực độ, cẩn trọng`;
    } else {
      macroSignal = 'NEUTRAL';
      macroConfidence = 40;
      macroReasoning = `Sentiment trung tính (${data.fearGreed})`;
    }
    newSignals.push({
      agent: 'Macro',
      signal: macroSignal,
      confidence: macroConfidence,
      reasoning: macroReasoning,
      timestamp: Date.now()
    });

    // WFI Agent
    let wfiSignal: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
    let wfiConfidence = 45;
    let wfiReasoning = '';
    const wfiRandom = Math.random();
    if (wfiRandom > 0.7) {
      wfiSignal = 'LONG';
      wfiConfidence = 70;
      wfiReasoning = `Cá voi đang gom, Exchange Outflow tăng`;
    } else if (wfiRandom < 0.3) {
      wfiSignal = 'SHORT';
      wfiConfidence = 65;
      wfiReasoning = `Cá voi đang xả, Exchange Inflow tăng mạnh`;
    } else {
      wfiReasoning = `Dòng tiền cá voi trung tính`;
    }
    newSignals.push({
      agent: 'WFI',
      signal: wfiSignal,
      confidence: wfiConfidence,
      reasoning: wfiReasoning,
      timestamp: Date.now()
    });

    // CMM Agent (Trap Detection)
    const trapScore = Math.random() * 100;
    if (trapScore > 70) {
      setCmmWarning(`⚠️ Trap Score: ${trapScore.toFixed(0)}/100 - Có thể là bẫy cá mập!`);
      newSignals.push({
        agent: 'CMM',
        signal: 'NEUTRAL',
        confidence: 80,
        reasoning: `Phát hiện khả năng Stop Hunt (trap=${trapScore.toFixed(0)}%)`,
        timestamp: Date.now()
      });
    } else {
      setCmmWarning(null);
      newSignals.push({
        agent: 'CMM',
        signal: quantSignal,
        confidence: 50,
        reasoning: `Không phát hiện bẫy (trap=${trapScore.toFixed(0)}%)`,
        timestamp: Date.now()
      });
    }

    return newSignals;
  };

  // Risk Agent decision
  const riskDecision = (signals: AgentSignal[], price: number, balance: number): {
    approve: boolean;
    direction: 'LONG' | 'SHORT';
    entry: number;
    sl: number;
    tp: number;
    size: number;
    reasoning: string;
  } => {
    // Count signals
    const longSignals = signals.filter(s => s.signal === 'LONG' && s.confidence >= 60);
    const shortSignals = signals.filter(s => s.signal === 'SHORT' && s.confidence >= 60);
    const hasTrap = signals.some(s => s.agent === 'CMM' && s.confidence >= 70 && s.signal === 'NEUTRAL');

    if (hasTrap) {
      return {
        approve: false,
        direction: 'LONG',
        entry: price,
        sl: 0,
        tp: 0,
        size: 0,
        reasoning: 'CMM phát hiện bẫy → KHÔNG GIAO DỊCH'
      };
    }

    if (longSignals.length >= 2) {
      const avgConfidence = longSignals.reduce((a, b) => a + b.confidence, 0) / longSignals.length;
      const sl = price * 0.98; // 2% SL
      const tp = price * 1.04; // 4% TP (R:R = 1:2)
      const riskAmount = balance * 0.02; // 2% risk
      const size = riskAmount / (price - sl) * price;

      return {
        approve: true,
        direction: 'LONG',
        entry: price,
        sl,
        tp,
        size: Math.min(size, balance * 0.5),
        reasoning: `${longSignals.length} Agent đồng thuận LONG (avg conf: ${avgConfidence.toFixed(0)}%)`
      };
    }

    if (shortSignals.length >= 2) {
      const avgConfidence = shortSignals.reduce((a, b) => a + b.confidence, 0) / shortSignals.length;
      const sl = price * 1.02;
      const tp = price * 0.96;
      const riskAmount = balance * 0.02;
      const size = riskAmount / (sl - price) * price;

      return {
        approve: true,
        direction: 'SHORT',
        entry: price,
        sl,
        tp,
        size: Math.min(size, balance * 0.5),
        reasoning: `${shortSignals.length} Agent đồng thuận SHORT (avg conf: ${avgConfidence.toFixed(0)}%)`
      };
    }

    return {
      approve: false,
      direction: 'LONG',
      entry: price,
      sl: 0,
      tp: 0,
      size: 0,
      reasoning: 'Không đủ đồng thuận (cần ≥2 Agent cùng chiều, confidence ≥60)'
    };
  };

  // Main simulation tick
  const tick = () => {
    setPrices(prev => {
      const newPrice = generatePrice(prev[prev.length - 1] || 68500);
      const newPrices = [...prev, newPrice].slice(-100);
      
      // Update market data
      const rsi = calculateRSI(newPrices);
      const ema20 = newPrices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, newPrices.length);
      const ema50 = newPrices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, newPrices.length);
      const macd = ema20 - ema50;
      const fundingRate = (Math.random() - 0.5) * 0.05;
      const fearGreed = Math.max(10, Math.min(90, 50 + (rsi - 50) * 0.5 + (Math.random() - 0.5) * 10));
      
      const newMarketData: MarketData = {
        price: newPrice,
        volume24h: 28500000000 + (Math.random() - 0.5) * 5000000000,
        rsi,
        macd,
        ema20,
        ema50,
        fundingRate,
        openInterest: 15200000000 + (Math.random() - 0.5) * 2000000000,
        fearGreed,
        change24h: ((newPrice - 68500) / 68500) * 100
      };
      
      setMarketData(newMarketData);
      setCurrentPrice(newPrice);

      // Generate signals (every 5 ticks)
      if (newPrices.length % 5 === 0) {
        const newSignals = generateSignals(newMarketData, newPrice);
        setSignals(newSignals);

        // Risk decision
        const decision = riskDecision(newSignals, newPrice, balance);
        if (decision.approve && openTrades.length < 3) {
          tradeIdRef.current += 1;
          const newTrade: Trade = {
            id: tradeIdRef.current,
            symbol: 'BTC/USDT',
            direction: decision.direction,
            entryPrice: newPrice,
            exitPrice: null,
            stopLoss: decision.sl,
            takeProfit: decision.tp,
            positionSize: decision.size,
            leverage: 5,
            status: 'OPEN',
            pnl: 0,
            fee: decision.size * 0.0002,
            openedAt: Date.now(),
            closedAt: null,
            reasoning: decision.reasoning
          };
          setOpenTrades(prev => [...prev, newTrade]);
          addLog(`🟢 MỞ LỆNH ${decision.direction} @ $${newPrice.toFixed(2)} | SL: $${decision.sl.toFixed(2)} | TP: $${decision.tp.toFixed(2)} | Size: $${decision.size.toFixed(2)}`);
          addLog(`   Lý do: ${decision.reasoning}`);
        }
      }

      // Check open trades for SL/TP
      setOpenTrades(prev => {
        const updated: Trade[] = [];
        const closed: Trade[] = [];

        prev.forEach(trade => {
          let pnl = 0;
          if (trade.direction === 'LONG') {
            pnl = ((newPrice - trade.entryPrice) / trade.entryPrice) * trade.positionSize * trade.leverage;
          } else {
            pnl = ((trade.entryPrice - newPrice) / trade.entryPrice) * trade.positionSize * trade.leverage;
          }
          const fee = trade.positionSize * 0.0005; // entry + exit fee
          const netPnl = pnl - fee;

          // Check SL
          if (trade.direction === 'LONG' && newPrice <= trade.stopLoss) {
            closed.push({ ...trade, exitPrice: trade.stopLoss, pnl: netPnl, status: 'CLOSED_SL', closedAt: Date.now() });
            addLog(`🔴 CẮT LỖ @ $${trade.stopLoss.toFixed(2)} | PnL: $${netPnl.toFixed(2)}`);
          } else if (trade.direction === 'SHORT' && newPrice >= trade.stopLoss) {
            closed.push({ ...trade, exitPrice: trade.stopLoss, pnl: netPnl, status: 'CLOSED_SL', closedAt: Date.now() });
            addLog(`🔴 CẮT LỖ @ $${trade.stopLoss.toFixed(2)} | PnL: $${netPnl.toFixed(2)}`);
          }
          // Check TP
          else if (trade.direction === 'LONG' && newPrice >= trade.takeProfit) {
            closed.push({ ...trade, exitPrice: trade.takeProfit, pnl: netPnl, status: 'CLOSED_TP', closedAt: Date.now() });
            addLog(`🟢 CHỐT LỜI @ $${trade.takeProfit.toFixed(2)} | PnL: +$${netPnl.toFixed(2)}`);
          } else if (trade.direction === 'SHORT' && newPrice <= trade.takeProfit) {
            closed.push({ ...trade, exitPrice: trade.takeProfit, pnl: netPnl, status: 'CLOSED_TP', closedAt: Date.now() });
            addLog(`🟢 CHỐT LỜI @ $${trade.takeProfit.toFixed(2)} | PnL: +$${netPnl.toFixed(2)}`);
          }
          else {
            updated.push({ ...trade, pnl: netPnl });
          }
        });

        if (closed.length > 0) {
          setTrades(prev => [...prev, ...closed]);
          const totalClosedPnl = closed.reduce((a, b) => a + b.pnl, 0);
          setBalance(prev => prev + totalClosedPnl);
        }

        return updated;
      });

      return newPrices;
    });
  };

  // Update equity and stats
  useEffect(() => {
    const unrealizedPnl = openTrades.reduce((a, b) => a + b.pnl, 0);
    setEquity(balance + unrealizedPnl);

    // Calculate stats
    const closedTrades = trades;
    const wins = closedTrades.filter(t => t.pnl > 0).length;
    const losses = closedTrades.filter(t => t.pnl <= 0).length;
    const totalPnl = closedTrades.reduce((a, b) => a + b.pnl, 0);
    const grossProfit = closedTrades.filter(t => t.pnl > 0).reduce((a, b) => a + b.pnl, 0);
    const grossLoss = Math.abs(closedTrades.filter(t => t.pnl < 0).reduce((a, b) => a + b.pnl, 0));
    
    // Max drawdown
    let peak = 100;
    let maxDD = 0;
    let runningBalance = 100;
    closedTrades.forEach(t => {
      runningBalance += t.pnl;
      if (runningBalance > peak) peak = runningBalance;
      const dd = (peak - runningBalance) / peak * 100;
      if (dd > maxDD) maxDD = dd;
    });

    setStats({
      totalTrades: closedTrades.length,
      wins,
      losses,
      totalPnl,
      maxDrawdown: maxDD,
      winRate: closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0
    });

    // Risk level
    if (maxDD > 5) setRiskLevel('HIGH');
    else if (maxDD > 3) setRiskLevel('MEDIUM');
    else setRiskLevel('LOW');
  }, [trades, openTrades, balance]);

  // Start/Stop simulation
  const toggleSimulation = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      addLog('⏸️ Hệ thống tạm dừng');
    } else {
      setIsRunning(true);
      addLog('▶️ Hệ thống khởi động - Paper Trading bắt đầu');
      intervalRef.current = setInterval(tick, 1000);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset
  const resetSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setBalance(100);
    setEquity(100);
    setPrices([]);
    setCurrentPrice(68500);
    setTrades([]);
    setOpenTrades([]);
    setSignals([]);
    setLogs([]);
    setCmmWarning(null);
    tradeIdRef.current = 0;
  };

  // Mini chart component
  const MiniChart = () => {
    if (prices.length < 2) return <div className="h-32 bg-gray-700 rounded flex items-center justify-center text-gray-500">Đang chờ dữ liệu...</div>;
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const width = 100;
    const height = 100;
    
    const points = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isUp = prices[prices.length - 1] >= prices[0];

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill="url(#chartGradient)"
        />
        <polyline
          points={points}
          fill="none"
          stroke={isUp ? '#10b981' : '#ef4444'}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">📈 Paper Trading Simulator</h2>
        <div className="flex gap-2">
          <button
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? '⏸️ Dừng' : '▶️ Bắt đầu'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-600 text-white"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs">Balance</p>
          <p className={`text-lg font-bold ${balance >= 100 ? 'text-green-400' : 'text-red-400'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs">Equity</p>
          <p className={`text-lg font-bold ${equity >= 100 ? 'text-green-400' : 'text-red-400'}`}>
            ${equity.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs">BTC Price</p>
          <p className="text-lg font-bold text-white">${currentPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs">Win Rate</p>
          <p className={`text-lg font-bold ${stats.winRate >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
            {stats.winRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs">Total PnL</p>
          <p className={`text-lg font-bold ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart + Market Data */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm">BTC/USDT - 1s Candles</h3>
            <span className={`text-sm font-medium ${marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
            </span>
          </div>
          <MiniChart />
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="text-center">
              <p className="text-gray-500 text-xs">RSI</p>
              <p className={`text-sm font-medium ${marketData.rsi > 70 ? 'text-red-400' : marketData.rsi < 30 ? 'text-green-400' : 'text-white'}`}>
                {marketData.rsi.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">MACD</p>
              <p className={`text-sm font-medium ${marketData.macd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {marketData.macd.toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Funding</p>
              <p className={`text-sm font-medium ${marketData.fundingRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {marketData.fundingRate.toFixed(3)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">F&G Index</p>
              <p className={`text-sm font-medium ${marketData.fearGreed > 60 ? 'text-green-400' : marketData.fearGreed < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                {marketData.fearGreed.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Agent Signals */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium text-sm mb-3">🤖 Agent Signals</h3>
          {cmmWarning && (
            <div className="bg-red-900/30 border border-red-800/50 rounded p-2 mb-2">
              <p className="text-red-300 text-xs">{cmmWarning}</p>
            </div>
          )}
          <div className="space-y-2">
            {signals.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">Đang chờ tín hiệu...</p>
            ) : (
              signals.map((sig, i) => (
                <div key={i} className="bg-gray-700/50 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-medium">{sig.agent}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      sig.signal === 'LONG' ? 'bg-green-900 text-green-300' :
                      sig.signal === 'SHORT' ? 'bg-red-900 text-red-300' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {sig.signal}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[10px] mt-1">{sig.reasoning}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex-1 bg-gray-600 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${sig.confidence >= 70 ? 'bg-green-400' : sig.confidence >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${sig.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-[10px]">{sig.confidence}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Open Trades + Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium text-sm mb-3">
            📊 Lệnh đang mở ({openTrades.length})
          </h3>
          {openTrades.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-4">Không có lệnh mở</p>
          ) : (
            <div className="space-y-2">
              {openTrades.map(trade => (
                <div key={trade.id} className={`rounded p-3 border ${
                  trade.direction === 'LONG' ? 'bg-green-900/10 border-green-800/30' : 'bg-red-900/10 border-red-800/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        trade.direction === 'LONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {trade.direction} {trade.leverage}x
                      </span>
                      <span className="text-white text-sm font-medium">{trade.symbol}</span>
                    </div>
                    <span className={`text-sm font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-500">Entry:</span>
                      <span className="text-gray-300 ml-1">${trade.entryPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SL:</span>
                      <span className="text-red-400 ml-1">${trade.stopLoss.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">TP:</span>
                      <span className="text-green-400 ml-1">${trade.takeProfit.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="text-gray-300 ml-1">${trade.positionSize.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Stats */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium text-sm mb-3">📊 Hiệu suất</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Tổng lệnh</span>
              <span className="text-white text-xs font-medium">{stats.totalTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Thắng</span>
              <span className="text-green-400 text-xs font-medium">{stats.wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Thua</span>
              <span className="text-red-400 text-xs font-medium">{stats.losses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Win Rate</span>
              <span className="text-white text-xs font-medium">{stats.winRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Profit Factor</span>
              <span className="text-white text-xs font-medium">
                {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Max Drawdown</span>
              <span className={`text-xs font-medium ${riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                {stats.maxDrawdown.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Risk Level</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                riskLevel === 'HIGH' ? 'bg-red-900 text-red-300' :
                riskLevel === 'MEDIUM' ? 'bg-yellow-900 text-yellow-300' :
                'bg-green-900 text-green-300'
              }`}>
                {riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade History + Logs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium text-sm mb-3">📜 Lịch sử giao dịch</h3>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {trades.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">Chưa có giao dịch</p>
            ) : (
              [...trades].reverse().map(trade => (
                <div key={trade.id} className="flex items-center justify-between py-1.5 border-b border-gray-700/50 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded ${
                      trade.status === 'CLOSED_TP' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {trade.direction}
                    </span>
                    <span className="text-gray-300">@ ${trade.exitPrice?.toFixed(2)}</span>
                  </div>
                  <span className={`font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium text-sm mb-3">📋 System Logs</h3>
          <div className="max-h-48 overflow-y-auto space-y-1 font-mono">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">Nhấn "Bắt đầu" để chạy hệ thống</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-gray-400 text-[10px] leading-tight">{log}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
