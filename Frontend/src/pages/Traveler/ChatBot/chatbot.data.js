export const chatbotProps = {
  memoryKey: "voyager-ai-chat-memory-v1",
  memoryWindowSize: 16,
  promptHistorySize: 10,
  suggestions: [
    "Gi?i thi?u Voyager AI cho t?i",
    "Travel_AI c? nh?ng t?nh n?ng g??",
    "T?i c? th? ??t tour v? theo d?i tour nh? th? n?o?",
    "H?y gi?i thi?u c?c tour ph? h?p cho gia ??nh",
  ],
  defaultMessages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ch?o b?n, t?i l? Voyager AI. T?i c? th? gi?i thi?u h? th?ng Travel_AI, gi?i th?ch c?ch ??t tour, g?i ? l?ch tr?nh v? h? tr? b?n t?m th?ng tin trong d? li?u tour.",
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
  memoryKey: "voyager-ai-landing-chat-memory-v1",
  guestMode: true,
  guestLimit: 3,
  guestCountKey: "voyager-ai-landing-guest-count-v1",
  loginPath: "/login",
  defaultMessages: [
    {
      id: "landing-welcome",
      role: "assistant",
      content:
        "Ch?o b?n, t?i l? Voyager AI. B?n c? **3 l??t h?i mi?n ph?** ?? t?m hi?u nhanh v? Travel_AI, tour, booking v? c?c t?nh n?ng ch?nh.",
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
