import { useState } from "react";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askChatbot } from "@/services/api/chatbot";

const suggestions = [
  "Giới thiệu Voyager AI cho tôi",
  "Travel_AI có những tính năng gì?",
  "Tôi có thể đặt tour và theo dõi tour như thế nào?",
  "Hãy giới thiệu các tour phù hợp cho gia đình",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
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
        "Bạn có thể bắt đầu bằng các câu hỏi giới thiệu như: Travel_AI dùng để làm gì, cách đặt tour, điều kiện đánh giá tour, hoặc gợi ý tour theo nhu cầu.",
      label: "Gợi ý bắt đầu",
      sources: [],
    },
  ]);

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
    setLoading(true);

    try {
      const response = await askChatbot(content);
      const data = response.data.data;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data?.answer || "I could not find an answer right now.",
          sources: data?.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            error?.response?.data?.message ||
            "I cannot reach the knowledge base right now.",
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
        }}
        className="fixed bottom-6 right-6 z-[80] h-14 w-14 rounded-full bg-teal-600 p-0 text-white shadow-[0_18px_40px_rgba(15,118,110,0.35)] hover:bg-teal-700"
        aria-label="Open Voyager AI chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-4 z-[80] w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/50 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl md:right-6 md:w-[420px]",
        minimized && "w-auto md:w-auto",
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="brand-font text-sm font-bold text-on-surface">
              Voyager AI
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Digital Concierge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMinimized((current) => !current)}
            className="h-8 w-8 rounded-lg"
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
            className="h-8 w-8 rounded-lg"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!minimized ? (
        <>
          <div className="max-h-[420px] space-y-5 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[88%] rounded-2xl p-4 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto rounded-tr-none bg-teal-600 text-white"
                    : "rounded-tl-none bg-surface-container-low text-on-surface",
                )}
              >
                {message.label ? (
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {message.label}
                    </span>
                  </div>
                ) : null}
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.sources?.length ? (
                  <div className="mt-3 space-y-1 border-t border-outline-variant/20 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Sources
                    </p>
                    {message.sources.slice(0, 3).map((source) => (
                      <p
                        key={source.id}
                        className="truncate text-xs text-on-surface-variant"
                      >
                        {source.title}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-outline-variant/30 bg-white px-3 py-2 text-left text-xs font-semibold text-on-surface-variant transition hover:border-primary/50 hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                Voyager AI đang tìm trong KB...
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200/80 bg-white/70 p-4">
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                className="h-12 w-full rounded-xl border border-outline-variant/30 bg-white pl-11 pr-14 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                placeholder="Hỏi Voyager AI..."
                type="text"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg bg-teal-600 hover:bg-teal-700"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-center text-[10px] font-medium text-on-surface-variant/70">
              Powered by Voyager AI
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
