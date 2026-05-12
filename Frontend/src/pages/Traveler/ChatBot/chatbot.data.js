export const chatbotProps = {
  memoryKey: "voyager-ai-chat-memory-v2",
  memoryWindowSize: 16,
  promptHistorySize: 10,
  suggestions: [
    "Giới thiệu SmartTravel cho tôi",
    "Travel_AI có những tính năng gì?",
    "Tôi có thể đặt tour và theo dõi tour như thế nào?",
    "Hãy giới thiệu các tour phù hợp cho gia đình",
  ],
  defaultMessages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn, tôi là SmartTravel AI. Tôi có thể giới thiệu hệ thống Travel_AI, giải thích cách đặt tour, gợi ý lịch trình và hỗ trợ bạn tìm thông tin trong dữ liệu tour.",
      sources: [],
    },
    {
      id: "insight",
      role: "assistant",
      content:
        "B?n c? th? b?t ??u b?ng c?c c?u h?i nh?: Travel_AI d?ng ?? l?m g?, c?ch ??t tour, ?i?u ki?n ??nh gi? tour, ho?c g?i ? tour theo nhu c?u.",
      label: "G?i ? b?t ??u",
      sources: [],
    },
  ],
};

export const landingChatbotProps = {
  ...chatbotProps,
  memoryKey: "voyager-ai-landing-chat-memory-v2",
  guestMode: true,
  guestLimit: 3,
  guestCountKey: "voyager-ai-landing-guest-count-v1",
  loginPath: "/login",
  defaultMessages: [
    {
      id: "landing-welcome",
      role: "assistant",
      content:
        "Chào bạn, tôi là SmartTravel AI. Bạn có **3 lượt hỏi miễn phí** để tìm hiểu nhanh về Travel_AI, tour, booking và các tính năng chính.",
      sources: [],
    },
    {
      id: "landing-insight",
      role: "assistant",
      content:
        "N?u mu?n h?i s?u h?n theo l?ch s? ??t tour, tracking ho?c g?i ? c? nh?n h?a, b?n c?n ??ng nh?p t?i kho?n traveler.",
      label: "D?nh cho kh?ch",
      sources: [],
    },
  ],
};
