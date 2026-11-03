# 🏢 Crypto AI Trading System

Hệ thống giao dịch crypto tự động với 11 AI Agents chuyên biệt, mô phỏng cấu trúc quỹ đầu cơ chuyên nghiệp.

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Deploy](https://img.shields.io/badge/deploy-vercel%20%7C%20railway%20%7C%20supabase-blue)

---

## 🎯 Tổng quan

Đây là hệ thống **Multi-Agent AI Trading** hoàn chỉnh với:

- ✅ **11 AI Agents** chuyên biệt (Data, Quant, Macro, Risk, Execution, CFO, BI, CMM, WFI, Treasury, ACC)
- ✅ **Paper Trading Simulator** - Mô phỏng giao dịch real-time
- ✅ **Backtesting Engine** - Kiểm thử chiến lược với dữ liệu quá khứ
- ✅ **System Prompts** - Đầy đủ prompts cho từng Agent
- ✅ **Code Python** - Backend kết nối thật với Groq/Claude/Gemini
- ✅ **Database Schema** - PostgreSQL + TimescaleDB
- ✅ **Telegram Bot** - Giao diện CEO qua Telegram
- ✅ **Docker Deployment** - Sẵn sàng deploy production
- ✅ **CI/CD Pipeline** - GitHub Actions tự động

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    CEO (Bạn)                             │
│         Phê duyệt cuối cùng + Kill Switch               │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              ORCHESTRATOR (LangGraph)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Data ──→ 🧠 Quant ──→ 🛡️ Risk ──→ ⚡ Execution    │
│     │            │            │            │             │
│     │            ▼            │            │             │
│     │       ⚖️ CMM ◄──────────┘            │             │
│     │            │                         │             │
│     ▼            ▼                         ▼             │
│  🐋 WFI     📰 Macro              🧾 Treasury          │
│                                                          │
│  💰 CFO    📈 BI      🤖 ACC                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deploy nhanh lên Vercel Free

### Kiến trúc Deploy

```
Frontend (React)  →  Vercel Free      ($0/tháng)
Backend (Python)  →  Railway Free     ($0/tháng)
Database          →  Supabase Free    ($0/tháng)
LLM APIs          →  Groq/Gemini Free ($0/tháng)
```

**Tổng chi phí: $0/tháng**

### Hướng dẫn chi tiết

Xem [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) để biết chi tiết từng bước.

### Tóm tắt nhanh

```bash
# 1. Clone repo
git clone https://github.com/YOUR_USERNAME/crypto-ai.git
cd crypto-ai

# 2. Cài đặt dependencies
npm install

# 3. Cấu hình environment
cp .env.local.example .env.local
nano .env.local  # Điền API keys

# 4. Chạy local
npm run dev

# 5. Deploy lên Vercel
npm i -g vercel
vercel --prod
```

---

## 📊 Dashboard Features

### 17 Tabs chức năng:

| # | Tab | Mô tả |
|---|-----|--------|
| 1 | 🏢 Tổng quan | Sơ đồ tổ chức, tech stack |
| 2 | 📋 Phòng ban | Chi tiết 11 Agents |
| 3 | 📈 Paper Trading | Mô phỏng giao dịch real-time |
| 4 | 📊 Backtesting | Kiểm thử chiến lược |
| 5 | 🐍 Code Python | Code mẫu cho từng Agent |
| 6 | 🔌 LLM Code | Code kết nối LLM thật |
| 7 | 📝 Prompts | System Prompts cho 11 Agents |
| 8 | 🗄️ Database | Schema PostgreSQL |
| 9 | 🤖 LLM Integration | Cấu hình Groq/Claude/Gemini |
| 10 | 📱 Telegram Bot | Giao diện CEO |
| 11 | 🔄 Luồng vận hành | Workflow 4 giai đoạn |
| 12 | 📜 Hiến pháp | 5 điều luật cốt lõi |
| 13 | 💰 Chi phí & Token | Phân tích chi phí AI |
| 14 | 👥 Phân quyền | Ma trận trách nhiệm |
| 15 | 🎯 Chiến lược | Hybrid Learning |
| 16 | 🚀 Deploy | Docker + CI/CD |
| 17 | 🎯 Vercel Guide | Hướng dẫn deploy Vercel |

---

## 🤖 11 AI Agents

### Danh sách Agents:

| # | Agent | Vai trò | LLM |
|---|-------|---------|-----|
| 1 | 📊 Data | Thu thập dữ liệu | Python thuần |
| 2 | 🧠 Quant | Phân tích kỹ thuật | Groq (Free) |
| 3 | 📰 Macro | Tin tức, vĩ mô | Groq (Free) |
| 4 | 🛡️ Risk | Quản lý rủi ro | Claude (Paid) |
| 5 | ⚡ Execution | Thực thi lệnh | Python thuần |
| 6 | 💰 CFO | Tài chính | Gemini (Free) |
| 7 | 📈 BI | Đánh giá hiệu suất | Gemini (Free) |
| 8 | ⚖️ CMM | Pháp chế, bẫy | Claude (Paid) |
| 9 | 🐋 WFI | Cá voi, dòng tiền | Groq (Free) |
| 10 | 🧾 Treasury | Sổ cái kép | Python thuần |
| 11 | 🤖 ACC | Kiểm soát chi phí AI | Gemini (Free) |

---

## 💰 Chi phí vận hành

### MVP (Free Tier):

| Hạng mục | Giải pháp | Chi phí |
|----------|-----------|---------|
| Server | Vercel Free | $0/tháng |
| Backend | Railway Free | $0/tháng |
| Database | Supabase Free | $0/tháng |
| LLM (80%) | Groq + Gemini | $0/tháng |
| LLM (20%) | Claude | ~$2-5/tháng |
| **Tổng** | | **$2-5/tháng** |

### Token Burn mỗi lệnh:

- **Hybrid approach**: ~$0.027/lệnh
- **90 lệnh/tháng**: ~$2.43/tháng
- **Dự báo hòa vốn**: 230 lệnh (~77 ngày)

---

## 🛠️ Tech Stack

### Frontend:
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)

### Backend:
- Python 3.11
- FastAPI (Web framework)
- LangGraph (Agent orchestration)

### Database:
- PostgreSQL + TimescaleDB
- Redis (Cache)

### LLM Providers:
- Groq (Llama 3.3 70B) - Free
- Google Gemini 2.0 Flash - Free
- Anthropic Claude 3.5 Sonnet - Paid

### Deployment:
- Docker + Docker Compose
- Nginx (Reverse Proxy)
- GitHub Actions (CI/CD)
- Prometheus + Grafana (Monitoring)

---

## 📁 Cấu trúc project

```
crypto-ai/
├── src/
│   ├── components/          # React components
│   │   ├── PaperTrading.tsx
│   │   ├── Backtesting.tsx
│   │   ├── CodeSamples.tsx
│   │   ├── LLMCodeConnection.tsx
│   │   ├── AgentPrompts.tsx
│   │   ├── DatabaseSchema.tsx
│   │   ├── LLMIntegration.tsx
│   │   ├── TelegramBot.tsx
│   │   ├── Deployment.tsx
│   │   └── DeployVercel.tsx
│   ├── data/
│   │   └── departments.ts   # Data cho 11 agents
│   ├── python_code/         # Code Python mẫu
│   │   ├── llm_client.py
│   │   ├── quant_agent.py
│   │   └── agents_connected.py
│   ├── deployment/          # Files deploy
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── nginx.conf
│   │   ├── init.sql
│   │   └── requirements.txt
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.local.example
├── vercel.json
├── DEPLOYMENT_GUIDE.md
├── README.md
└── package.json
```

---

## 🎓 Hướng dẫn sử dụng

### 1. Chạy local

```bash
# Cài đặt dependencies
npm install

# Cấu hình environment
cp .env.local.example .env.local
# Edit .env.local với API keys của bạn

# Chạy development server
npm run dev

# Truy cập: http://localhost:5173
```

### 2. Build production

```bash
npm run build
npm run preview
```

### 3. Deploy lên Vercel

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🔐 API Keys cần thiết

### Miễn phí:

1. **Groq API Key** (Free - 30 req/min)
   - Đăng ký: https://console.groq.com
   - Dùng cho: Quant, Macro, WFI Agents

2. **Google Gemini API Key** (Free - 15 req/min)
   - Đăng ký: https://makersuite.google.com/app/apikey
   - Dùng cho: CFO, BI, ACC Agents

### Trả phí:

3. **Anthropic Claude API Key** ($3-15/1M tokens)
   - Đăng ký: https://console.anthropic.com
   - Dùng cho: Risk, CMM Agents

---

## 📊 Chiến lược giao dịch

### Option C: Hybrid Learning (Đề xuất)

**Giai đoạn 1 (Tháng 1-2): Paper Trading**
- Không dùng tiền thật
- 3 lệnh/ngày, đòn bẩy 5x, BTC/ETH
- Mục tiêu: Học + Tối ưu prompts
- Chi phí AI: $2.03/tháng
- Rủi ro: $0

**Giai đoạn 2 (Tháng 3+): Live Trading**
- Nạp $50-100
- Đòn bẩy 3-5x, BTC/ETH
- Rủi ro mỗi lệnh: 1% tài khoản
- Lợi nhuận kỳ vọng: $5-10/tháng

---

## ⚠️ Lưu ý quan trọng

1. **KHÔNG dùng tiền thật** cho đến khi Paper Trading ổn định
2. **API key sàn** chỉ cấp quyền Trade, KHÔNG cấp quyền Withdraw
3. **Chi phí AI** có thể vượt lợi nhuận nếu không tối ưu
4. **Thị trường crypto** biến động mạnh, luôn có rủi ro
5. **Đây là công cụ học tập**, không phải máy in tiền

---

## 🐛 Troubleshooting

### Frontend không load được

- Kiểm tra Console (F12) để xem lỗi
- Đảm bảo đã redeploy sau khi thêm env vars
- Kiểm tra CORS settings trên backend

### Backend không kết nối được

- Kiểm tra Railway logs
- Đảm bảo backend đang chạy
- Kiểm tra firewall/port

### LLM API không hoạt động

- Kiểm tra API key còn hạn
- Kiểm tra rate limit (Groq: 30 req/min)
- Xem logs để biết lỗi chi tiết

---

## 📝 License

MIT License - Tự do sử dụng cho mục đích học tập và nghiên cứu.

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Issue hoặc Pull Request.

---

## 📞 Liên hệ

- **Dashboard**: [Live Demo](https://your-project.vercel.app)
- **Documentation**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/crypto-ai/issues)

---

**Chúc bạn thành công với Crypto AI Trading System! 🚀**

*Lưu ý: Đây là công cụ học tập. Giao dịch crypto có rủi ro cao. Hãy cẩn trọng và chỉ dùng số tiền bạn có thể chấp nhận mất.*
