-- Crypto AI Trading System - Database Initialization
-- PostgreSQL + TimescaleDB

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ============================================
-- Table: market_data (Time-series)
-- ============================================
CREATE TABLE market_data (
    id BIGSERIAL,
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NOT NULL,
    timeframe VARCHAR(5) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    open DECIMAL(20,8),
    high DECIMAL(20,8),
    low DECIMAL(20,8),
    close DECIMAL(20,8),
    volume DECIMAL(20,8),
    missing_data BOOLEAN DEFAULT FALSE,
    UNIQUE(symbol, timeframe, timestamp)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('market_data', 'timestamp');

-- ============================================
-- Table: trades
-- ============================================
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

-- ============================================
-- Table: agent_signals
-- ============================================
CREATE TABLE agent_signals (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(20) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    signal VARCHAR(10) NOT NULL,
    confidence INTEGER NOT NULL,
    reasoning TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: ledger (Double-entry bookkeeping)
-- ============================================
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

-- ============================================
-- Table: token_usage
-- ============================================
CREATE TABLE token_usage (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(20) NOT NULL,
    model VARCHAR(30) NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(10,6) NOT NULL,
    trade_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: whale_events
-- ============================================
CREATE TABLE whale_events (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID UNIQUE NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    amount_usd DECIMAL(20,2) NOT NULL,
    address VARCHAR(100),
    exchange VARCHAR(20),
    metadata JSONB,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: news_sentiment
-- ============================================
CREATE TABLE news_sentiment (
    id BIGSERIAL PRIMARY KEY,
    source VARCHAR(20) NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    sentiment_score INTEGER NOT NULL,
    impact_level VARCHAR(10) NOT NULL,
    related_symbols TEXT[],
    published_at TIMESTAMPTZ,
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: performance_metrics
-- ============================================
CREATE TABLE performance_metrics (
    id BIGSERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_trades INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0,
    profit_factor DECIMAL(5,2) DEFAULT 0,
    total_pnl DECIMAL(20,8) DEFAULT 0,
    max_drawdown DECIMAL(5,2) DEFAULT 0,
    sharpe_ratio DECIMAL(5,2) DEFAULT 0,
    token_cost DECIMAL(10,4) DEFAULT 0,
    nav DECIMAL(20,8) DEFAULT 100.0
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_market_data_symbol ON market_data(symbol, timestamp DESC);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_opened ON trades(opened_at DESC);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_agent_signals_agent ON agent_signals(agent_name, created_at DESC);
CREATE INDEX idx_agent_signals_symbol ON agent_signals(symbol, created_at DESC);
CREATE INDEX idx_ledger_trade ON ledger(trade_id);
CREATE INDEX idx_ledger_account ON ledger(account, created_at DESC);
CREATE INDEX idx_token_usage_agent ON token_usage(agent_name, created_at DESC);
CREATE INDEX idx_whale_events_type ON whale_events(event_type, detected_at DESC);
CREATE INDEX idx_news_sentiment_score ON news_sentiment(sentiment_score);
CREATE INDEX idx_news_sentiment_published ON news_sentiment(published_at DESC);
CREATE INDEX idx_performance_date ON performance_metrics(date DESC);

-- ============================================
-- Functions
-- ============================================

-- Function to calculate daily performance
CREATE OR REPLACE FUNCTION calculate_daily_performance(target_date DATE)
RETURNS VOID AS $$
DECLARE
    v_total_trades INTEGER;
    v_wins INTEGER;
    v_losses INTEGER;
    v_total_pnl DECIMAL(20,8);
    v_token_cost DECIMAL(10,4);
BEGIN
    SELECT COUNT(*), 
           COUNT(CASE WHEN pnl > 0 THEN 1 END),
           COUNT(CASE WHEN pnl <= 0 THEN 1 END),
           COALESCE(SUM(pnl), 0)
    INTO v_total_trades, v_wins, v_losses, v_total_pnl
    FROM trades
    WHERE DATE(closed_at) = target_date;
    
    SELECT COALESCE(SUM(cost_usd), 0)
    INTO v_token_cost
    FROM token_usage
    WHERE DATE(created_at) = target_date;
    
    INSERT INTO performance_metrics (date, total_trades, wins, losses, total_pnl, token_cost)
    VALUES (target_date, v_total_trades, v_wins, v_losses, v_total_pnl, v_token_cost)
    ON CONFLICT (date) DO UPDATE
    SET total_trades = EXCLUDED.total_trades,
        wins = EXCLUDED.wins,
        losses = EXCLUDED.losses,
        total_pnl = EXCLUDED.total_pnl,
        token_cost = EXCLUDED.token_cost;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Initial data
-- ============================================
INSERT INTO performance_metrics (date, nav) VALUES (CURRENT_DATE, 100.0);
