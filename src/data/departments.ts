export interface Department {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  role: string;
  usesLLM: boolean;
  llmType: string;
  tasks: string[];
  rules: string[];
  outputFormat: string;
  interactsWith: string[];
}

export const departments: Department[] = [
  {
    id: 1,
    name: "Phòng Dữ liệu",
    shortName: "Data",
    icon: "📊",
    color: "from-blue-500 to-blue-700",
    role: "Kéo & làm sạch dữ liệu thị trường từ các sàn giao dịch",
    usesLLM: false,
    llmType: "Không dùng LLM (Python thuần)",
    tasks: [
      "Kết nối API (CCXT, Binance WebSocket) kéo dữ liệu giá, volume",
      "Thu thập dữ liệu phái sinh (Funding Rate, Open Interest)",
      "Thu thập tin tức từ CryptoPanic, Telegram",
      "Làm sạch, chuẩn hóa timezone về UTC",
      "Cache dữ liệu để tránh gọi API trùng lặp",
      "Tuân thủ rate limit (tối đa 1200 req/phút Binance)"
    ],
    rules: [
      "Luôn chuẩn hóa thời gian về UTC",
      "Xử lý missing data: đánh dấu flag 'missing_data': true",
      "Không bao giờ suy luận hay dự đoán - chỉ thu thập",
      "Retry tối đa 3 lần, sau đó báo lỗi và dừng",
      "Cache dữ liệu 5 giây, không kéo trùng lặp"
    ],
    outputFormat: "Market Snapshot JSON (giá, volume, OHLCV, funding rate, OI)",
    interactsWith: ["Quant", "Macro", "WFI", "Treasury"]
  },
  {
    id: 2,
    name: "Phòng Nghiên cứu & Định lượng",
    shortName: "Quant",
    icon: "🧠",
    color: "from-purple-500 to-purple-700",
    role: "Phân tích kỹ thuật, đưa tín hiệu giao dịch với Confidence Score",
    usesLLM: true,
    llmType: "Groq/Gemini (Free - rẻ)",
    tasks: [
      "Tính RSI, MACD, Bollinger Bands, EMA bằng Python (TA-Lib)",
      "Phân tích xu hướng (EMA 20/50/200)",
      "Phân tích phái sinh (Funding Rate, OI, Long/Short Ratio)",
      "Xác định vùng Support/Resistance",
      "Tổng hợp chỉ báo → đưa ra tín hiệu LONG/SHORT",
      "Tính Confidence Score (0-100)"
    ],
    rules: [
      "Chỉ đưa tín hiệu khi ≥3 chỉ báo đồng thuận",
      "Confidence < 40: Không giao dịch",
      "Confidence 41-60: Tín hiệu yếu, chỉ quan sát",
      "Confidence 61-80: Tín hiệu trung bình, khối lượng nhỏ",
      "Confidence 81-100: Tín hiệu mạnh, khối lượng tiêu chuẩn",
      "LUẬT NGẦM: Mọi tính toán toán học dùng Python FREE, chỉ gọi LLM để TỔNG HỢP"
    ],
    outputFormat: "Trading Signal JSON (direction, confidence, entry zone, key levels)",
    interactsWith: ["Risk", "CMM", "BI"]
  },
  {
    id: 3,
    name: "Phòng Vĩ mô & Tin tức",
    shortName: "Macro",
    icon: "📰",
    color: "from-green-500 to-green-700",
    role: "Phân tích chiến sự, dầu mỏ, đất hiếm, ETF, dịch bệnh, dòng tiền tổ chức",
    usesLLM: true,
    llmType: "Groq/Gemini (Free - rẻ)",
    tasks: [
      "Theo dõi địa chính trị (chiến sự, căng thẳng thương mại)",
      "Theo dõi hàng hóa (dầu WTI/Brent, vàng, đất hiếm)",
      "Theo dõi kinh tế vĩ mô (CPI, PPI, Fed, việc làm)",
      "Theo dõi dòng tiền tổ chức (MicroStrategy, Tesla, ETF flows)",
      "Đọc tin tức crypto từ CryptoPanic, Telegram",
      "Chấm điểm Sentiment Score (-10 đến +10)",
      "Phát hiện Black Swan (thiên nga đen)"
    ],
    rules: [
      "Phân loại tác động: LOW(1-3), MEDIUM(4-6), HIGH(7-8), CRITICAL(9-10)",
      "RED FLAG: Sàn hack, Stablecoin mất peg, Fed tăng lãi bất ngờ",
      "Correlation Check: Dầu tăng + CPI cao → Lạm phát → Tiêu cực Crypto",
      "Batch processing: Gom 10 tin đọc 1 lần, không gọi LLM 10 lần"
    ],
    outputFormat: "Sentiment Report JSON (score, red flags, macro context, recommendation)",
    interactsWith: ["Risk", "CMM", "CFO"]
  },
  {
    id: 4,
    name: "Phòng Quản lý Rủi ro",
    shortName: "Risk",
    icon: "🛡️",
    color: "from-red-500 to-red-700",
    role: "Tính SL/TP, khối lượng, QUYỀN PHỦ QUYẾT mọi lệnh giao dịch",
    usesLLM: true,
    llmType: "Claude 3.5 Sonnet (Đắt - cần suy luận phức tạp)",
    tasks: [
      "Kiểm tra chéo tín hiệu từ Quant + Macro + CMM",
      "Tính Position Size dựa trên ATR và số dư tài khoản",
      "Xác định Stop Loss và Take Profit (R:R tối thiểu 1:2)",
      "Quyết định CUỐI CÙNG: APPROVE hoặc REJECT",
      "Đảm bảo tuân thủ quy tắc quản lý vốn"
    ],
    rules: [
      "Rủi ro tối đa mỗi lệnh: 1-2% tổng tài khoản",
      "Tổng rủi ro tối đa: ≤5% tài khoản cho tất cả lệnh mở",
      "Tối đa 3 lệnh cùng lúc",
      "RED FLAG OVERRIDE: Tin tức xấu → HỦY ngay",
      "Confidence Threshold: Chỉ giao dịch khi ≥65",
      "Correlation Check: Không 2 lệnh cùng chiều cho coin tương quan >0.8",
      "LUẬT NGẦM: TP phải cộng thêm 0.07% phí sàn"
    ],
    outputFormat: "Final Trade Plan JSON (approve/reject, entry, SL, TP, position size, reasoning)",
    interactsWith: ["Quant", "Macro", "CMM", "CFO", "Execution"]
  },
  {
    id: 5,
    name: "Phòng Thực thi",
    shortName: "Execution",
    icon: "⚡",
    color: "from-yellow-500 to-orange-600",
    role: "Gửi lệnh lên sàn, tối ưu phí, theo dõi trạng thái lệnh",
    usesLLM: false,
    llmType: "Không dùng LLM (Python thuần)",
    tasks: [
      "Nhận Trade Plan từ Risk Agent",
      "Kiểm tra số dư tài khoản",
      "Gửi lệnh Limit Order (Maker fee 0.02%)",
      "Nếu không khớp 60s → hủy, chuyển Market Order",
      "ĐẶT SẴN Stop Loss trên sàn ngay khi vào lệnh",
      "Báo cáo kết quả thực thi (giá khớp, slippage, fee)"
    ],
    rules: [
      "Chỉ thực thi khi final_decision = APPROVE",
      "Ưu tiên LIMIT (Maker 0.02%) over MARKET (Taker 0.05%)",
      "Không bao giờ gửi lệnh với quyền Withdraw",
      "LUẬT NGẦM: Ưu tiên Maker over Taker để tiết kiệm phí"
    ],
    outputFormat: "Execution Report JSON (order status, fill price, slippage, fee, SL order)",
    interactsWith: ["Risk", "Treasury", "CFO"]
  },
  {
    id: 6,
    name: "Giám đốc Tài chính",
    shortName: "CFO",
    icon: "💰",
    color: "from-emerald-500 to-emerald-700",
    role: "Tính hòa vốn, OPEX, lợi nhuận ròng, break-even analysis",
    usesLLM: true,
    llmType: "Gemini Flash (Free)",
    tasks: [
      "Theo dõi chi phí vận hành (server, API, phí sàn)",
      "Tính điểm hòa vốn (Break-even Point)",
      "Kiểm toán lệnh: Gross Profit vs Net Profit",
      "Cảnh báo nếu chi phí > lợi nhuận",
      "Đề xuất tối ưu chi phí"
    ],
    rules: [
      "Target OPEX hàng tháng: ≤$5 (MVP Free tier)",
      "Oracle Cloud Free + Groq Free + DefiLlama Free = $0/tháng",
      "Phải tính Net Profit sau khi trừ phí sàn + phí API + funding",
      "Cảnh báo nếu chi phí AI > 50% lợi nhuận kỳ vọng"
    ],
    outputFormat: "Financial Report JSON (gross profit, fees, net profit, break-even analysis)",
    interactsWith: ["Risk", "Execution", "Treasury", "BI"]
  },
  {
    id: 7,
    name: "Phòng Kinh doanh Thông minh",
    shortName: "BI",
    icon: "📈",
    color: "from-indigo-500 to-indigo-700",
    role: "Đánh giá hiệu suất, chấm điểm các Agent, đề xuất điều chỉnh",
    usesLLM: true,
    llmType: "Gemini Flash (Free)",
    tasks: [
      "Tính Win Rate, Profit Factor, Max Drawdown, Sharpe Ratio",
      "Chấm điểm hiệu suất từng Agent (0-100)",
      "Phân tích xu hướng hiệu suất theo thời gian",
      "Đề xuất điều chỉnh tham số cho CEO",
      "Báo cáo hàng ngày + đánh giá hàng tuần"
    ],
    rules: [
      "Win Rate < 40% → Cảnh báo Quant Agent quá lạc quan",
      "Slippage > 0.5% → Cảnh báo Execution Agent",
      "Max Drawdown > 5% → Cảnh báo khẩn cấp Risk Agent",
      "Profit Factor mục tiêu: >1.5"
    ],
    outputFormat: "Performance Report JSON (KPIs, agent scores, recommendations)",
    interactsWith: ["CFO", "Treasury", "CEO"]
  },
  {
    id: 8,
    name: "Phòng Pháp chế & Vi cấu trúc",
    shortName: "CMM",
    icon: "⚖️",
    color: "from-slate-500 to-slate-700",
    role: "Phát hiện bẫy cá mập, tuân thủ luật, quản lý thuế",
    usesLLM: true,
    llmType: "Claude 3.5 Sonnet (Đắt - phân tích phức tạp)",
    tasks: [
      "Phát hiện Stop Hunt, Spoofing, Wash Trading",
      "Phân tích hành vi cá mập theo Wyckoff",
      "Theo dõi Exchange Inflow/Outflow",
      "Phát hiện Liquidity Grabs, Fakeouts",
      "Đảm bảo tuân thủ Exchange ToS",
      "Ghi log giao dịch cho mục đích thuế (FIFO)"
    ],
    rules: [
      "Nếu Trap Probability > 70% → Risk phải giảm 50% khối lượng",
      "Cảnh báo khi $50M+ Stop Loss nằm gần hỗ trợ",
      "Phân biệt Absorption vs Distribution",
      "Không kết luận tuyệt đối về hành vi cá voi",
      "Ghi nhận thuế theo FIFO, chỉ cung cấp dữ liệu"
    ],
    outputFormat: "Microstructure Analysis JSON (liquidity zones, whale activity, trap score)",
    interactsWith: ["Quant", "Risk", "WFI", "Treasury"]
  },
  {
    id: 9,
    name: "Phòng Giám sát Cá voi & Dòng tiền",
    shortName: "WFI",
    icon: "🐋",
    color: "from-cyan-500 to-cyan-700",
    role: "Theo dõi LIÊN TỤC ví lớn, order flow, on-chain data",
    usesLLM: true,
    llmType: "Groq (Free)",
    tasks: [
      "Quét lệnh khớp lớn (≥$250K BTC/ETH, ≥$100K altcoin)",
      "Theo dõi CVD (Cumulative Volume Delta)",
      "Phân tích Orderbook Imbalance",
      "Theo dõi Exchange Inflow/Outflow",
      "Giám sát ví cá mập (top 500)",
      "Theo dõi ETF net flow, MicroStrategy/Tesla holdings"
    ],
    rules: [
      "Không suy diễn một chiều (Inflow ≠ sắp bán)",
      "Phân biệt Absorption vs Distribution",
      "Chống trùng lặp: mỗi sự kiện có event_id duy nhất",
      "Mọi output có timestamp + staleness_seconds",
      "Dữ liệu on-chain trễ >10 phút → hạ confidence"
    ],
    outputFormat: "Flow Intelligence JSON (flow signals, whale events, smart money bias)",
    interactsWith: ["CMM", "Risk", "Data"]
  },
  {
    id: 10,
    name: "Phòng Kế toán & Dòng tiền",
    shortName: "Treasury",
    icon: "🧾",
    color: "from-amber-500 to-amber-700",
    role: "Sổ cái kép (double-entry), đối soát, nguồn sự thật duy nhất về tiền",
    usesLLM: false,
    llmType: "Không dùng LLM (Python thuần)",
    tasks: [
      "Giữ sổ cái kép cho toàn bộ công ty",
      "Phân biệt 5 khái niệm: Realized PnL, Unrealized PnL, Equity, Available Balance, Cash Flow",
      "Ghi 6 bản ghi cho mỗi giao dịch (Intent, Fill, Fee, Funding, Slippage, Close)",
      "Đối soát số dư nội bộ vs sàn mỗi 5 phút",
      "Khóa sổ cuối ngày (daily close)",
      "Ghi nhận tax lots theo FIFO"
    ],
    rules: [
      "Nếu lệch > 0.5% NAV hoặc > $0.01 → KÍCH HOẠT KILL SWITCH",
      "Không bao giờ 'sửa sổ cho khớp' - phải tìm nguyên nhân",
      "Unrealized PnL KHÔNG phải tiền mặt",
      "PnL trên biểu đồ là ý kiến, số dư trong ví là sự thật"
    ],
    outputFormat: "Ledger Report JSON (cash balance, NAV, realized PnL, reconciliation status)",
    interactsWith: ["Execution", "CFO", "BI", "CMM"]
  },
  {
    id: 11,
    name: "Phòng Kiểm soát Chi phí AI",
    shortName: "ACC",
    icon: "🤖",
    color: "from-pink-500 to-pink-700",
    role: "Theo dõi token burn, dự báo chi phí AI, tối ưu sử dụng LLM",
    usesLLM: true,
    llmType: "Gemini Flash (Free)",
    tasks: [
      "Theo dõi token burn của TỪNG phòng ban, TỪNG lệnh",
      "Dự báo chi phí AI hàng tháng",
      "Cảnh báo nếu chi phí AI > lợi nhuận kỳ vọng",
      "Đề xuất phân bổ LLM (xịn vs rẻ)",
      "Gửi báo cáo token burn hàng ngày qua Telegram"
    ],
    rules: [
      "80% tác vụ dùng Groq/Gemini Free",
      "Chỉ Risk + CMM dùng Claude (đắt nhưng cần thiết)",
      "Cache aggressively: cùng tin tức chỉ gọi LLM 1 lần",
      "Nếu chi phí AI > 50% lợi nhuận → DỪNG HỆ THỐNG"
    ],
    outputFormat: "Token Burn Report JSON (daily burn, monthly projection, optimization suggestions)",
    interactsWith: ["CFO", "BI", "CEO"]
  }
];

export const constitution = [
  { id: 1, title: "BẢO TOÀN VỐN LÀ TRÊN HẾT", content: "Nhiệm vụ chính không phải là kiếm tiền, mà là KHÔNG ĐƯỢC PHÉP MẤT TIỀN OAN DO LỖI HỆ THỐNG HOẶC THIẾU SUY NGHĨ." },
  { id: 2, title: "KHÔNG CÓ CHUYỆN CẢM TÍNH", content: "Mọi quyết định phải dựa trên dữ liệu (Data), logic (Reasoning) và xác suất (Probability)." },
  { id: 3, title: "TÔN TRỌNG PHÍ GIAO DỊCH", content: "Một lệnh thắng nhưng không bù đắp được phí sàn và phí API là một lệnh THẤT BẠI." },
  { id: 4, title: "LUÔN NGHI NGỜ SỰ HOÀN HẢO", content: "Nếu một tín hiệu giao dịch trông quá đẹp, quá rõ ràng, 90% đó là cái bẫy (Trap) dành cho retail." },
  { id: 5, title: "MINH BẠCH THUẾ VÀ KẾ TOÁN", content: "Mọi giao dịch đều phải được ghi log đầy đủ. Chúng ta là một công ty chuyên nghiệp, không phải sòng bạc." }
];

export const workflow = {
  phaseA: {
    name: "Giai đoạn A: Thu thập dữ liệu",
    color: "green",
    description: "Chạy liên tục 24/7",
    steps: [
      "Data Agent → Kéo giá, volume, funding, OI",
      "WFI Agent → Quét cá voi, order flow, on-chain",
      "Macro Agent → Đọc tin tức, chiến sự, dầu, ETF",
      "Treasury → Đối soát số dư mỗi 5 phút"
    ]
  },
  phaseB: {
    name: "Giai đoạn B: Ra quyết định",
    color: "yellow",
    description: "Khi có tín hiệu giao dịch",
    steps: [
      "Quant Agent → Phân tích kỹ thuật",
      "CMM Agent + WFI → 'Đây có phải bẫy cá mập không?'",
      "Risk Agent → Tính SL/TP, khối lượng, quyền VETO",
      "CFO Agent → 'Lệnh này có tạo Net Profit thật?'",
      "CEO (Bạn) → Phê duyệt qua Telegram"
    ]
  },
  phaseC: {
    name: "Giai đoạn C: Thực thi & Giám sát",
    color: "red",
    description: "Sau khi CEO duyệt",
    steps: [
      "Execution Agent → Gửi lệnh lên sàn, đặt SL cứng",
      "Treasury → Ghi sổ cái, đối soát real-time",
      "BI Agent → Theo dõi PnL, trailing stop",
      "ACC Agent → Ghi nhận token burn cho lệnh này"
    ]
  },
  phaseD: {
    name: "Giai đoạn D: Đánh giá",
    color: "blue",
    description: "Định kỳ (hàng ngày/tuần/tháng)",
    steps: [
      "BI Agent → Chấm điểm từng Agent",
      "CFO Agent → Báo cáo hòa vốn, Net Profit",
      "ACC Agent → Báo cáo token burn",
      "CEO → Quyết định Scale-up hay Shut-down"
    ]
  }
};

export const costBreakdown = {
  mvp: [
    { item: "Server (VPS)", solution: "Oracle Cloud Free Tier (4 CPU ARM, 24GB RAM)", cost: "$0/tháng" },
    { item: "Database", solution: "Supabase Free Tier (PostgreSQL 500MB)", cost: "$0/tháng" },
    { item: "LLM (Bộ não AI)", solution: "Groq + Gemini Free + Claude cho Risk/CMM", cost: "$0-5/tháng" },
    { item: "Dữ liệu Sàn", solution: "CCXT + Binance WebSocket", cost: "$0/tháng" },
    { item: "Dữ liệu Vĩ mô", solution: "yfinance + FRED API", cost: "$0/tháng" },
    { item: "Dữ liệu On-chain", solution: "DefiLlama + Dune + Coinglass Free", cost: "$0/tháng" },
    { item: "Tin tức", solution: "CryptoPanic Free + Telegram Bot", cost: "$0/tháng" },
    { item: "Dashboard/BI", solution: "Metabase Open Source + Grafana Free", cost: "$0/tháng" }
  ],
  tokenBurnPerTrade: {
    totalTokens: 16300,
    costClaude: 0.087,
    costHybrid: 0.027,
    breakdown: [
      { agent: "Data", tokens: 0, cost: 0 },
      { agent: "Quant", tokens: 2500, cost: 0 },
      { agent: "Macro", tokens: 3800, cost: 0 },
      { agent: "Risk", tokens: 1900, cost: 0.0105 },
      { agent: "CMM", tokens: 3100, cost: 0.0165 },
      { agent: "Treasury", tokens: 0, cost: 0 },
      { agent: "CFO", tokens: 1300, cost: 0 },
      { agent: "BI", tokens: 700, cost: 0 },
      { agent: "WFI", tokens: 2500, cost: 0 },
      { agent: "ACC", tokens: 500, cost: 0 }
    ]
  }
};

export const responsibilityMatrix = [
  { question: "Cá voi vừa làm gì?", agent: "WFI" },
  { question: "Đây có phải bẫy không?", agent: "CMM" },
  { question: "Được phép vào bao nhiêu? SL ở đâu?", agent: "Risk" },
  { question: "Lệnh đã khớp chưa, phí bao nhiêu?", agent: "Execution → Treasury" },
  { question: "Hôm nay công ty lãi/lỗ THẬT?", agent: "Treasury" },
  { question: "Bao giờ hòa vốn? Có đáng chạy tiếp?", agent: "CFO" },
  { question: "Agent nào đang tệ? Cần sửa gì?", agent: "BI" },
  { question: "Token burn bao nhiêu? Có đủ ngân sách?", agent: "ACC" },
  { question: "Có được phép chạy tiếp không?", agent: "CEO (Bạn)" }
];
