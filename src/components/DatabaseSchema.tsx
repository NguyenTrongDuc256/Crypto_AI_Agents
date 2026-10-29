export default function DatabaseSchema() {
  const tables = [
    {
      name: 'market_data',
      description: 'Dữ liệu giá OHLCV từ các sàn',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'symbol', type: 'VARCHAR(20)', note: 'BTC/USDT' },
        { name: 'exchange', type: 'VARCHAR(20)', note: 'binance' },
        { name: 'timeframe', type: 'VARCHAR(5)', note: '1h, 4h, 1d' },
        { name: 'timestamp', type: 'TIMESTAMPTZ', note: 'UTC' },
        { name: 'open', type: 'DECIMAL(20,8)' },
        { name: 'high', type: 'DECIMAL(20,8)' },
        { name: 'low', type: 'DECIMAL(20,8)' },
        { name: 'close', type: 'DECIMAL(20,8)' },
        { name: 'volume', type: 'DECIMAL(20,8)' },
        { name: 'missing_data', type: 'BOOLEAN', note: 'default false' },
      ],
      indexes: ['(symbol, timeframe, timestamp) UNIQUE', '(timestamp DESC)']
    },
    {
      name: 'trades',
      description: 'Lịch sử giao dịch',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'trade_id', type: 'UUID', note: 'unique' },
        { name: 'symbol', type: 'VARCHAR(20)' },
        { name: 'direction', type: "VARCHAR(5)", note: 'LONG/SHORT' },
        { name: 'entry_price', type: 'DECIMAL(20,8)' },
        { name: 'exit_price', type: 'DECIMAL(20,8)', note: 'nullable' },
        { name: 'stop_loss', type: 'DECIMAL(20,8)' },
        { name: 'take_profit', type: 'DECIMAL(20,8)' },
        { name: 'position_size', type: 'DECIMAL(20,8)' },
        { name: 'leverage', type: 'INTEGER', note: 'default 5' },
        { name: 'status', type: "VARCHAR(20)", note: 'OPEN/CLOSED_TP/CLOSED_SL' },
        { name: 'pnl', type: 'DECIMAL(20,8)' },
        { name: 'fee', type: 'DECIMAL(20,8)' },
        { name: 'reasoning', type: 'TEXT' },
        { name: 'opened_at', type: 'TIMESTAMPTZ' },
        { name: 'closed_at', type: 'TIMESTAMPTZ', note: 'nullable' },
      ],
      indexes: ['(status)', '(opened_at DESC)', '(symbol, direction)']
    },
    {
      name: 'agent_signals',
      description: 'Tín hiệu từ các Agent',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'agent_name', type: 'VARCHAR(20)', note: 'quant/macro/cmm/wfi' },
        { name: 'symbol', type: 'VARCHAR(20)' },
        { name: 'signal', type: "VARCHAR(10)", note: 'LONG/SHORT/NEUTRAL' },
        { name: 'confidence', type: 'INTEGER', note: '0-100' },
        { name: 'reasoning', type: 'TEXT' },
        { name: 'metadata', type: 'JSONB', note: 'indicators data' },
        { name: 'created_at', type: 'TIMESTAMPTZ' },
      ],
      indexes: ['(agent_name, created_at DESC)', '(symbol, created_at)']
    },
    {
      name: 'ledger',
      description: 'Sổ cái kép (double-entry)',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'entry_type', type: 'VARCHAR(20)', note: 'INTENT/FILL/CLOSE/FEE/FUNDING' },
        { name: 'trade_id', type: 'UUID' },
        { name: 'account', type: 'VARCHAR(30)', note: 'cash/positions/fees' },
        { name: 'debit', type: 'DECIMAL(20,8)', note: 'default 0' },
        { name: 'credit', type: 'DECIMAL(20,8)', note: 'default 0' },
        { name: 'balance_after', type: 'DECIMAL(20,8)' },
        { name: 'description', type: 'TEXT' },
        { name: 'created_at', type: 'TIMESTAMPTZ' },
      ],
      indexes: ['(trade_id)', '(account, created_at)', '(entry_type)']
    },
    {
      name: 'token_usage',
      description: 'Theo dõi token burn',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'agent_name', type: 'VARCHAR(20)' },
        { name: 'model', type: 'VARCHAR(30)', note: 'claude/groq/gemini' },
        { name: 'input_tokens', type: 'INTEGER' },
        { name: 'output_tokens', type: 'INTEGER' },
        { name: 'cost_usd', type: 'DECIMAL(10,6)' },
        { name: 'trade_id', type: 'UUID', note: 'nullable' },
        { name: 'created_at', type: 'TIMESTAMPTZ' },
      ],
      indexes: ['(agent_name, created_at)', '(created_at DESC)']
    },
    {
      name: 'whale_events',
      description: 'Sự kiện cá voi',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'event_id', type: 'UUID', note: 'unique' },
        { name: 'event_type', type: 'VARCHAR(30)', note: 'large_trade/inflow/outflow' },
        { name: 'symbol', type: 'VARCHAR(20)' },
        { name: 'amount_usd', type: 'DECIMAL(20,2)' },
        { name: 'address', type: 'VARCHAR(100)', note: 'wallet address' },
        { name: 'exchange', type: 'VARCHAR(20)', note: 'nullable' },
        { name: 'metadata', type: 'JSONB' },
        { name: 'detected_at', type: 'TIMESTAMPTZ' },
      ],
      indexes: ['(event_type, detected_at)', '(symbol, detected_at DESC)']
    },
    {
      name: 'news_sentiment',
      description: 'Tin tức & cảm xúc',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'source', type: 'VARCHAR(20)', note: 'cryptopanic/telegram' },
        { name: 'title', type: 'TEXT' },
        { name: 'url', type: 'TEXT' },
        { name: 'sentiment_score', type: 'INTEGER', note: '-10 to +10' },
        { name: 'impact_level', type: 'VARCHAR(10)', note: 'LOW/MED/HIGH/CRITICAL' },
        { name: 'related_symbols', type: 'TEXT[]', note: 'array' },
        { name: 'published_at', type: 'TIMESTAMPTZ' },
        { name: 'analyzed_at', type: 'TIMESTAMPTZ' },
      ],
      indexes: ['(sentiment_score)', '(published_at DESC)', '(impact_level)']
    },
    {
      name: 'performance_metrics',
      description: 'Hiệu suất hệ thống',
      columns: [
        { name: 'id', type: 'BIGSERIAL', pk: true },
        { name: 'date', type: 'DATE' },
        { name: 'total_trades', type: 'INTEGER' },
        { name: 'wins', type: 'INTEGER' },
        { name: 'losses', type: 'INTEGER' },
        { name: 'win_rate', type: 'DECIMAL(5,2)' },
        { name: 'profit_factor', type: 'DECIMAL(5,2)' },
        { name: 'total_pnl', type: 'DECIMAL(20,8)' },
        { name: 'max_drawdown', type: 'DECIMAL(5,2)' },
        { name: 'sharpe_ratio', type: 'DECIMAL(5,2)' },
        { name: 'token_cost', type: 'DECIMAL(10,4)' },
        { name: 'nav', type: 'DECIMAL(20,8)' },
      ],
      indexes: ['(date DESC UNIQUE)']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🗄️ Database Schema</h2>
        <span className="text-gray-400 text-sm">PostgreSQL + TimescaleDB</span>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-medium text-sm mb-2">📊 ER Diagram (Rút gọn)</h3>
        <div className="bg-gray-900 rounded p-3 text-xs font-mono text-gray-400 overflow-x-auto">
          <pre className="whitespace-pre">{`market_data ──┐
                ├──→ agent_signals ──→ trades ──→ ledger
whale_events ──┘                         │
                                         ├──→ token_usage
news_sentiment ──────────────────────────┘
                                         └──→ performance_metrics`}</pre>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tables.map(table => (
          <div key={table.name} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-blue-300 font-mono font-medium text-sm">{table.name}</h3>
                <span className="text-gray-500 text-xs">{table.columns.length} cols</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{table.description}</p>
            </div>
            <div className="p-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left pb-1">Column</th>
                    <th className="text-left pb-1">Type</th>
                    <th className="text-left pb-1">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map(col => (
                    <tr key={col.name} className="border-t border-gray-700/30">
                      <td className="py-1 text-gray-300 font-mono">
                        {col.pk && <span className="text-yellow-400 mr-1">🔑</span>}
                        {col.name}
                      </td>
                      <td className="py-1 text-purple-300 font-mono">{col.type}</td>
                      <td className="py-1 text-gray-500">{col.note || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {table.indexes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700/30">
                  <p className="text-gray-500 text-[10px] mb-1">Indexes:</p>
                  {table.indexes.map((idx, i) => (
                    <p key={i} className="text-gray-400 text-[10px] font-mono">• {idx}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">🔧 Migration SQL</h3>
        <div className="bg-gray-900 rounded p-3 overflow-x-auto max-h-64 overflow-y-auto">
          <pre className="text-xs font-mono text-gray-300 whitespace-pre">{`-- Create tables
CREATE TABLE market_data (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NOT NULL,
    timeframe VARCHAR(5) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    open DECIMAL(20,8), high DECIMAL(20,8),
    low DECIMAL(20,8), close DECIMAL(20,8),
    volume DECIMAL(20,8),
    missing_data BOOLEAN DEFAULT FALSE,
    UNIQUE(symbol, timeframe, timestamp)
);

CREATE TABLE trades (
    id BIGSERIAL PRIMARY KEY,
    trade_id UUID UNIQUE NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    direction VARCHAR(5) NOT NULL,
    entry_price DECIMAL(20,8) NOT NULL,
    exit_price DECIMAL(20,8),
    stop_loss DECIMAL(20,8) NOT NULL,
    take_profit DECIMAL(20,8) NOT NULL,
    position_size DECIMAL(20,8) NOT NULL,
    leverage INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'OPEN',
    pnl DECIMAL(20,8) DEFAULT 0,
    fee DECIMAL(20,8) DEFAULT 0,
    reasoning TEXT,
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE TABLE ledger (
    id BIGSERIAL PRIMARY KEY,
    entry_type VARCHAR(20) NOT NULL,
    trade_id UUID REFERENCES trades(trade_id),
    account VARCHAR(30) NOT NULL,
    debit DECIMAL(20,8) DEFAULT 0,
    credit DECIMAL(20,8) DEFAULT 0,
    balance_after DECIMAL(20,8),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TimescaleDB hypertable for time-series
SELECT create_hypertable('market_data', 'timestamp');

-- Indexes
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_opened ON trades(opened_at DESC);
CREATE INDEX idx_ledger_trade ON ledger(trade_id);
CREATE INDEX idx_ledger_account ON ledger(account, created_at);`}</pre>
        </div>
      </div>
    </div>
  );
}
