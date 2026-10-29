import { useState } from 'react';

interface LLMConfig {
  provider: string;
  model: string;
  inputPrice: number;
  outputPrice: number;
  isFree: boolean;
  assignedTo: string[];
  description: string;
}

export default function LLMIntegration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'monitoring' | 'prompts'>('overview');

  const llmConfigs: LLMConfig[] = [
    {
      provider: 'Groq',
      model: 'llama-3.3-70b-versatile',
      inputPrice: 0,
      outputPrice: 0,
      isFree: true,
      assignedTo: ['Quant', 'Macro', 'WFI'],
      description: 'Miễn phí, 30 req/min. Dùng cho tác vụ tổng hợp đơn giản.'
    },
    {
      provider: 'Google',
      model: 'gemini-2.0-flash',
      inputPrice: 0,
      outputPrice: 0,
      isFree: true,
      assignedTo: ['CFO', 'BI', 'ACC'],
      description: 'Miễn phí, 15 req/min. Dùng cho báo cáo và phân tích nhẹ.'
    },
    {
      provider: 'Anthropic',
      model: 'claude-3.5-sonnet',
      inputPrice: 3.0,
      outputPrice: 15.0,
      isFree: false,
      assignedTo: ['Risk', 'CMM'],
      description: '$3/$15 per 1M tokens. Dùng cho suy luận phức tạp, quyết định quan trọng.'
    }
  ];

  const promptTemplates = [
    {
      agent: 'Quant Agent',
      icon: '🧠',
      prompt: `Bạn là Quant Agent - Phòng Nghiên cứu & Định lượng.

DỮ LIỆU ĐẦU VÀO:
{market_data}

NHIỆM VỤ:
1. Phân tích các chỉ báo kỹ thuật (RSI, MACD, EMA, Bollinger)
2. Xác định xu hướng hiện tại
3. Đưa ra tín hiệu LONG/SHORT/NEUTRAL
4. Tính Confidence Score (0-100)

QUY TẮC:
- Chỉ đưa tín hiệu khi ≥3 chỉ báo đồng thuận
- Confidence < 40: Không giao dịch
- KHÔNG dự đoán giá, chỉ phân tích xu hướng

OUTPUT JSON:
{
  "direction": "LONG|SHORT|NEUTRAL",
  "confidence": 0-100,
  "reasoning": "string",
  "key_levels": {"support": 0, "resistance": 0}
}`
    },
    {
      agent: 'Risk Agent',
      icon: '🛡️',
      prompt: `Bạn là Risk Agent - Phòng Quản lý Rủi ro.

DỮ LIỆU ĐẦU VÀO:
- Quant Signal: {quant_signal}
- CMM Analysis: {cmm_analysis}
- Open Trades: {open_trades}
- Balance: {balance}

NHIỆM VỤ:
1. Kiểm tra chéo tín hiệu từ Quant + CMM
2. Tính Position Size (risk 2% tài khoản)
3. Xác định SL/TP (R:R tối thiểu 1:2)
4. QUYẾT ĐỊNH CUỐI CÙNG: APPROVE hoặc REJECT

QUY TẮC CỨNG:
- Rủi ro tối đa mỗi lệnh: 2% tài khoản
- Max 3 lệnh cùng lúc
- Trap Score > 70 → REJECT
- TP phải cộng thêm 0.07% phí sàn

OUTPUT JSON:
{
  "decision": "APPROVE|REJECT",
  "direction": "LONG|SHORT",
  "entry": 0,
  "stop_loss": 0,
  "take_profit": 0,
  "position_size": 0,
  "reasoning": "string"
}`
    },
    {
      agent: 'CMM Agent',
      icon: '⚖️',
      prompt: `Bạn là CMM Agent - Phòng Pháp chế & Vi cấu trúc.

DỮ LIỆU ĐẦU VÀO:
- Market Data: {market_data}
- Whale Events: {whale_events}
- Orderbook: {orderbook}

NHIỆM VỤ:
1. Phân tích hành vi cá mập (Wyckoff)
2. Phát hiện Stop Hunt, Spoofing, Wash Trading
3. Tính Trap Score (0-100)
4. Cảnh báo nếu phát hiện bẫy

QUY TẮC:
- Trap Score > 70 → Cảnh báo Risk
- Phân biệt Absorption vs Distribution
- Không kết luận tuyệt đối về hành vi cá voi

OUTPUT JSON:
{
  "trap_score": 0-100,
  "whale_behavior": "accumulation|distribution|neutral",
  "warnings": ["string"],
  "recommendation": "string"
}`
    },
    {
      agent: 'Macro Agent',
      icon: '📰',
      prompt: `Bạn là Macro Agent - Phòng Vĩ mô & Tin tức.

DỮ LIỆU ĐẦU VÀO:
- News: {news_items}
- Economic Calendar: {calendar}
- Geopolitical: {geopolitical}

NHIỆM VỤ:
1. Đọc và phân tích tin tức
2. Chấm điểm Sentiment (-10 đến +10)
3. Phân loại tác động (LOW/MED/HIGH/CRITICAL)
4. Phát hiện Black Swan

QUY TẮC:
- Batch processing: đọc tất cả tin 1 lần
- RED FLAG: Sàn hack, Stablecoin mất peg
- Correlation: Dầu↑ + CPI↑ → Tiêu cực Crypto

OUTPUT JSON:
{
  "sentiment_score": -10 to +10,
  "impact_level": "LOW|MED|HIGH|CRITICAL",
  "red_flags": ["string"],
  "macro_context": "string"
}`
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🤖 LLM Integration</h2>
        <div className="flex gap-2">
          {['overview', 'configs', 'monitoring', 'prompts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab === 'overview' ? '📊 Tổng quan' : tab === 'configs' ? '⚙️ Cấu hình' : tab === 'monitoring' ? '📈 Monitoring' : '📝 Prompts'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs">Tổng LLM sử dụng</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
              <p className="text-gray-500 text-xs mt-1">Groq, Gemini, Claude</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs">Agents dùng LLM</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">7/11</p>
              <p className="text-gray-500 text-xs mt-1">4 agents dùng Python thuần</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs">Chi phí dự kiến/tháng</p>
              <p className="text-2xl font-bold text-green-400 mt-1">$2-5</p>
              <p className="text-gray-500 text-xs mt-1">Hybrid approach</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">🏗️ Kiến trúc LLM Hybrid</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚡</span>
                  <h4 className="text-green-300 font-medium text-sm">Groq (Free)</h4>
                </div>
                <p className="text-gray-400 text-xs mb-2">30 req/min • Llama 3.3 70B</p>
                <div className="space-y-1">
                  {['Quant Agent', 'Macro Agent', 'WFI Agent'].map(a => (
                    <div key={a} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      <span className="text-gray-300 text-xs">{a}</span>
                    </div>
                  ))}
                </div>
                <p className="text-green-400 text-xs mt-2 font-medium">$0/tháng</p>
              </div>

              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💎</span>
                  <h4 className="text-blue-300 font-medium text-sm">Gemini Flash (Free)</h4>
                </div>
                <p className="text-gray-400 text-xs mb-2">15 req/min • Gemini 2.0</p>
                <div className="space-y-1">
                  {['CFO Agent', 'BI Agent', 'ACC Agent'].map(a => (
                    <div key={a} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      <span className="text-gray-300 text-xs">{a}</span>
                    </div>
                  ))}
                </div>
                <p className="text-blue-400 text-xs mt-2 font-medium">$0/tháng</p>
              </div>

              <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🧠</span>
                  <h4 className="text-purple-300 font-medium text-sm">Claude 3.5 Sonnet</h4>
                </div>
                <p className="text-gray-400 text-xs mb-2">$3/$15 per 1M tokens</p>
                <div className="space-y-1">
                  {['Risk Agent', 'CMM Agent'].map(a => (
                    <div key={a} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      <span className="text-gray-300 text-xs">{a}</span>
                    </div>
                  ))}
                </div>
                <p className="text-purple-400 text-xs mt-2 font-medium">~$2-5/tháng</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">💡 Chiến lược tối ưu chi phí</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-gray-700/30 rounded p-3">
                <span className="text-green-400 text-lg">1.</span>
                <div>
                  <p className="text-white text-sm font-medium">80% tác vụ dùng Free tier</p>
                  <p className="text-gray-400 text-xs">Chỉ Risk + CMM dùng Claude (suy luận phức tạp)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700/30 rounded p-3">
                <span className="text-green-400 text-lg">2.</span>
                <div>
                  <p className="text-white text-sm font-medium">Cache aggressively</p>
                  <p className="text-gray-400 text-xs">Cùng tin tức chỉ gọi LLM 1 lần, các Agent đọc lại từ cache</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700/30 rounded p-3">
                <span className="text-green-400 text-lg">3.</span>
                <div>
                  <p className="text-white text-sm font-medium">Batch processing</p>
                  <p className="text-gray-400 text-xs">Gom 10 tin đọc 1 lần, không gọi LLM 10 lần riêng lẻ</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700/30 rounded p-3">
                <span className="text-green-400 text-lg">4.</span>
                <div>
                  <p className="text-white text-sm font-medium">Kill switch chi phí</p>
                  <p className="text-gray-400 text-xs">Nếu chi phí AI &gt; 50% lợi nhuận → DỪNG HỆ THỐNG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'configs' && (
        <div className="space-y-4">
          {llmConfigs.map((config, i) => (
            <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className={`px-4 py-3 border-b border-gray-700 ${config.isFree ? 'bg-green-900/10' : 'bg-purple-900/10'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{config.provider === 'Groq' ? '⚡' : config.provider === 'Google' ? '💎' : '🧠'}</span>
                    <div>
                      <h3 className="text-white font-medium">{config.provider} - {config.model}</h3>
                      <p className="text-gray-400 text-xs">{config.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${config.isFree ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                    {config.isFree ? 'FREE' : 'PAID'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-gray-400 text-xs">Input Price</p>
                    <p className="text-white text-sm font-medium">${config.inputPrice}/1M tokens</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Output Price</p>
                    <p className="text-white text-sm font-medium">${config.outputPrice}/1M tokens</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Rate Limit</p>
                    <p className="text-white text-sm font-medium">{config.provider === 'Groq' ? '30 req/min' : config.provider === 'Google' ? '15 req/min' : '60 req/min'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Assigned To</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {config.assignedTo.map(a => (
                        <span key={a} className="bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={`Enter ${config.provider} API Key...`}
                    className="flex-1 bg-gray-700 text-white text-xs rounded px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Today's Tokens</p>
              <p className="text-xl font-bold text-white">86,400</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Today's Cost</p>
              <p className="text-xl font-bold text-green-400">$0.12</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Monthly Projection</p>
              <p className="text-xl font-bold text-yellow-400">$3.60</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs">Budget Remaining</p>
              <p className="text-xl font-bold text-green-400">$1.40</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">📊 Token Burn by Agent (Hôm nay)</h3>
            <div className="space-y-2">
              {[
                { agent: 'Quant', tokens: 15000, cost: 0, color: 'bg-green-500' },
                { agent: 'Macro', tokens: 25000, cost: 0, color: 'bg-green-500' },
                { agent: 'Risk', tokens: 8000, cost: 0.042, color: 'bg-purple-500' },
                { agent: 'CMM', tokens: 12000, cost: 0.063, color: 'bg-purple-500' },
                { agent: 'CFO', tokens: 5000, cost: 0, color: 'bg-blue-500' },
                { agent: 'BI', tokens: 3000, cost: 0, color: 'bg-blue-500' },
                { agent: 'WFI', tokens: 18000, cost: 0, color: 'bg-green-500' },
                { agent: 'ACC', tokens: 400, cost: 0, color: 'bg-blue-500' },
              ].map(item => (
                <div key={item.agent} className="flex items-center gap-3">
                  <span className="text-gray-300 text-xs w-12">{item.agent}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full opacity-60`}
                      style={{ width: `${(item.tokens / 25000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-xs w-16 text-right">{(item.tokens / 1000).toFixed(0)}K</span>
                  <span className={`text-xs w-16 text-right font-medium ${item.cost > 0 ? 'text-purple-400' : 'text-green-400'}`}>
                    {item.cost > 0 ? `$${item.cost.toFixed(3)}` : 'Free'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">⚠️ Cảnh báo chi phí</h3>
            <div className="space-y-2">
              <div className="bg-green-900/20 border border-green-800/30 rounded p-3">
                <p className="text-green-300 text-sm">✅ Chi phí AI đang ở mức an toàn</p>
                <p className="text-gray-400 text-xs mt-1">Dự báo tháng: $3.60 &lt; Ngân sách $5.00</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-3">
                <p className="text-yellow-300 text-sm">⚡ Tip: Risk Agent chiếm 65% chi phí</p>
                <p className="text-gray-400 text-xs mt-1">Xem xét cache kết quả nếu cùng market condition</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">System Prompts cho từng Agent. Click để xem chi tiết.</p>
          <div className="grid grid-cols-2 gap-4">
            {promptTemplates.map((tmpl, i) => (
              <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700 bg-gray-900/50 flex items-center gap-2">
                  <span className="text-lg">{tmpl.icon}</span>
                  <h3 className="text-white font-medium text-sm">{tmpl.agent}</h3>
                </div>
                <div className="p-4">
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
                    {tmpl.prompt}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
