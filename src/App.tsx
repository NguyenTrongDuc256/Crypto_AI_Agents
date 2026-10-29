import { useState } from 'react';
import { departments, constitution, workflow, costBreakdown, responsibilityMatrix, Department } from './data/departments';
import PaperTrading from './components/PaperTrading';
import CodeSamples from './components/CodeSamples';
import DatabaseSchema from './components/DatabaseSchema';

// Sidebar Component
function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: '🏢' },
    { id: 'departments', label: 'Phòng ban', icon: '📋' },
    { id: 'paper-trading', label: 'Paper Trading', icon: '📈' },
    { id: 'code', label: 'Code Python', icon: '🐍' },
    { id: 'database', label: 'Database', icon: '🗄️' },
    { id: 'workflow', label: 'Luồng vận hành', icon: '🔄' },
    { id: 'constitution', label: 'Hiến pháp', icon: '📜' },
    { id: 'costs', label: 'Chi phí & Token', icon: '💰' },
    { id: 'responsibility', label: 'Phân quyền', icon: '👥' },
    { id: 'strategy', label: 'Chiến lược', icon: '🎯' },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-4 border-r border-gray-700">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl">🏢</span>
        <div>
          <h1 className="text-white font-bold text-lg">Crypto AI</h1>
          <p className="text-gray-400 text-xs">Company Dashboard</p>
        </div>
      </div>
      <nav className="space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-8 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-xs mb-1">Trạng thái hệ thống</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-400 text-sm font-medium">Đang hoạt động</span>
        </div>
        <p className="text-gray-500 text-xs mt-2">11 Agents • MVP Phase</p>
      </div>
    </div>
  );
}

// Overview Component
function Overview() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🏢 Công ty Crypto AI</h2>
        <p className="text-blue-100">Hệ thống Multi-Agent mô phỏng cấu trúc quỹ đầu cơ chuyên nghiệp</p>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-2xl font-bold">11</p>
            <p className="text-blue-200 text-sm">Phòng ban</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-2xl font-bold">7</p>
            <p className="text-blue-200 text-sm">Dùng LLM</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-2xl font-bold">4</p>
            <p className="text-blue-200 text-sm">Python thuần</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-2xl font-bold">$0-5</p>
            <p className="text-blue-200 text-sm">OPEX/tháng</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span> Mục tiêu hệ thống
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Tự động phân tích thị trường crypto 24/7</li>
            <li className="flex items-start gap-2"><span className="text-green-400">✓</span> AI Agent tự ra quyết định vào lệnh, chốt lời, cắt lỗ</li>
            <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Quản lý rủi ro chặt chẽ, bảo toàn vốn</li>
            <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Tối ưu chi phí vận hành về $0 (MVP)</li>
            <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Tự đánh giá hiệu suất và điều chỉnh</li>
          </ul>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>🛠️</span> Tech Stack
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">Python</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">LangGraph</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">CCXT</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">PostgreSQL</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">Docker</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">Redis</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">Claude/Groq</div>
            <div className="bg-gray-700 rounded px-2 py-1 text-gray-300">Telegram Bot</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🏗️</span> Sơ đồ tổ chức
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {departments.map(dept => (
            <div key={dept.id} className={`bg-gradient-to-br ${dept.color} rounded-lg p-3 text-white text-center`}>
              <span className="text-2xl">{dept.icon}</span>
              <p className="text-xs font-medium mt-1">{dept.shortName}</p>
              <p className="text-[10px] opacity-80">{dept.usesLLM ? '🤖 LLM' : '⚙️ Code'}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-700 rounded-lg p-3 text-center">
          <span className="text-xl">👑</span>
          <p className="text-white text-sm font-medium">CEO (Bạn)</p>
          <p className="text-gray-400 text-xs">Phê duyệt cuối cùng + Kill Switch</p>
        </div>
      </div>
    </div>
  );
}

// Department Detail Component
function DepartmentDetail({ dept }: { dept: Department }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className={`bg-gradient-to-r ${dept.color} p-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{dept.icon}</span>
          <div>
            <h3 className="text-white font-bold text-lg">{dept.name}</h3>
            <p className="text-white/80 text-sm">{dept.role}</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs">🤖</span>
            LLM: {dept.llmType}
          </h4>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">📋 Nhiệm vụ:</h4>
          <ul className="space-y-1.5">
            {dept.tasks.map((task, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                {task}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">⚠️ Quy tắc:</h4>
          <ul className="space-y-1.5">
            {dept.rules.map((rule, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-0.5">⚡</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">📤 Output:</h4>
          <p className="text-gray-300 text-sm bg-gray-700 rounded p-2 font-mono text-xs">{dept.outputFormat}</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">🔗 Tương tác với:</h4>
          <div className="flex flex-wrap gap-2">
            {dept.interactsWith.map((name, i) => (
              <span key={i} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Departments Component
function Departments() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  if (selectedDept) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedDept(null)}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          ← Quay lại danh sách
        </button>
        <DepartmentDetail dept={selectedDept} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">📋 11 Phòng ban (Agents)</h2>
      <div className="grid grid-cols-1 gap-3">
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-lg flex items-center justify-center text-xl`}>
                {dept.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{dept.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${dept.usesLLM ? 'bg-purple-900 text-purple-300' : 'bg-gray-700 text-gray-400'}`}>
                    {dept.usesLLM ? '🤖 LLM' : '⚙️ Code'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-0.5">{dept.role}</p>
              </div>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Workflow Component
function Workflow() {
  const phases = [
    { ...workflow.phaseA, icon: '🟢' },
    { ...workflow.phaseB, icon: '🟡' },
    { ...workflow.phaseC, icon: '🔴' },
    { ...workflow.phaseD, icon: '🔵' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">🔄 Luồng vận hành</h2>
      
      <div className="space-y-4">
        {phases.map((phase, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className={`p-4 border-b border-gray-700 ${
              phase.color === 'green' ? 'bg-green-900/20' :
              phase.color === 'yellow' ? 'bg-yellow-900/20' :
              phase.color === 'red' ? 'bg-red-900/20' :
              'bg-blue-900/20'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{phase.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{phase.name}</h3>
                  <p className="text-gray-400 text-sm">{phase.description}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {phase.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-300">
                      {i + 1}
                    </div>
                    <p className="text-gray-300 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            {idx < phases.length - 1 && (
              <div className="flex justify-center py-2">
                <span className="text-gray-500 text-2xl">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">⏰ Lịch báo cáo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Chu kỳ</th>
                <th className="text-left py-2">Phòng ban</th>
                <th className="text-left py-2">Nội dung</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700/50">
                <td className="py-2">Mỗi 5 phút</td>
                <td>Treasury</td>
                <td>Đối soát số dư, drift</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2">Mỗi 15 phút</td>
                <td>WFI + CMM</td>
                <td>Dòng tiền cá voi, nguy cơ bẫy</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2">00:00 UTC hàng ngày</td>
                <td>CFO + BI</td>
                <td>PnL net, OPEX, tiến độ hòa vốn</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2">Chủ nhật</td>
                <td>BI</td>
                <td>Chấm điểm Agent, đề xuất chỉnh tham số</td>
              </tr>
              <tr>
                <td className="py-2">Ngày 1 hàng tháng</td>
                <td>CFO</td>
                <td>Báo cáo lãi lỗ thật, quyết định Scale-up/Shut-down</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Constitution Component
function Constitution() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">📜 Hiến pháp Công ty Crypto AI</h2>
      <div className="bg-gradient-to-r from-amber-900/30 to-amber-700/20 rounded-xl p-6 border border-amber-700/50">
        <p className="text-amber-200 text-sm mb-4">Version 1.0 • CEO: [Tên của bạn]</p>
        <div className="space-y-4">
          {constitution.map(article => (
            <div key={article.id} className="bg-gray-800/50 rounded-lg p-4 border border-amber-800/30">
              <h3 className="text-amber-300 font-semibold flex items-center gap-2">
                <span className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center text-xs text-white">{article.id}</span>
                {article.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2 ml-9">{article.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">🤫 Luật Ngầm (Implicit Rules)</h3>
        <div className="space-y-3">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-medium">📊 Data Agent - Luật "Cache & Batch"</p>
            <p className="text-gray-400 text-xs mt-1">Mọi dữ liệu kéo về phải được lưu vào Cache. Chỉ gọi API khi Cache hết hạn. Không kéo dữ liệu trùng lặp.</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-purple-300 text-sm font-medium">🧠 Quant Agent - Luật "Code First, LLM Second"</p>
            <p className="text-gray-400 text-xs mt-1">Mọi phép tính toán học (RSI, MACD, EMA) BẮT BUỘC dùng Python FREE. Chỉ gọi LLM khi TỔNG HỢP và SUY LUẬN.</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-yellow-300 text-sm font-medium">⚡ Execution Agent - Luật "Maker over Taker"</p>
            <p className="text-gray-400 text-xs mt-1">Ưu tiên LIMIT (Maker 0.02%) thay vì MARKET (Taker 0.05%). Phải báo cáo CFO nếu bị lỗ phí ngược.</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-red-300 text-sm font-medium">🛡️ Risk Agent - Luật "Net PnL Awareness"</p>
            <p className="text-gray-400 text-xs mt-1">Điểm TP BẮT BUỘC cộng thêm 0.07% (2 chiều phí sàn). TP phải là điểm sau khi trừ phí vẫn đạt mục tiêu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Costs Component
function Costs() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">💰 Chi phí vận hành & Token Burn</h2>
      
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">🏗️ Bảng chi phí MVP (Free Tier)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Hạng mục</th>
                <th className="text-left py-2">Giải pháp</th>
                <th className="text-right py-2">Chi phí</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {costBreakdown.mvp.map((item, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="py-2 font-medium">{item.item}</td>
                  <td className="py-2">{item.solution}</td>
                  <td className="py-2 text-right text-green-400 font-medium">{item.cost}</td>
                </tr>
              ))}
              <tr className="bg-green-900/20">
                <td className="py-2 font-bold text-white" colSpan={2}>TỔNG OPEX</td>
                <td className="py-2 text-right text-green-400 font-bold">$0-5/tháng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">🤖 Token Burn mỗi phiên giao dịch</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{costBreakdown.tokenBurnPerTrade.totalTokens.toLocaleString()}</p>
            <p className="text-gray-400 text-xs">Total tokens</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">${costBreakdown.tokenBurnPerTrade.costClaude}</p>
            <p className="text-gray-400 text-xs">Nếu toàn Claude</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">${costBreakdown.tokenBurnPerTrade.costHybrid}</p>
            <p className="text-gray-400 text-xs">Hybrid (Free + Claude)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Agent</th>
                <th className="text-right py-2">Tokens</th>
                <th className="text-right py-2">Chi phí (Claude)</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {costBreakdown.tokenBurnPerTrade.breakdown.map((item, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="py-2">{item.agent}</td>
                  <td className="py-2 text-right">{item.tokens.toLocaleString()}</td>
                  <td className="py-2 text-right">{item.cost > 0 ? `$${item.cost}` : 'Free'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">📊 Dự báo chi phí AI hàng tháng</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
            <div>
              <p className="text-white text-sm font-medium">90 lệnh/tháng (3 lệnh/ngày)</p>
              <p className="text-gray-400 text-xs">Hybrid approach</p>
            </div>
            <p className="text-green-400 font-bold">$2.43/tháng</p>
          </div>
          <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
            <div>
              <p className="text-white text-sm font-medium">225 lệnh/tháng (7.5 lệnh/ngày - Scalping)</p>
              <p className="text-gray-400 text-xs">High frequency</p>
            </div>
            <p className="text-yellow-400 font-bold">$6.08/tháng</p>
          </div>
          <div className="flex items-center justify-between bg-red-900/20 rounded-lg p-3 border border-red-800/30">
            <div>
              <p className="text-red-300 text-sm font-medium">⚠️ Cảnh báo</p>
              <p className="text-gray-400 text-xs">Nếu chi phí AI &gt; 50% lợi nhuận kỳ vọng → DỪNG HỆ THỐNG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Responsibility Component
function Responsibility() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">👥 Ma trận phân quyền</h2>
      
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="text-left py-3 px-4">Câu hỏi</th>
              <th className="text-left py-3 px-4">Ai trả lời cuối cùng</th>
            </tr>
          </thead>
          <tbody>
            {responsibilityMatrix.map((item, i) => (
              <tr key={i} className="border-t border-gray-700 hover:bg-gray-700/30">
                <td className="py-3 px-4 text-gray-300">{item.question}</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                    {item.agent}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">👑 Vai trò CEO (Bạn)</h3>
        <div className="space-y-3">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-medium">1. Thiết lập Luật chơi</p>
            <p className="text-gray-400 text-xs mt-1">Viết "Hiến pháp" cho công ty. Ví dụ: "Tối đa 3 lệnh cùng lúc", "Lỗ 5%/ngày → ngưng 24h"</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-medium">2. Phê duyệt chiến lược (Human-in-the-loop)</p>
            <p className="text-gray-400 text-xs mt-1">Giai đoạn đầu: Risk Agent gửi tin Telegram xin duyệt. Khi ổn định → chuyển sang Auto 100%</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-red-300 text-sm font-medium">3. Nhấn nút Kill Switch</p>
            <p className="text-gray-400 text-xs mt-1">Khi thị trường quá dị biệt (Flash crash), tắt toàn bộ hệ thống, hủy mọi lệnh chờ</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-medium">4. Đánh giá hiệu suất</p>
            <p className="text-gray-400 text-xs mt-1">Xem báo cáo BI hàng tuần, điều chỉnh "sức khỏe" các Agent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Strategy Component
function Strategy() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">🎯 Chiến lược vận hành</h2>

      <div className="bg-gradient-to-r from-green-900/30 to-green-700/20 rounded-xl p-5 border border-green-700/50">
        <h3 className="text-green-300 font-semibold mb-3">🏆 Option C: Hybrid Learning (ĐỀ XUẤT)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-white font-medium text-sm">Giai đoạn 1 (Tháng 1-2)</p>
            <p className="text-green-400 text-lg font-bold">Paper Trading</p>
            <ul className="text-gray-400 text-xs mt-2 space-y-1">
              <li>• Không dùng tiền thật</li>
              <li>• 3 lệnh/ngày, đòn bẩy 5x, BTC/ETH</li>
              <li>• Mục tiêu: Học + Tối ưu prompt</li>
              <li>• Chi phí AI: $2.03/tháng</li>
              <li>• Rủi ro: $0</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-white font-medium text-sm">Giai đoạn 2 (Tháng 3+)</p>
            <p className="text-blue-400 text-lg font-bold">Live Trading</p>
            <ul className="text-gray-400 text-xs mt-2 space-y-1">
              <li>• Nạp $50-100</li>
              <li>• Đòn bẩy 3-5x, BTC/ETH</li>
              <li>• Rủi ro mỗi lệnh: 1% tài khoản</li>
              <li>• Chi phí AI: $2-3/tháng</li>
              <li>• Lợi nhuận kỳ vọng: $5-10/tháng</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">📊 Mô hình hòa vốn</h3>
        <div className="space-y-3">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-300 text-sm">
              <span className="text-white font-medium">Kỳ vọng mỗi lệnh (E_net):</span> +$0.022/lệnh
            </p>
            <p className="text-gray-500 text-xs mt-1">Win rate 55%, R:R 1:2, đòn bẩy 5x, sau phí</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2">Mục tiêu</th>
                  <th className="text-right py-2">Số lệnh cần</th>
                  <th className="text-right py-2">Thời gian (@ 3 lệnh/ngày)</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700/50">
                  <td className="py-2">Hòa vốn OPEX ($0)</td>
                  <td className="py-2 text-right">0 lệnh</td>
                  <td className="py-2 text-right text-green-400">Ngày 1</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2">Lãi $1</td>
                  <td className="py-2 text-right">~46 lệnh</td>
                  <td className="py-2 text-right">~16 ngày</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2">Lãi $5</td>
                  <td className="py-2 text-right">~230 lệnh</td>
                  <td className="py-2 text-right">~77 ngày</td>
                </tr>
                <tr>
                  <td className="py-2">Lãi $10</td>
                  <td className="py-2 text-right">~460 lệnh</td>
                  <td className="py-2 text-right">~154 ngày</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">⏰ Khung giờ giao dịch tối ưu</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">00:00–08:00 UTC (Châu Á)</p>
              <p className="text-gray-400 text-xs">Thanh khoản vừa, ít tin sốc → Tốt để học/backtest live</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">07:00–11:00 UTC (Châu Âu)</p>
              <p className="text-gray-400 text-xs">Thanh khoản tăng, xu hướng bắt đầu hình thành</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-yellow-900/20 rounded-lg p-3 border border-yellow-800/30">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">13:00–16:00 UTC (Mỹ + Âu)</p>
              <p className="text-gray-400 text-xs">Thanh khoản TỐT NHẤT nhưng cũng nhiều Stop Hunt NHẤT</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-red-900/20 rounded-lg p-3 border border-red-800/30">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Cuối tuần</p>
              <p className="text-gray-400 text-xs">Thanh khoản mỏng, trượt giá cao → CMM nên CHẶN</p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-red-900/20 rounded-lg p-3 border border-red-800/30">
          <p className="text-red-300 text-sm font-medium">⚠️ Quy tắc cứng</p>
          <p className="text-gray-400 text-xs mt-1">Không mở vị thế mới trong ±15 phút quanh các mốc tin CPI/FOMC. Kiểm tra lịch kinh tế mỗi sáng.</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">💡 Vốn tối thiểu cần có</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Mục tiêu</th>
                <th className="text-right py-2">Vốn tối thiểu</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700/50">
                <td className="py-2">Chỉ hòa vốn (OPEX $5/tháng)</td>
                <td className="py-2 text-right text-yellow-400">~$15</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2">Lãi $5/tháng (OPEX $5/tháng)</td>
                <td className="py-2 text-right text-green-400">~$30</td>
              </tr>
              <tr>
                <td className="py-2">Lãi $10/tháng (OPEX $5/tháng)</td>
                <td className="py-2 text-right text-green-400">~$45</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs mt-3">* Dựa trên hiệu suất giả định 0.44%/lệnh, ~34%/tháng trên vốn</p>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'departments': return <Departments />;
      case 'paper-trading': return <PaperTrading />;
      case 'code': return <CodeSamples />;
      case 'database': return <DatabaseSchema />;
      case 'workflow': return <Workflow />;
      case 'constitution': return <Constitution />;
      case 'costs': return <Costs />;
      case 'responsibility': return <Responsibility />;
      case 'strategy': return <Strategy />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
