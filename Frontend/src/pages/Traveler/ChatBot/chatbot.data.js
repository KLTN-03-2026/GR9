export const chatbotProps = {
  memoryKey: "voyager-ai-chat-memory-v1",
  memoryWindowSize: 16,
  promptHistorySize: 10,
  suggestions: [
    "Giới thiệu Voyager AI cho tôi",
    "Travel_AI có những tính năng gì?",
    "Tôi có thể đặt tour và theo dõi tour như thế nào?",
    "Hãy giới thiệu các tour phù hợp cho gia đình",
  ],
  defaultMessages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn, tôi là Voyager AI. Tôi có thể giới thiệu hệ thống Travel_AI, giải thích cách đặt tour, gợi ý lịch trình và hỗ trợ bạn tìm thông tin trong dữ liệu tour.",
      sources: [],
    },
    {
      id: "insight",
      role: "assistant",
      content:
        "Bạn có thể bắt đầu bằng các câu hỏi như: Travel_AI dùng để làm gì, cách đặt tour, điều kiện đánh giá tour, hoặc gợi ý tour theo nhu cầu.",
      label: "Gợi ý bắt đầu",
      sources: [],
    },
  ],
};
