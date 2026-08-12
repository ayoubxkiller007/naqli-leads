"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/config";
import { getVisitorId } from "@/lib/visitor-client";

type Msg = { id: string; from: "visitor" | "admin"; text: string; at: string };

const QUICK_REPLIES = [
  "السلام عليكم، أحتاج عرض نقل عفش",
  "كم يكلف النقل تقريباً؟",
  "عندكم شركات في جدة؟",
];

function hideChatPath(path: string) {
  return path.startsWith("/admin") || path.startsWith("/thank-you");
}

export function LiveChat() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);
  const openedOnce = useRef(false);

  useEffect(() => {
    if (hideChatPath(pathname)) return;
    const id = getVisitorId();
    let stopped = false;

    const pull = async () => {
      try {
        const res = await fetch(`/api/chat?visitorId=${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        if (!res.ok || stopped) return;
        const data = await res.json();
        const msgs: Msg[] = data.messages || [];
        setMessages(msgs);
        if (!open && msgs.length > lastCount.current) {
          const newAdmin = msgs
            .slice(lastCount.current)
            .filter((m) => m.from === "admin").length;
          if (newAdmin > 0) setUnread((u) => u + newAdmin);
        }
        lastCount.current = msgs.length;
      } catch {}
    };

    pull();
    const ms = open ? 1500 : 4000;
    const t = window.setInterval(pull, ms);
    return () => {
      stopped = true;
      window.clearInterval(t);
    };
  }, [open, pathname]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      if (!openedOnce.current) {
        openedOnce.current = true;
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: getVisitorId(),
            path: window.location.pathname,
            activity: "فتح الشات المباشر",
          }),
          keepalive: true,
        }).catch(() => {});
      }
    }
  }, [open, messages]);

  if (hideChatPath(pathname)) return null;

  async function sendMessage(body: string) {
    const trimmed = body.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    const optimistic: Msg = {
      id: `tmp_${Date.now()}`,
      from: "visitor",
      text: trimmed,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const id = getVisitorId();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: id,
          text: trimmed,
          path: window.location.pathname,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        lastCount.current = (data.messages || []).length;
      }
    } finally {
      setSending(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function send(e?: FormEvent) {
    e?.preventDefault();
    await sendMessage(text);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="محادثة مباشرة"
          className="fixed bottom-[4.75rem] left-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md md:bottom-6 md:left-4 md:h-14 md:w-auto md:gap-2 md:rounded-full md:py-2.5 md:pl-3 md:pr-4 md:shadow-lg"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current md:h-6 md:w-6">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.2 1.4Z" />
          </svg>
          <span className="hidden text-sm font-extrabold md:inline">
            محادثة مباشرة
          </span>
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold md:h-5 md:min-w-5 md:text-[10px]">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-[4.75rem] left-3 right-3 z-30 flex h-[min(340px,52vh)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#efeae2] shadow-2xl md:bottom-4 md:left-4 md:right-auto md:h-[min(520px,72vh)] md:w-[min(380px,calc(100vw-2rem))]"
          dir="rtl"
        >
          <div className="flex items-center justify-between bg-[#075E54] px-3 py-2.5 text-white md:px-4 md:py-3">
            <div>
              <p className="text-xs font-bold md:text-sm">{BRAND.nameAr}</p>
              <p className="text-[10px] text-white/75 md:text-[11px]">
                نرد خلال دقائق
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-2 py-1 text-lg leading-none hover:bg-white/10"
              aria-label="إغلاق الشات"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-2.5 py-2 md:px-3 md:py-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <div className="rounded-lg bg-white/90 px-3 py-2 text-xs text-gray-700 shadow-sm md:text-sm">
                  مرحباً 👋 اكتب سؤالك أو اختر:
                </div>
                <div className="flex flex-wrap gap-1">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={sending}
                      className="rounded-full border border-[#075E54]/20 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#075E54] md:px-3 md:py-1.5 md:text-xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs shadow-sm md:px-3 md:py-2 md:text-sm ${
                    m.from === "visitor"
                      ? "rounded-bl-sm bg-[#dcf8c6] text-gray-900"
                      : "rounded-br-sm bg-white text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-1.5 border-t border-black/5 bg-[#f0f2f5] px-2 py-1.5 md:gap-2 md:py-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="رسالتك…"
              className="flex-1 rounded-full border-0 bg-white px-3 py-2 text-sm text-gray-900 outline-none md:px-4 md:py-2.5"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white disabled:opacity-50 md:h-10 md:w-10"
              aria-label="إرسال"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current md:h-5 md:w-5">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
