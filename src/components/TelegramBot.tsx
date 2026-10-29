import { useState } from 'react';

interface TelegramMessage {
  id: number;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: string;
  buttons?: string[];
}

export default function TelegramBot() {
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 1,
      type: 'system',
      content: '🟢 Hệ thống Crypto AI đã khởi động\n\n📊 Cấu hình:\n• Vốn: $100\n• Leverage: 5x\n• Risk/lệnh: 2%\n• Max lệnh: 3\n\n⏰ Đang thu thập dữ liệu...',
      timestamp: '08:00:00'
    },
    {
      id: 2,
      type: 'bot',
      content: '📊 BÁO CÁO SÁNG\n\n💰 Balance: $100.00\n📈 BTC: $68,542 (+1.2%)\n🌡️ F&G Index: 58 (Neutral)\n💧 Funding Rate: 0.012%\n🐋 Whale Activity: Trung tính\n\n📋 Lệnh mở: 0\n📅 Hôm nay: CPI công bố 13:30 UTC\n\n⚠️ Lưu ý: Tránh giao dịch ±15 phút quanh CPI',
      timestamp: '08:05:00'
    },
    {
      id: 3,
      type: 'bot',
      content: '🤖 TÍN HIỆU GIAO DỊCH\n\n📊 BTC/USDT\n🟢 LONG @ $68,420\n\n🎯 Entry: $68,420\n🛑 Stop Loss: $67,280 (-1.67%)\n✅ Take Profit: $70,700 (+3.33%)\n📏 Position: $4.00 (4% balance)\n⚡ Leverage: 5x\n\n📈 Lý do:\n• RSI = 28 (quá bán)\n• EMA20 > EMA50 (uptrend)\n• Funding Rate âm (-0.008%)\n• Whale đang gom hàng\n\n🛡️ Risk: APPROVED\n🐋 CMM: No trap detected (23/100)\n💰 CFO: Net PnL expected +$2.80\n\n⏳ Chờ CEO phê duyệt...',
      timestamp: '10:32:00',
      buttons: ['✅ Duyệt', '⚙️ Điều chỉnh', '❌ Hủy']
    },
    {
      id: 4,
      type: 'user',
      content: '✅ Duyệt',
      timestamp: '10:33:00'
    },
    {
      id: 5,
      type: 'bot',
      content: '⚡ LỆNH ĐÃ THỰC THI\n\n🟢 LONG BTC/USDT\n💵 Entry: $68,435 (slippage: +$15)\n📏 Size: 0.00029 BTC ($19.90)\n💸 Fee: $0.004 (Maker 0.02%)\n\n🛑 SL đặt sẵn: $67,280\n✅ TP đặt sẵn: $70,700\n\n📊 Risk/Reward: 1:2\n💰 Max loss: -$2.00 (2% balance)\n💰 Target profit: +$4.00 (4% balance)\n\n🧾 Treasury: Đã ghi sổ\n🤖 ACC: Token burn = 16,300 tokens ($0.027)',
      timestamp: '10:33:05'
    },
    {
      id: 6,
      type: 'bot',
      content: '🐋 CẢNH BÁO CÁ VOI\n\n⚠️ Phát hiện lệnh lớn:\n• $2.5M BTC bán trên Binance\n• Exchange Inflow tăng 15%\n• Trap Score tăng: 45 → 68\n\n📊 Vị thế hiện tại:\n🟢 LONG BTC @ $68,435\n📈 PnL hiện tại: +$0.42 (+2.1%)\n\n🛡️ Risk đề nghị: Giữ lệnh, SL vẫn hợp lý\n🐋 CMM đề nghị: CHỜ, chưa phải bẫy thực sự\n\n💡 Lý do: Lệnh bán có thể là OTC, không phải panic sell',
      timestamp: '11:15:00'
    },
    {
      id: 7,
      type: 'bot',
      content: '✅ CHỐT LỜI\n\n🟢 LONG BTC/USDT\n💵 Entry: $68,435\n💵 Exit: $70,700 (TP hit)\n📏 Size: $19.90\n⚡ Leverage: 5x\n\n💰 Gross PnL: +$3.32\n💸 Fees: -$0.028\n💵 Net PnL: +$3.29 (+16.5%)\n\n📊 Cập nhật:\n💰 Balance: $103.29\n📈 Total Return: +3.29%\n🏆 Win Streak: 1\n\n🧾 Treasury: Đã ghi sổ\n📊 BI: Agent scores updated\n🤖 ACC: Daily token burn = $0.12',
      timestamp: '14:22:00'
    },
    {
      id: 8,
      type: 'bot',
      content: '📊 BÁO CÁO CUỐI NGÀY\n\n💰 Balance: $103.29 (+3.29%)\n📈 Trades hôm nay: 1\n✅ Wins: 1 | ❌ Losses: 0\n🏆 Win Rate: 100%\n💵 Net PnL: +$3.29\n💸 Total Fees: $0.028\n\n📊 Agent Performance:\n🧠 Quant: 85/100 (tín hiệu chính xác)\n📰 Macro: 72/100 (sentiment đúng)\n🛡️ Risk: 90/100 (SL/TP tối ưu)\n🐋 CMM: 78/100 (không false alarm)\n\n🤖 Token Burn:\n• Hôm nay: 86,000 tokens\n• Chi phí: $0.12\n• Dự báo tháng: $3.60\n\n💡 CFO: Hệ thống đang hòa vốn sau 1 ngày\n🎯 Tiến độ hòa vốn: 1/230 lệnh',
      timestamp: '23:59:00'
    }
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg: TelegramMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([...messages, newMsg]);
    setInputText('');

    // Auto reply
    setTimeout(() => {
      let reply = '';
      if (inputText.toLowerCase().includes('balance') || inputText.toLowerCase().includes('số dư')) {
        reply = '💰 Số dư hiện tại: $103.29\n\n📊 Chi tiết:\n• Cash: $103.29\n• Positions: 0\n• Unrealized PnL: $0\n• Realized PnL: +$3.29';
      } else if (inputText.toLowerCase().includes('status') || inputText.toLowerCase().includes('trạng thái')) {
        reply = '🟢 Hệ thống: HOẠT ĐỘNG\n\n📊 Lệnh mở: 0\n📈 Win Rate: 100%\n💰 Balance: $103.29\n🤖 Token burn hôm nay: $0.12';
      } else if (inputText.toLowerCase().includes('stop') || inputText.toLowerCase().includes('dừng')) {
        reply = '⏸️ Hệ thống đã tạm dừng\n\n⚠️ Không có lệnh nào bị ảnh hưởng.\nGõ /start để khởi động lại.';
      } else if (inputText.toLowerCase().includes('help') || inputText.toLowerCase().includes('giúp')) {
        reply = '📋 Lệnh available:\n\n/balance - Xem số dư\n/status - Trạng thái hệ thống\n/trades - Lịch sử giao dịch\n/stop - Tạm dừng hệ thống\n/start - Khởi động lại\n/report - Báo cáo chi tiết\n/settings - Cấu hình hệ thống';
      } else {
        reply = '🤖 Tôi không hiểu lệnh này. Gõ /help để xem danh sách lệnh.';
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: reply,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">📱 Telegram Bot Dashboard</h2>
        <span className="text-gray-400 text-sm">CEO Interface</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Telegram Chat */}
        <div className="col-span-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col" style={{height: '600px'}}>
          <div className="bg-[#17212b] px-4 py-3 border-b border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-medium text-sm">Crypto AI Bot</p>
              <p className="text-green-400 text-xs">online • 11 agents active</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0e1621]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user' ? 'bg-[#2b5278] text-white' :
                  msg.type === 'system' ? 'bg-[#1c2733] text-gray-300 border border-gray-700' :
                  'bg-[#182533] text-gray-200'
                }`}>
                  <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
                  {msg.buttons && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-600/30">
                      {msg.buttons.map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setMessages(prev => [...prev, {
                              id: prev.length + 1,
                              type: 'user',
                              content: btn,
                              timestamp: new Date().toLocaleTimeString()
                            }]);
                          }}
                          className="px-3 py-1 bg-[#2b5278] hover:bg-[#3a6a9a] rounded text-xs text-white transition-colors"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-500 mt-1 text-right">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#17212b] px-4 py-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Nhập lệnh... (/help để xem danh sách)"
              className="flex-1 bg-[#242f3d] text-white text-sm rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
            >
              Gửi
            </button>
          </div>
        </div>

        {/* Bot Commands & Info */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">📋 Bot Commands</h3>
            <div className="space-y-2">
              {[
                { cmd: '/balance', desc: 'Xem số dư & NAV' },
                { cmd: '/status', desc: 'Trạng thái hệ thống' },
                { cmd: '/trades', desc: 'Lịch sử giao dịch' },
                { cmd: '/report', desc: 'Báo cáo chi tiết' },
                { cmd: '/agents', desc: 'Hiệu suất các Agent' },
                { cmd: '/settings', desc: 'Cấu hình hệ thống' },
                { cmd: '/stop', desc: 'Tạm dừng (Kill Switch)' },
                { cmd: '/start', desc: 'Khởi động lại' },
              ].map(item => (
                <div key={item.cmd} className="flex items-center gap-2">
                  <code className="text-blue-400 text-xs bg-gray-700 px-2 py-0.5 rounded">{item.cmd}</code>
                  <span className="text-gray-400 text-xs">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">⚙️ Cấu hình Bot</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs">Bot Token</label>
                <input type="password" defaultValue="7234567890:AAH..." className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 mt-1" />
              </div>
              <div>
                <label className="text-gray-400 text-xs">CEO Chat ID</label>
                <input type="text" defaultValue="123456789" className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 mt-1" />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Chế độ</label>
                <select className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 mt-1">
                  <option>Auto-approve (khi ổn định)</option>
                  <option>Manual-approve (giai đoạn đầu)</option>
                  <option>Read-only (chỉ báo cáo)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs">Tần suất báo cáo</label>
                <select className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 mt-1">
                  <option>Mỗi lệnh + Cuối ngày</option>
                  <option>Mỗi lệnh + Cuối tuần</option>
                  <option>Chỉ khi có sự kiện</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium text-sm mb-3">🔔 Thông báo</h3>
            <div className="space-y-2">
              {[
                { label: 'Tín hiệu giao dịch mới', enabled: true },
                { label: 'Lệnh đã khớp', enabled: true },
                { label: 'Chốt lời / Cắt lỗ', enabled: true },
                { label: 'Cảnh báo cá voi', enabled: true },
                { label: 'Báo cáo hàng ngày', enabled: true },
                { label: 'Cảnh báo drawdown', enabled: true },
                { label: 'Token burn cao', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs">{item.label}</span>
                  <div className={`w-8 h-4 rounded-full relative cursor-pointer ${item.enabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${item.enabled ? 'left-4' : 'left-0.5'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
