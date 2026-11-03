import { useState } from 'react';

export default function DeployVercel() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Chuẩn bị GitHub Repository',
      icon: '📦',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">Tạo repo GitHub và push code lên:</p>
          <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-300 space-y-1">
            <p># Khởi tạo git</p>
            <p className="text-green-400">git init</p>
            <p className="text-green-400">git add .</p>
            <p className="text-green-400">git commit -m "Initial commit - Crypto AI Dashboard"</p>
            <p></p>
            <p># Tạo repo trên GitHub, sau đó:</p>
            <p className="text-green-400">git remote add origin https://github.com/YOUR_USERNAME/crypto-ai.git</p>
            <p className="text-green-400">git branch -M main</p>
            <p className="text-green-400">git push -u origin main</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-3">
            <p className="text-yellow-300 text-xs">⚠️ Tạo file .gitignore trước khi push:</p>
            <pre className="text-gray-400 text-xs mt-1">node_modules/
dist/
.env
.env.local
*.log</pre>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Deploy Frontend lên Vercel',
      icon: '🚀',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">Deploy dashboard React lên Vercel Free:</p>
          
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Option 1: Deploy qua Vercel Dashboard (Khuyên dùng)</p>
            <ol className="text-gray-400 text-xs mt-2 space-y-1 list-decimal list-inside">
              <li>Truy cập <a href="https://vercel.com" target="_blank" className="text-blue-400 hover:underline">vercel.com</a> và đăng nhập bằng GitHub</li>
              <li>Nhấn "Add New Project"</li>
              <li>Chọn repo GitHub của bạn</li>
              <li>Vercel tự động detect Vite project</li>
              <li>Nhấn "Deploy" và chờ 1-2 phút</li>
            </ol>
          </div>

          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Option 2: Deploy qua Vercel CLI</p>
            <div className="bg-gray-900 rounded p-2 mt-2 font-mono text-xs text-gray-300 space-y-1">
              <p># Cài đặt Vercel CLI</p>
              <p className="text-green-400">npm i -g vercel</p>
              <p></p>
              <p># Deploy</p>
              <p className="text-green-400">vercel login</p>
              <p className="text-green-400">vercel</p>
              <p></p>
              <p># Deploy production</p>
              <p className="text-green-400">vercel --prod</p>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-800/30 rounded p-3">
            <p className="text-green-300 text-xs">✅ Sau khi deploy xong, bạn sẽ có URL: <code className="bg-gray-800 px-1 rounded">https://your-project.vercel.app</code></p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Cấu hình Backend API',
      icon: '🔌',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">Vercel chỉ host frontend. Backend Python cần chạy riêng:</p>
          
          <div className="bg-blue-900/20 border border-blue-800/30 rounded p-3">
            <p className="text-blue-300 text-sm font-medium">🎯 Kiến trúc hệ thống:</p>
            <div className="mt-2 bg-gray-900 rounded p-3 font-mono text-xs text-gray-400">
              <pre className="whitespace-pre">{`┌─────────────────┐
│   Vercel Free   │
│  (Frontend)     │
│  React + Vite   │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Backend API    │
│  (Python)       │
│  Chạy local     │
│  hoặc Railway   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase Free  │
│  (PostgreSQL)   │
└─────────────────┘`}</pre>
            </div>
          </div>

          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Option A: Backend chạy local (Miễn phí)</p>
            <div className="bg-gray-900 rounded p-2 mt-2 font-mono text-xs text-gray-300 space-y-1">
              <p># Chạy backend trên máy của bạn</p>
              <p className="text-green-400">cd backend</p>
              <p className="text-green-400">pip install -r requirements.txt</p>
              <p className="text-green-400">python main.py</p>
              <p></p>
              <p># Backend chạy tại: http://localhost:8000</p>
            </div>
            <p className="text-gray-400 text-xs mt-2">⚠️ Cần giữ máy chạy 24/7 hoặc dùng ngrok để expose ra internet</p>
          </div>

          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">Option B: Backend trên Railway Free (Khuyên dùng)</p>
            <ol className="text-gray-400 text-xs mt-2 space-y-1 list-decimal list-inside">
              <li>Truy cập <a href="https://railway.app" target="_blank" className="text-blue-400 hover:underline">railway.app</a> và đăng ký</li>
              <li>New Project → Deploy from GitHub repo</li>
              <li>Chọn repo backend Python</li>
              <li>Railway tự động detect và deploy</li>
              <li>Copy URL API: <code className="bg-gray-800 px-1 rounded">https://your-backend.up.railway.app</code></li>
            </ol>
            <p className="text-green-400 text-xs mt-2">✅ Free tier: 500 giờ/tháng, đủ dùng</p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Cấu hình Database (Supabase)',
      icon: '🗄️',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">Tạo database PostgreSQL miễn phí trên Supabase:</p>
          
          <div className="bg-gray-700/30 rounded p-3">
            <ol className="text-gray-400 text-xs space-y-2 list-decimal list-inside">
              <li>
                Truy cập <a href="https://supabase.com" target="_blank" className="text-blue-400 hover:underline">supabase.com</a> và đăng ký
              </li>
              <li>
                New Project → Đặt tên "crypto-ai" → Chọn region gần bạn
              </li>
              <li>
                Chờ 1-2 phút để Supabase tạo database
              </li>
              <li>
                Vào Settings → Database → Copy Connection String
              </li>
              <li>
                Vào SQL Editor → Paste và chạy file <code className="bg-gray-800 px-1 rounded">init.sql</code>
              </li>
            </ol>
          </div>

          <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-300">
            <p className="text-gray-500"># Connection String mẫu:</p>
            <p className="text-green-400 break-all">postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres</p>
          </div>

          <div className="bg-green-900/20 border border-green-800/30 rounded p-3">
            <p className="text-green-300 text-xs">✅ Supabase Free tier:</p>
            <ul className="text-gray-400 text-xs mt-1 space-y-1">
              <li>• 500MB database</li>
              <li>• 1GB bandwidth/tháng</li>
              <li>• Không giới hạn API calls</li>
              <li>• Tự động backup hàng ngày</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Cấu hình Environment Variables',
      icon: '🔐',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">Thêm API keys vào Vercel:</p>
          
          <div className="bg-gray-700/30 rounded p-3">
            <ol className="text-gray-400 text-xs space-y-2 list-decimal list-inside">
              <li>Vào Vercel Dashboard → Project → Settings → Environment Variables</li>
              <li>Thêm các biến sau:</li>
            </ol>
          </div>

          <div className="bg-gray-900 rounded p-3 font-mono text-xs space-y-2">
            <div>
              <p className="text-blue-400"># LLM API Keys</p>
              <p className="text-gray-300">VITE_GROQ_API_KEY = <span className="text-yellow-400">gsk_...</span></p>
              <p className="text-gray-300">VITE_ANTHROPIC_API_KEY = <span className="text-yellow-400">sk-ant-...</span></p>
              <p className="text-gray-300">VITE_GEMINI_API_KEY = <span className="text-yellow-400">AI...</span></p>
            </div>
            <div>
              <p className="text-blue-400"># Database</p>
              <p className="text-gray-300">VITE_DATABASE_URL = <span className="text-yellow-400">postgresql://...</span></p>
            </div>
            <div>
              <p className="text-blue-400"># Backend API</p>
              <p className="text-gray-300">VITE_API_URL = <span className="text-yellow-400">https://your-backend.up.railway.app</span></p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-3">
            <p className="text-yellow-300 text-xs">⚠️ Quan trọng:</p>
            <ul className="text-gray-400 text-xs mt-1 space-y-1">
              <li>• Biến phải bắt đầu bằng <code className="bg-gray-800 px-1 rounded">VITE_</code> để frontend truy cập được</li>
              <li>• KHÔNG commit .env lên GitHub</li>
              <li>• Sau khi thêm env vars, cần redeploy: <code className="bg-gray-800 px-1 rounded">vercel --prod</code></li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Kiểm tra & Test',
      icon: '✅',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">Kiểm tra hệ thống đã hoạt động:</p>
          
          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">1. Kiểm tra Frontend</p>
            <p className="text-gray-400 text-xs mt-1">Truy cập URL Vercel: <code className="bg-gray-800 px-1 rounded">https://your-project.vercel.app</code></p>
            <p className="text-gray-400 text-xs">Dashboard phải hiển thị bình thường</p>
          </div>

          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">2. Kiểm tra Backend</p>
            <div className="bg-gray-900 rounded p-2 mt-2 font-mono text-xs text-gray-300">
              <p className="text-green-400">curl https://your-backend.up.railway.app/health</p>
              <p className="text-gray-400"># Response: &#123;"status": "healthy"&#125;</p>
            </div>
          </div>

          <div className="bg-gray-700/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">3. Kiểm tra Database</p>
            <p className="text-gray-400 text-xs mt-1">Vào Supabase Dashboard → Table Editor → Kiểm tra các tables đã tạo</p>
          </div>

          <div className="bg-green-900/20 border border-green-800/30 rounded p-3">
            <p className="text-green-300 text-sm font-medium">🎉 Chúc mừng! Hệ thống đã deploy thành công!</p>
            <div className="text-gray-400 text-xs mt-2 space-y-1">
              <p>✅ Frontend: Vercel Free</p>
              <p>✅ Backend: Railway Free (hoặc local)</p>
              <p>✅ Database: Supabase Free</p>
              <p>✅ Tổng chi phí: $0/tháng</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🚀 Deploy lên Vercel Free</h2>
        <span className="text-gray-400 text-sm">Hướng dẫn chi tiết</span>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-5 border border-blue-700/50">
        <h3 className="text-white font-semibold mb-2">📦 Kiến trúc Deploy</h3>
        <p className="text-gray-300 text-sm mb-3">
          Vercel Free chỉ hỗ trợ frontend static. Backend Python cần chạy riêng.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-900/20 border border-blue-800/30 rounded p-3 text-center">
            <p className="text-2xl mb-1">🎨</p>
            <p className="text-blue-300 text-sm font-medium">Frontend</p>
            <p className="text-gray-400 text-xs">Vercel Free</p>
            <p className="text-green-400 text-xs mt-1">$0/tháng</p>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded p-3 text-center">
            <p className="text-2xl mb-1">⚙️</p>
            <p className="text-purple-300 text-sm font-medium">Backend</p>
            <p className="text-gray-400 text-xs">Railway Free</p>
            <p className="text-green-400 text-xs mt-1">$0/tháng</p>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded p-3 text-center">
            <p className="text-2xl mb-1">🗄️</p>
            <p className="text-green-300 text-sm font-medium">Database</p>
            <p className="text-gray-400 text-xs">Supabase Free</p>
            <p className="text-green-400 text-xs mt-1">$0/tháng</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-4">
        {/* Step Navigation */}
        <div className="col-span-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <p className="text-gray-400 text-xs font-medium">📋 Các bước deploy</p>
          </div>
          <div className="p-2 space-y-1">
            {steps.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-all flex items-center gap-2 ${
                  activeStep === step.id
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-[10px]">
                  {step.id}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="col-span-3 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{steps[activeStep - 1].icon}</span>
              <div>
                <h3 className="text-white font-bold">Bước {activeStep}: {steps[activeStep - 1].title}</h3>
              </div>
            </div>
          </div>
          <div className="p-4">
            {steps[activeStep - 1].content}
          </div>
          <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/50 flex justify-between">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm"
            >
              ← Trước
            </button>
            <button
              onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
              disabled={activeStep === steps.length}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm"
            >
              Tiếp →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">🔗 Links hữu ích</h3>
        <div className="grid grid-cols-3 gap-3">
          <a href="https://vercel.com" target="_blank" className="bg-gray-700/50 hover:bg-gray-700 rounded p-3 transition-colors">
            <p className="text-blue-400 text-sm font-medium">Vercel</p>
            <p className="text-gray-400 text-xs">Deploy frontend</p>
          </a>
          <a href="https://railway.app" target="_blank" className="bg-gray-700/50 hover:bg-gray-700 rounded p-3 transition-colors">
            <p className="text-purple-400 text-sm font-medium">Railway</p>
            <p className="text-gray-400 text-xs">Deploy backend</p>
          </a>
          <a href="https://supabase.com" target="_blank" className="bg-gray-700/50 hover:bg-gray-700 rounded p-3 transition-colors">
            <p className="text-green-400 text-sm font-medium">Supabase</p>
            <p className="text-gray-400 text-xs">PostgreSQL Free</p>
          </a>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-green-900/20 rounded-lg p-5 border border-green-800/30">
        <h3 className="text-green-300 font-semibold mb-3">💰 Tổng chi phí</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">$0</p>
            <p className="text-gray-400 text-xs">Vercel Free</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">$0</p>
            <p className="text-gray-400 text-xs">Railway Free</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">$0</p>
            <p className="text-gray-400 text-xs">Supabase Free</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">$0</p>
            <p className="text-gray-400 text-xs">TỔNG CỘNG</p>
          </div>
        </div>
      </div>
    </div>
  );
}
