import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  MapPin,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askChatbot } from "@/services/api/chatbot";
import MarkdownMessage from "./MarkdownMessage";

const loadChatMemory = (memoryKey, defaultMessages) => {
  try {
    const savedMessages = JSON.parse(window.localStorage.getItem(memoryKey));

    if (Array.isArray(savedMessages) && savedMessages.length > 0) {
      return savedMessages;
    }
  } catch {
    window.localStorage.removeItem(memoryKey);
  }

  return defaultMessages;
};

const buildPromptHistory = (messages, promptHistorySize) =>
  messages
    .filter((message) => ["user", "assistant"].includes(message.role))
    .slice(-promptHistorySize)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

const CHATBOT_BUSY_MESSAGE =
  "SmartTravel AI đang có nhiều yêu cầu cùng lúc nên tạm thời chưa trả lời được. Bạn vui lòng thử lại sau ít phút.";

const isReadableSourceTitle = (title) => {
  const text = String(title || "").trim();
  if (text.length < 4) return false;
  if (/^(bl+a|bla+bla+|adawd|awd|test|demo|sample)$/i.test(text)) return false;
  if (!/[\p{L}\p{N}]/u.test(text)) return false;
  return true;
};

const getDisplaySources = (sources = []) => {
  const seen = new Set();

  return sources
    .filter((source) => isReadableSourceTitle(source?.title))
    .filter((source) => {
      const key = `${source.type || "source"}-${String(source.title || "")
        .trim()
        .toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);
};

const formatPrice = (value) => {
  const amount = Number(value || 0);
  if (amount <= 0) return "Liên hệ";
  return `${amount.toLocaleString("vi-VN")} đ`;
};

const isTourSource = (source) => source?.type === "database_tour";

const shouldShowTourCards = (content = "", sources = []) => {
  const text = String(content || "").toLowerCase();
  if (!sources.some(isTourSource)) return false;

  return /tour|gợi ý|goi y|chi tiết|chi tiet|link|xem|giá|gia|địa điểm|dia diem|rating|đánh giá|danh gia/.test(
    text,
  );
};

const getChatbotErrorMessage = (error) => {
  const status = error?.response?.status;
  const errorCode = error?.response?.data?.errorCode;
  const rawMessage = String(
    error?.response?.data?.message || error?.message || "",
  );

  if (
    status === 503 ||
    errorCode === "GEMINI_HIGH_DEMAND" ||
    errorCode === "AI_HIGH_DEMAND" ||
    rawMessage.includes('"code":503') ||
    rawMessage.includes("UNAVAILABLE") ||
    rawMessage.includes("high demand") ||
    rawMessage.includes("try again later")
  ) {
    return CHATBOT_BUSY_MESSAGE;
  }

  if (errorCode === "GEMINI_QUOTA_EXCEEDED" || errorCode === "AI_QUOTA_EXCEEDED") {
    return "SmartTravel AI đang có nhiều yêu cầu cùng lúc nên mình sẽ ưu tiên trả lời bằng dữ liệu có sẵn trong hệ thống. Bạn vui lòng thử lại sau ít phút nếu cần phân tích chi tiết hơn.";
  }

  if (status >= 500 || errorCode) {
    return "Hệ thống chatbot đang gặp lỗi tạm thời. Bạn vui lòng thử lại sau ít phút.";
  }

  return "Hiện tại tôi chưa thể lấy thông tin từ hệ thống. Bạn vui lòng thử lại sau ít phút.";
};

function TourSourceCard({ source }) {
  return (
    <a
      href={source.tourPath || "#"}
      className="group grid grid-cols-[88px_minmax(0,1fr)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-surface-container"
    >
      <div className="h-full min-h-[118px] overflow-hidden bg-slate-100 dark:bg-slate-900">
        {source.imageUrl ? (
          <img
            alt={source.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={source.imageUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-500/15 to-cyan-500/10 text-teal-600 dark:text-primary">
            <MessageCircle className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-2 p-3">
        <div className="space-y-1">
          <h4 className="line-clamp-2 text-[13px] font-extrabold leading-5 text-slate-900 dark:text-on-surface">
            {source.title}
          </h4>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-on-surface-variant">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{source.location || "Chưa có địa điểm"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-on-surface-variant">
          <span className="rounded-full bg-teal-50 px-2 py-1 text-teal-700 dark:bg-primary/10 dark:text-primary">
            {formatPrice(source.priceAdult)}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">
            {source.numberOfDay || "-"} ngày
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {source.averageRating > 0 ? source.averageRating : "Mới"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[11px] text-slate-500 dark:text-on-surface-variant">
            {source.reviewCount || 0} đánh giá
          </p>
          <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-teal-600 px-3 text-[11px] font-bold text-white shadow-sm shadow-teal-900/10 transition group-hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:shadow-teal-950/30 dark:group-hover:bg-teal-400">
            Vào tour
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ChatBotWidget({
  memoryKey,
  memoryWindowSize,
  promptHistorySize,
  suggestions,
  defaultMessages,
  guestMode = false,
  guestLimit = 3,
  guestCountKey = "voyager-ai-guest-chat-count-v1",
  loginPath = "/login",
}) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestQuestionCount, setGuestQuestionCount] = useState(() => {
    if (!guestMode) return 0;
    const savedCount = Number(window.localStorage.getItem(guestCountKey) || 0);
    return Number.isFinite(savedCount) ? savedCount : 0;
  });
  const [messages, setMessages] = useState(() =>
    loadChatMemory(memoryKey, defaultMessages),
  );
  const scrollRef = useRef(null);
  const latestAssistantRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const pendingAssistantScrollRef = useRef(false);

  const scrollToBottom = (behavior = "smooth") => {
    window.requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
  };

  const scrollToLatestAssistant = () => {
    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        latestAssistantRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }, 80);
  };

  useEffect(() => {
    window.localStorage.setItem(
      memoryKey,
      JSON.stringify(messages.slice(-memoryWindowSize)),
    );
  }, [memoryKey, memoryWindowSize, messages]);

  useEffect(() => {
    if (!open || minimized) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessageIdRef.current === lastMessage.id) return;

    lastMessageIdRef.current = lastMessage.id;

    if (lastMessage.role === "assistant") {
      pendingAssistantScrollRef.current = true;
      if (!loading) {
        pendingAssistantScrollRef.current = false;
        scrollToLatestAssistant();
      }
      return;
    }

    scrollToBottom();
  }, [messages, loading, open, minimized]);

  useEffect(() => {
    if (!open || minimized || loading || !pendingAssistantScrollRef.current) return;

    pendingAssistantScrollRef.current = false;
    scrollToLatestAssistant();
  }, [loading, open, minimized]);

  const clearMemory = () => {
    window.localStorage.removeItem(memoryKey);
    setMessages(defaultMessages);
  };

  const saveGuestQuestionCount = (count) => {
    setGuestQuestionCount(count);
    window.localStorage.setItem(guestCountKey, String(count));
  };

  const buildGuestLimitMessage = () =>
    [
      `Bạn đã dùng hết **${guestLimit} lượt hỏi miễn phí** trên landing page.`,
      "",
      "Đăng nhập để SmartTravel AI hỗ trợ sâu hơn với tour, booking, lịch sử đặt tour và gợi ý cá nhân hóa.",
      "",
      `[Đăng nhập để tiếp tục](${loginPath})`,
    ].join("\n");

  const sendMessage = async (message = input) => {
    const content = String(message || "").trim();
    if (!content || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      sources: [],
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    if (guestMode && guestQuestionCount >= guestLimit) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-login-required-${Date.now()}`,
          role: "assistant",
          content: buildGuestLimitMessage(),
          sources: [],
        },
      ]);
      return;
    }

    if (guestMode) {
      saveGuestQuestionCount(guestQuestionCount + 1);
    }

    const history = buildPromptHistory(messages, promptHistorySize);
    setLoading(true);
    scrollToBottom();

    try {
      const response = await askChatbot(content, history);
      const data = response.data.data;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data?.answer || "Hiện tại tôi chưa tìm được câu trả lời.",
          sources: data?.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: getChatbotErrorMessage(error),
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        type="button"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
          window.setTimeout(() => scrollToBottom("auto"), 80);
        }}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 p-0 text-white shadow-[0_14px_32px_rgba(20,184,166,0.28)] transition duration-200 hover:bg-teal-600 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-fixed-dim"
        aria-label="Open SmartTravel chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  const remainingGuestQuestions = Math.max(guestLimit - guestQuestionCount, 0);

  return (
    <>
      <style>{`
        @keyframes chatEnter {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={cn(
          "fixed bottom-5 right-3 z-[80] flex h-[min(760px,calc(100dvh-2.5rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92 shadow-[0_28px_90px_rgba(15,23,42,0.24)] ring-1 ring-white/80 backdrop-blur-2xl [animation:chatEnter_220ms_ease-out] dark:border-white/10 dark:bg-surface-container-lowest/92 dark:shadow-[0_30px_100px_rgba(0,0,0,0.48)] dark:ring-white/5 md:bottom-6 md:right-6 md:h-[min(760px,calc(100dvh-3rem))] md:w-[452px]",
          minimized && "h-auto w-auto md:h-auto md:w-auto",
        )}
      >
        <div className="relative shrink-0 overflow-hidden border-b border-white/15 bg-[linear-gradient(135deg,#071314_0%,#073b3a_46%,#0f766e_100%)] px-4 py-4 text-white dark:border-white/10 dark:bg-[linear-gradient(135deg,#0b1112_0%,#102224_52%,#00685f_100%)]">
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/25">
                <Bot className="relative h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="brand-font truncate text-[15px] font-black tracking-tight">
                    SmartTravel AI
                  </h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                </div>
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-teal-100/85">
                  {guestMode
                    ? `${remainingGuestQuestions} lượt hỏi miễn phí`
                    : "Trợ lý du lịch"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearMemory}
                className="h-8 w-8 rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Clear chat memory"
                title="Xóa lịch sử chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMinimized((current) => !current)}
                className="h-8 w-8 rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
              >
                {minimized ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {!minimized ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(107,216,203,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.10),transparent_30%),linear-gradient(180deg,#101416_0%,#161a1c_100%)]">
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const sources = getDisplaySources(message.sources);
                const showTourCards = shouldShowTourCards(message.content, sources);
                const tourSources = showTourCards
                  ? sources.filter(isTourSource).slice(0, 2)
                  : [];
                const textSources = sources.filter((source) => !isTourSource(source));

                return (
                  <div
                    key={message.id}
                    ref={
                      !isUser && index === messages.length - 1
                        ? latestAssistantRef
                        : null
                    }
                    className={cn(
                      "flex items-end gap-2 [animation:messageIn_180ms_ease-out]",
                      !isUser && "scroll-mt-4",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    {!isUser ? (
                      <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/18 ring-2 ring-white dark:ring-surface-container">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[92%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ring-1 md:max-w-[86%]",
                        isUser
                          ? "rounded-br-md bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-[0_14px_32px_rgba(13,148,136,0.24)] ring-teal-500/20"
                          : "rounded-bl-md bg-white/95 text-slate-700 shadow-[0_12px_34px_rgba(15,23,42,0.08)] ring-slate-200/80 dark:bg-surface-container/88 dark:text-on-surface dark:ring-white/10",
                      )}
                    >
                      {message.label ? (
                        <div className="mb-2 flex items-center gap-2 text-teal-600 dark:text-primary">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {message.label}
                          </span>
                        </div>
                      ) : null}

                      <MarkdownMessage content={message.content} isUser={isUser} />

                      {tourSources.length ? (
                        <div className="mt-4 space-y-3 border-t border-slate-200/70 pt-4 dark:border-white/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-on-surface-variant">
                            Tour gợi ý
                          </p>
                          <div className="grid gap-3">
                            {tourSources.map((source) => (
                              <TourSourceCard key={source.id} source={source} />
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {textSources.length ? (
                        <div className="mt-3 space-y-1 border-t border-slate-200/70 pt-3 dark:border-white/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-on-surface-variant">
                            Nguồn dữ liệu
                          </p>
                          {textSources.map((source) => (
                            <p
                              key={source.id}
                              className="truncate text-xs text-slate-500 dark:text-on-surface-variant"
                            >
                              {source.title}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap gap-2 rounded-[24px] border border-slate-200/70 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-teal-100 bg-white/90 px-3 py-2 text-left text-xs font-semibold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-surface-container dark:text-on-surface-variant dark:hover:border-primary/45 dark:hover:bg-primary/10 dark:hover:text-primary"
                    disabled={
                      loading || (guestMode && guestQuestionCount >= guestLimit)
                    }
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-xs font-bold uppercase tracking-wider text-teal-700 shadow-sm ring-1 ring-slate-200/80 [animation:messageIn_180ms_ease-out] dark:bg-surface-container dark:text-primary dark:ring-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-300" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.3s]" />
                  </span>
                  SmartTravel AI đang chuẩn bị câu trả lời...
                </div>
              ) : null}

              <div ref={scrollRef} />
            </div>

            <div className="shrink-0 border-t border-slate-200/80 bg-white/88 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-surface-container-lowest/92">
              {guestMode && guestQuestionCount >= guestLimit ? (
                <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-800 dark:border-amber-300/25 dark:bg-amber-400/10 dark:text-amber-100">
                  Bạn đã hết lượt hỏi miễn phí. Đăng nhập để tiếp tục dùng
                  SmartTravel AI đầy đủ.
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = loginPath;
                    }}
                    className="ml-1 font-black text-teal-700 underline underline-offset-2 dark:text-primary"
                  >
                    Đăng nhập
                  </button>
                </div>
              ) : null}

              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600 dark:text-primary" />
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-14 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-surface-container dark:text-on-surface dark:placeholder:text-on-surface-variant dark:focus:border-primary dark:focus:bg-surface-container-high dark:focus:ring-primary/15"
                  placeholder={
                    guestMode && guestQuestionCount >= guestLimit
                      ? "Đăng nhập để hỏi tiếp..."
                      : "Hỏi SmartTravel AI..."
                  }
                  type="text"
                  disabled={guestMode && guestQuestionCount >= guestLimit}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => sendMessage()}
                  disabled={
                    loading ||
                    !input.trim() ||
                    (guestMode && guestQuestionCount >= guestLimit)
                  }
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl bg-teal-600 text-white shadow-sm transition hover:scale-105 hover:bg-teal-700 disabled:hover:scale-100 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-fixed-dim"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <p className="mt-3 text-center text-[10px] font-medium text-slate-500 dark:text-on-surface-variant">
                Powered by SmartTravel
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
