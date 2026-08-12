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
  "متى تقدرون تتواصلون معي؟",
];

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
    if (pathname.startsWith("/admin")) return;
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
    const ms = open ? 1000 : 2500;
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

  if (pathname.startsWith("/admin")) return null;

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
          className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-2.5 pl-3 pr-4 text-white shadow-lg animate-pulse sm:bottom-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.2 1.4Z" />
            </svg>
          </span>
          <span className="text-sm font-extrabold">محادثة مباشرة</span>
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-20 left-3 right-3 z-50 flex h-[min(460px,68vh)] w-auto flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#efeae2] shadow-2xl sm:bottom-4 sm:left-4 sm:right-auto sm:h-[min(520px,72vh)] sm:w-[min(380px,calc(100vw-2rem))]"
          dir="rtl"
        >
          <div className="flex items-center justify-between bg-[#075E54] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">{BRAND.nameAr} · دعم مباشر</p>
              <p className="text-[11px] text-white/75">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#25D366] align-middle" />{" "}
                متصل الآن — نرد خلال دقائق
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

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <div className="rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-700 shadow-sm">
                  مرحباً بك في {BRAND.nameAr} 👋
                  <br />
                  اكتب سؤالك عن نقل العفش أو اختر رسالة جاهزة:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={sending}
                      className="rounded-full border border-[#075E54]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#075E54] shadow-sm hover:bg-[#dcf8c6] disabled:opacity-50"
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
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                    m.from === "visitor"
                      ? "rounded-bl-sm bg-[#dcf8c6] text-gray-900"
                      : "rounded-br-sm bg-white text-gray-900"
                  }`}
                >
                  {m.from === "admin" ? (
                    <p className="mb-0.5 text-[10px] font-bold text-[#075E54]">
                      فريق {BRAND.nameAr}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <p className="mt-1 text-left text-[10px] text-gray-500">
                    {new Date(m.at).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-black/5 bg-[#f0f2f5] px-2 py-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب رسالتك هنا…"
              className="flex-1 rounded-full border-0 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none ring-0"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white disabled:opacity-50"
              aria-label="إرسال"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
