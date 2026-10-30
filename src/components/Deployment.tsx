import { useState } from 'react';

interface DeploymentFile {
  name: string;
  icon: string;
  description: string;
  content: string;
}

const deploymentFiles: DeploymentFile[] = [
  {
    name: 'Dockerfile',
    icon: '🐳',
    description: 'Docker image cho Python backend',
    content: `FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc g++ && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

CMD ["python", "main.py"]`
  },
  {
    name: 'docker-compose.yml',
    icon: '🎼',
    description: 'Orchestrate tất cả services',
    content: `version: '3.8'

services:
  backend:
    build: ./backend
    container_name: crypto-ai-backend
    restart: unless-stopped
    env_file: .env
    ports: ["8000:8000"]
    depends_on: [postgres, redis]
    networks: [crypto-ai-network]

  postgres:
    image: timescale/timescaledb:latest-pg14
    container_name: crypto-ai-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${DB_USER:-crypto_user}
      POSTGRES_PASSWORD: \${DB_PASSWORD:-crypto_pass}
      POSTGRES_DB: \${DB_NAME:-crypto_ai}
    ports: ["5432:5432"]
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks: [crypto-ai-network]

  redis:
    image: redis:7-alpine
    container_name: crypto-ai-redis
    restart: unless-stopped
    ports: ["6379:6379"]
    networks: [crypto-ai-network]

  nginx:
    image: nginx:alpine
    container_name: crypto-ai-nginx
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
    depends_on: [backend]
    networks: [crypto-ai-network]

  prometheus:
    image: prom/prometheus:latest
    container_name: crypto-ai-prometheus
    ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    networks: [crypto-ai-network]

  grafana:
    image: grafana/grafana:latest
    container_name: crypto-ai-grafana
    ports: ["3000:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=\${GRAFANA_PASSWORD:-admin}
    networks: [crypto-ai-network]

volumes:
  postgres-data:

networks:
  crypto-ai-network:
    driver: bridge`
  },
  {
    name: 'nginx.conf',
    icon: '🌐',
    description: 'Nginx reverse proxy + SSL',
    content: `worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name _;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Strict-Transport-Security "max-age=31536000" always;

        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /ws/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}`
  },
  {
    name: '.github/workflows/ci-cd.yml',
    icon: '🔄',
    description: 'GitHub Actions CI/CD Pipeline',
    content: `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - run: pip install -r requirements.txt pytest pytest-cov
      - run: pytest tests/ --cov=backend --cov-report=xml
      
      - uses: codecov/codecov-action@v3

  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}/backend:latest

  deploy:
    needs: docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: appleboy/ssh-action@v0.1.6
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USERNAME }}
          key: \${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/crypto-ai
            docker-compose pull
            docker-compose up -d`
  },
  {
    name: 'requirements.txt',
    icon: '📦',
    description: 'Python dependencies',
    content: `# LLM Providers
groq>=0.9.0
anthropic>=0.30.0
google-generativeai>=0.7.0

# Data & Analysis
ccxt>=4.3.0
pandas>=2.2.0
numpy>=1.26.0
ta-lib>=0.4.28

# Database
psycopg2-binary>=2.9.9
sqlalchemy>=2.0.0
redis>=5.0.0

# Web Framework
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
websockets>=12.0

# Telegram Bot
python-telegram-bot>=20.7

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
pydantic>=2.5.0

# Monitoring
prometheus-client>=0.19.0
structlog>=23.2.0

# Testing
pytest>=7.4.0
pytest-cov>=4.1.0`
  },
  {
    name: '.env.example',
    icon: '🔐',
    description: 'Environment variables template',
    content: `# LLM API Keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Exchange API Keys (Trade only, NO withdraw!)
BINANCE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
BINANCE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
BINANCE_TESTNET=true

# Database
DB_USER=crypto_user
DB_PASSWORD=crypto_pass
DB_NAME=crypto_ai
DATABASE_URL=postgresql://crypto_user:crypto_pass@postgres:5432/crypto_ai

# Redis
REDIS_URL=redis://redis:6379/0

# Telegram Bot
TELEGRAM_BOT_TOKEN=7234567890:AAHxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CEO_CHAT_ID=123456789

# Trading
INITIAL_BALANCE=100.0
MAX_RISK_PER_TRADE=0.02
MAX_OPEN_TRADES=3
DEFAULT_LEVERAGE=5
TRADING_SYMBOL=BTC/USDT
TRADING_MODE=paper

# API
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Security
SECRET_KEY=your-super-secret-key-change-this
JWT_ALGORITHM=HS256

# Monitoring
GRAFANA_PASSWORD=admin`
  },
  {
    name: 'init.sql',
    icon: '🗄️',
    description: 'PostgreSQL + TimescaleDB initialization',
    content: `CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE market_data (
    id BIGSERIAL,
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

SELECT create_hypertable('market_data', 'timestamp');

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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE token_usage (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(20) NOT NULL,
    model VARCHAR(30) NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(10,6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_opened ON trades(opened_at DESC);`
  },
  {
    name: 'main.py',
    icon: '🚀',
    description: 'FastAPI backend entry point',
    content: `from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, generate_latest
import uvicorn

app = FastAPI(title="Crypto AI Trading System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TRADE_COUNT = Counter('trades_total', 'Total trades', ['direction', 'status'])

@app.get("/health")
async def health():
    return {"status": "healthy", "balance": 100.0}

@app.get("/metrics")
async def metrics():
    return generate_latest().decode('utf-8')

@app.post("/api/trading/cycle")
async def run_cycle(symbol: str = "BTC/USDT"):
    # Phase 1: Data
    market_data = data_agent.get_snapshot(symbol)
    
    # Phase 2: Analysis
    quant_signal = quant_agent.analyze(market_data)
    cmm_analysis = cmm_agent.analyze(market_data, [])
    
    # Phase 3: Risk
    risk_decision = risk_agent.evaluate(quant_signal, cmm_analysis, [])
    
    if risk_decision['decision'] == 'REJECT':
        return {"status": "rejected", "reason": risk_decision['reason']}
    
    # Phase 4: Execute
    exec_result = execution_agent.execute(risk_decision)
    
    return {"status": "approved", "trade": risk_decision}

@app.websocket("/ws/trading")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_json({"type": "heartbeat"})

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, workers=4)`
  }
];

export default function Deployment() {
  const [selectedFile, setSelectedFile] = useState(deploymentFiles[0]);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🚀 Docker Deployment + CI/CD</h2>
        <span className="text-gray-400 text-sm">{deploymentFiles.length} files</span>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-5 border border-green-700/50">
        <h3 className="text-white font-semibold mb-2">📦 Hệ thống Deployment hoàn chỉnh</h3>
        <p className="text-gray-300 text-sm">
          Tất cả files cần thiết để deploy hệ thống lên server production với Docker, Nginx, SSL, CI/CD, và monitoring.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded">🐳 Docker</span>
          <span className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded">🎼 Docker Compose</span>
          <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded">🌐 Nginx + SSL</span>
          <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 rounded">🔄 GitHub Actions</span>
          <span className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded">📊 Prometheus + Grafana</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <p className="text-gray-400 text-xs font-medium">📁 crypto-ai-deployment/</p>
          </div>
          <div className="p-2 space-y-1">
            {deploymentFiles.map(file => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-all flex items-center gap-2 ${
                  selectedFile.name === file.name
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <span>{file.icon}</span>
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-3 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <span className="text-lg">{selectedFile.icon}</span>
              <div>
                <h3 className="text-white text-sm font-medium font-mono">{selectedFile.name}</h3>
                <p className="text-gray-400 text-xs">{selectedFile.description}</p>
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
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">🚀 Hướng dẫn Deploy</h3>
        <div className="space-y-3">
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Step 1: Clone repository</p>
            <pre className="text-gray-400 text-xs mt-1 font-mono">git clone https://github.com/your-username/crypto-ai.git</pre>
            <pre className="text-gray-400 text-xs font-mono">cd crypto-ai</pre>
          </div>
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Step 2: Configure environment</p>
            <pre className="text-gray-400 text-xs mt-1 font-mono">cp .env.example .env</pre>
            <pre className="text-gray-400 text-xs font-mono">nano .env  # Edit with your API keys</pre>
          </div>
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Step 3: Start services</p>
            <pre className="text-gray-400 text-xs mt-1 font-mono">docker-compose up -d</pre>
          </div>
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Step 4: Check status</p>
            <pre className="text-gray-400 text-xs mt-1 font-mono">docker-compose ps</pre>
            <pre className="text-gray-400 text-xs font-mono">curl http://localhost:8000/health</pre>
          </div>
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Step 5: Access services</p>
            <div className="text-gray-400 text-xs mt-1 space-y-1">
              <p>• Frontend: http://localhost</p>
              <p>• Backend API: http://localhost:8000</p>
              <p>• Grafana: http://localhost:3000 (admin/admin)</p>
              <p>• Prometheus: http://localhost:9090</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium text-sm mb-2">🏗️ Kiến trúc hệ thống</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="text-gray-300">Nginx (Reverse Proxy + SSL)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-gray-300">FastAPI Backend (Python)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="text-gray-300">PostgreSQL + TimescaleDB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span className="text-gray-300">Redis Cache</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="text-gray-300">Prometheus + Grafana</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium text-sm mb-2">📊 Monitoring</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Backend Metrics</span>
              <span className="text-green-400">Prometheus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dashboard</span>
              <span className="text-green-400">Grafana</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Logs</span>
              <span className="text-green-400">Structlog (JSON)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health Check</span>
              <span className="text-green-400">/health endpoint</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
