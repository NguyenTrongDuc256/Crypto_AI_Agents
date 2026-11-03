# Hướng dẫn Deploy lên Vercel Free

## 📦 Kiến trúc hệ thống

```
┌─────────────────┐
│   Vercel Free   │  ← Frontend React (Dashboard)
│  (Static Site)  │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Railway Free   │  ← Backend Python (API Server)
│  (Backend API)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase Free  │  ← Database PostgreSQL
│  (PostgreSQL)   │
└─────────────────┘
```

**Tổng chi phí: $0/tháng**

---

## 🚀 Bước 1: Chuẩn bị GitHub Repository

### Tạo repo GitHub

1. Tạo file `.gitignore`:

```bash
node_modules/
dist/
.env
.env.local
*.log
__pycache__/
venv/
```

2. Khởi tạo git và push:

```bash
git init
git add .
git commit -m "Initial commit - Crypto AI Dashboard"

# Tạo repo trên GitHub, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/crypto-ai.git
git branch -M main
git push -u origin main
```

---

## 🎨 Bước 2: Deploy Frontend lên Vercel

### Option 1: Deploy qua Vercel Dashboard (Khuyên dùng)

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng GitHub
2. Nhấn "Add New Project"
3. Chọn repo GitHub của bạn
4. Vercel tự động detect Vite project
5. Nhấn "Deploy" và chờ 1-2 phút
6. ✅ Hoàn tất! Bạn sẽ có URL: `https://your-project.vercel.app`

### Option 2: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel login
vercel

# Deploy production
vercel --prod
```

---

## ⚙️ Bước 3: Deploy Backend lên Railway

### Tạo backend trên Railway

1. Truy cập [railway.app](https://railway.app) và đăng ký
2. New Project → Deploy from GitHub repo
3. Chọn repo backend Python
4. Railway tự động detect và deploy
5. Copy URL API: `https://your-backend.up.railway.app`

### Hoặc chạy backend local

```bash
cd backend
pip install -r requirements.txt
python main.py

# Backend chạy tại: http://localhost:8000
```

---

## 🗄️ Bước 4: Tạo Database trên Supabase

1. Truy cập [supabase.com](https://supabase.com) và đăng ký
2. New Project → Đặt tên "crypto-ai" → Chọn region gần bạn
3. Chờ 1-2 phút để Supabase tạo database
4. Vào Settings → Database → Copy Connection String
5. Vào SQL Editor → Paste và chạy file `init.sql`

**Connection String mẫu:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

---

## 🔐 Bước 5: Cấu hình Environment Variables

### Thêm vào Vercel

1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Thêm các biến sau:

```bash
# LLM API Keys
VITE_GROQ_API_KEY=gsk_...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GEMINI_API_KEY=AI...

# Database
VITE_DATABASE_URL=postgresql://...

# Backend API
VITE_API_URL=https://your-backend.up.railway.app
```

**⚠️ Quan trọng:**
- Biến phải bắt đầu bằng `VITE_` để frontend truy cập được
- KHÔNG commit .env lên GitHub
- Sau khi thêm env vars, cần redeploy: `vercel --prod`

---

## ✅ Bước 6: Kiểm tra hệ thống

### 1. Kiểm tra Frontend

Truy cập URL Vercel: `https://your-project.vercel.app`

Dashboard phải hiển thị bình thường.

### 2. Kiểm tra Backend

```bash
curl https://your-backend.up.railway.app/health
# Response: {"status": "healthy"}
```

### 3. Kiểm tra Database

Vào Supabase Dashboard → Table Editor → Kiểm tra các tables đã tạo

---

## 🎉 Hoàn tất!

Hệ thống đã deploy thành công với:
- ✅ Frontend: Vercel Free
- ✅ Backend: Railway Free (hoặc local)
- ✅ Database: Supabase Free
- ✅ Tổng chi phí: $0/tháng

---

## 🔗 Links hữu ích

- **Vercel**: https://vercel.com - Deploy frontend
- **Railway**: https://railway.app - Deploy backend
- **Supabase**: https://supabase.com - PostgreSQL Free
- **Groq**: https://console.groq.com - LLM API Free
- **Anthropic**: https://console.anthropic.com - Claude API

---

## 📊 Giới hạn Free Tier

| Service | Giới hạn |
|---------|----------|
| Vercel | 100GB bandwidth/tháng |
| Railway | 500 giờ/tháng |
| Supabase | 500MB database, 1GB bandwidth/tháng |
| Groq | 30 requests/phút |
| Anthropic | Pay-as-you-go |

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

### Database không kết nối được

- Kiểm tra Connection String
- Đảm bảo database đã được tạo
- Kiểm tra network access trong Supabase

---

## 📝 Next Steps

Sau khi deploy thành công:

1. **Test Paper Trading**: Chạy thử với tiền giả lập
2. **Monitor Performance**: Theo dõi hiệu suất qua Grafana
3. **Optimize Prompts**: Điều chỉnh system prompts dựa trên kết quả
4. **Scale Up**: Khi hệ thống ổn định, xem xét nâng cấp plan

---

**Chúc bạn deploy thành công! 🚀**
