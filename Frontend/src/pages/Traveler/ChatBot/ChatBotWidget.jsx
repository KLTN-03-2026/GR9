import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
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
  "Voyager AI đang có nhiều yêu cầu cùng lúc nên tạm thời chưa trả lời được. Bạn vui lòng thử lại sau ít phút.";

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
      const key = `${source.type || "source"}-${String(source.title || "").trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
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
    rawMessage.includes('"code":503') ||
    rawMessage.includes("UNAVAILABLE") ||
    rawMessage.includes("high demand") ||
    rawMessage.includes("try again later")
  ) {
    return CHATBOT_BUSY_MESSAGE;
  }

  if (errorCode === "GEMINI_QUOTA_EXCEEDED") {
    return "Voyager AI đang có nhiều yêu cầu cùng lúc nên mình sẽ ưu tiên trả lời bằng dữ liệu có sẵn trong hệ thống. Bạn vui lòng thử lại sau ít phút nếu cần phân tích chi tiết hơn.";
  }

  return (
    error?.response?.data?.message ||
    "Hiện tại tôi chưa thể lấy thông tin từ hệ thống. Bạn vui lòng thử lại sau ít phút."
  );
};

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

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  };

  useEffect(() => {
    window.localStorage.setItem(
      memoryKey,
      JSON.stringify(messages.slice(-memoryWindowSize)),
    );
  }, [memoryKey, memoryWindowSize, messages]);

  useEffect(() => {
    if (open && !minimized) {
      scrollToBottom();
    }
  }, [messages, loading, open, minimized]);

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
      "Đăng nhập để Voyager AI hỗ trợ sâu hơn với tour, booking, lịch sử đặt tour và gợi ý cá nhân hóa.",
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
      scrollToBottom();
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
          window.setTimeout(scrollToBottom, 80);
        }}
        className="fixed bottom-6 right-6 z-[80] h-16 w-16 rounded-full bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 p-0 text-white shadow-[0_22px_55px_rgba(13,148,136,0.38)] transition duration-300 hover:scale-105 hover:shadow-[0_26px_70px_rgba(13,148,136,0.48)]"
        aria-label="Open Voyager AI chat"
      >
        <span className="absolute inset-0 rounded-full bg-teal-400/40 [animation:chatPulse_2.2s_ease-out_infinite]" />
        <MessageCircle className="relative h-7 w-7" />
      </Button>
    );
  }

  return (
    <>
      <style>{`
        @keyframes chatEnter {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0% { transform: scale(1); opacity: 0.55; }
          80%, 100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={cn(
          "fixed bottom-5 right-3 z-[80] flex h-[min(760px,calc(100dvh-2.5rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-900/10 bg-white/95 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-2xl [animation:chatEnter_220ms_ease-out] md:bottom-6 md:right-6 md:h-[min(760px,calc(100dvh-3rem))] md:w-[440px]",
          minimized && "h-auto w-auto md:h-auto md:w-auto",
        )}
      >
        <div className="relative shrink-0 overflow-hidden border-b border-teal-900/20 bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-800 px-4 py-4 text-white">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-300/45 to-transparent" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                <span className="absolute h-3 w-3 rounded-full bg-emerald-300 blur-[6px]" />
                <Bot className="relative h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="brand-font truncate text-sm font-bold">
                    Voyager AI
                  </h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                </div>
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-teal-100/85">
                  {guestMode
                    ? `${Math.max(guestLimit - guestQuestionCount, 0)} lượt hỏi miễn phí`
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
                className="h-8 w-8 rounded-xl text-white/80 hover:bg-white/12 hover:text-white"
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
                className="h-8 w-8 rounded-xl text-white/80 hover:bg-white/12 hover:text-white"
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
                className="h-8 w-8 rounded-xl text-white/80 hover:bg-white/12 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {!minimized ? (
          <>
            <div className="max-h-[min(500px,calc(100vh-220px))] space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.10),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex [animation:messageIn_180ms_ease-out]",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ring-1",
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-teal-600 to-emerald-600 text-white ring-teal-500/20"
                        : "rounded-bl-md bg-white text-slate-700 ring-slate-200/80",
                    )}
                  >
                    {message.label ? (
                      <div className="mb-2 flex items-center gap-2 text-teal-600">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {message.label}
                        </span>
                      </div>
                    ) : null}
                    <MarkdownMessage
                      content={message.content}
                      isUser={message.role === "user"}
                    />
                    {getDisplaySources(message.sources).length ? (
                      <div className="mt-3 space-y-1 border-t border-slate-200/70 pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Nguồn dữ liệu
                        </p>
                        {getDisplaySources(message.sources).map((source) => (
                          <p
                            key={source.id}
                            className="truncate text-xs text-slate-500"
                          >
                            {source.title}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-teal-100 bg-white/90 px-3 py-2 text-left text-xs font-semibold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={
                      loading || (guestMode && guestQuestionCount >= guestLimit)
                    }
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-teal-700 shadow-sm ring-1 ring-slate-200/80 [animation:messageIn_180ms_ease-out]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-300" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.3s]" />
                  </span>
                  Voyager AI đang chuẩn bị câu trả lời...
                </div>
              ) : null}

              <div ref={scrollRef} />
            </div>

            <div className="shrink-0 border-t border-slate-200/80 bg-white/85 p-4">
              {guestMode && guestQuestionCount >= guestLimit ? (
                <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-800">
                  Bạn đã hết lượt hỏi miễn phí. Đăng nhập để tiếp tục dùng Voyager AI đầy đủ.
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = loginPath;
                    }}
                    className="ml-1 font-black text-teal-700 underline underline-offset-2"
                  >
                    Đăng nhập
                  </button>
                </div>
              ) : null}
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" />
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-14 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  placeholder={
                    guestMode && guestQuestionCount >= guestLimit
                      ? "Đăng nhập để hỏi tiếp..."
                      : "Hỏi Voyager AI..."
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
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl bg-teal-600 text-white shadow-sm transition hover:scale-105 hover:bg-teal-700 disabled:hover:scale-100"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 text-center text-[10px] font-medium text-slate-500">
                Powered by Voyager AI
              </p>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
