"""
Crypto AI Trading System - Main Entry Point
FastAPI Backend Server
"""

import os
import sys
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict, Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, generate_latest
import structlog
import uvicorn

# Import agents
from agents.data_agent import DataAgent
from agents.quant_agent import QuantAgent
from agents.macro_agent import MacroAgent
from agents.risk_agent import RiskAgent
from agents.execution_agent import ExecutionAgent
from agents.cfo_agent import CFOAgent
from agents.bi_agent import BIAgent
from agents.cmm_agent import CMMAgent
from agents.wfi_agent import WFIAgent
from agents.treasury_agent import TreasuryAgent
from agents.acc_agent import ACCAgent

# Configure logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Prometheus metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
TRADE_COUNT = Counter('trades_total', 'Total trades executed', ['direction', 'status'])
TOKEN_USAGE = Counter('llm_tokens_total', 'Total LLM tokens used', ['agent', 'model', 'type'])

# Global state
class AppState:
    def __init__(self):
        self.initial_balance = float(os.getenv('INITIAL_BALANCE', 100.0))
        self.data_agent = DataAgent()
        self.quant_agent = QuantAgent()
        self.macro_agent = MacroAgent()
        self.risk_agent = RiskAgent(self.initial_balance)
        self.execution_agent = ExecutionAgent()
        self.cfo_agent = CFOAgent()
        self.bi_agent = BIAgent()
        self.cmm_agent = CMMAgent()
        self.wfi_agent = WFIAgent()
        self.treasury_agent = TreasuryAgent()
        self.acc_agent = ACCAgent()
        
        self.balance = self.initial_balance
        self.open_trades = []
        self.trade_history = []
        self.total_token_cost = 0.0

app_state = AppState()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("🏢 Crypto AI Trading System starting...")
    logger.info(f"💰 Initial balance: ${app_state.initial_balance}")
    logger.info(f"🤖 11 Agents initialized")
    yield
    logger.info("👋 Shutting down...")

# FastAPI app
app = FastAPI(
    title="Crypto AI Trading System",
    description="Multi-agent crypto trading system with 11 specialized agents",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Health & Metrics Endpoints
# ============================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "balance": app_state.balance,
        "open_trades": len(app_state.open_trades),
        "total_trades": len(app_state.trade_history)
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return JSONResponse(
        content=generate_latest().decode('utf-8'),
        media_type="text/plain"
    )

# ============================================
# Trading Endpoints
# ============================================

@app.post("/api/trading/cycle")
async def run_trading_cycle(symbol: str = "BTC/USDT"):
    """Run one trading cycle"""
    REQUEST_COUNT.labels(method="POST", endpoint="/api/trading/cycle", status="200").inc()
    
    try:
        logger.info(f"🔄 Starting trading cycle for {symbol}")
        
        # Phase 1: Data Collection
        market_data = app_state.data_agent.get_market_snapshot(symbol)
        
        # Phase 2: Analysis
        quant_signal = app_state.quant_agent.analyze(market_data)
        macro_signal = app_state.macro_agent.analyze(market_data)
        cmm_analysis = app_state.cmm_agent.analyze(market_data, [])
        wfi_signal = app_state.wfi_agent.analyze(symbol)
        
        # Phase 3: Risk Decision
        risk_decision = app_state.risk_agent.evaluate(
            quant_signal, cmm_analysis, app_state.open_trades
        )
        
        # Track token usage
        app_state.total_token_cost += sum([
            quant_signal.get('token_usage', {}).get('cost', 0),
            macro_signal.get('token_usage', {}).get('cost', 0),
            cmm_analysis.get('token_usage', {}).get('cost', 0),
            risk_decision.get('token_usage', {}).get('cost', 0)
        ])
        
        if risk_decision['decision'] == 'REJECT':
            return {
                "status": "rejected",
                "reason": risk_decision.get('reason', 'Unknown'),
                "signals": {
                    "quant": quant_signal,
                    "macro": macro_signal,
                    "cmm": cmm_analysis,
                    "wfi": wfi_signal
                }
            }
        
        # Phase 4: Execution
        exec_result = app_state.execution_agent.execute(risk_decision)
        
        if exec_result['status'] == 'FILLED':
            app_state.open_trades.append(risk_decision)
            app_state.treasury_agent.record_fill(
                trade_id=exec_result['trade_id'],
                price=exec_result['fill_price'],
                size=risk_decision['position_size'],
                fee=exec_result['fee']
            )
            
            TRADE_COUNT.labels(
                direction=risk_decision['direction'],
                status="opened"
            ).inc()
        
        return {
            "status": "approved",
            "trade": risk_decision,
            "execution": exec_result,
            "total_token_cost": app_state.total_token_cost
        }
        
    except Exception as e:
        logger.error(f"❌ Trading cycle failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trading/status")
async def get_trading_status():
    """Get current trading status"""
    return {
        "balance": app_state.balance,
        "equity": app_state.balance + sum(t.get('unrealized_pnl', 0) for t in app_state.open_trades),
        "open_trades": len(app_state.open_trades),
        "total_trades": len(app_state.trade_history),
        "total_token_cost": app_state.total_token_cost,
        "agents": {
            "data": "active",
            "quant": "active",
            "macro": "active",
            "risk": "active",
            "execution": "active",
            "cfo": "active",
            "bi": "active",
            "cmm": "active",
            "wfi": "active",
            "treasury": "active",
            "acc": "active"
        }
    }

@app.get("/api/trading/trades")
async def get_trades():
    """Get trade history"""
    return {
        "open_trades": app_state.open_trades,
        "closed_trades": app_state.trade_history
    }

# ============================================
# WebSocket for Real-time Updates
# ============================================

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws/trading")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time trading updates"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back for now
            await websocket.send_json({
                "type": "heartbeat",
                "timestamp": datetime.utcnow().isoformat(),
                "balance": app_state.balance,
                "open_trades": len(app_state.open_trades)
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ============================================
# Main Entry Point
# ============================================

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    workers = int(os.getenv("API_WORKERS", 4))
    
    logger.info(f"🚀 Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        workers=workers,
        log_level="info"
    )
