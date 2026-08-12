"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  moveType: string;
  fromArea?: string;
  toArea?: string;
  notes?: string;
  ip?: string;
  status: "new" | "sent" | "sold" | "spam";
  flag?: string;
};

type Visitor = {
  id: string;
  ip: string;
  country: string;
  city?: string;
  path: string;
  lastSeen: string;
  referrer?: string;
  stage: string;
  stageLabel?: string;
  flag: string;
  online: boolean;
  secondsAgo: number;
  inForm?: boolean;
  formFilled?: number;
  formTotal?: number;
  formLabels?: string[];
  submittedLead?: boolean;
  formDraft?: {
    name?: string;
    phone?: string;
    city?: string;
    moveType?: string;
    fromArea?: string;
    toArea?: string;
    notes?: string;
  };
  activity?: string[];
};

type ChatMsg = {
  id: string;
  from: "visitor" | "admin";
  text: string;
  at: string;
};

type ChatThread = {
  visitorId: string;
  messages: ChatMsg[];
  updatedAt: string;
  unreadAdmin: number;
  lastMessage: ChatMsg | null;
  visitor: {
    id: string;
    ip: string;
    country?: string;
    city?: string;
    flag: string;
    online: boolean;
    path: string;
    name?: string;
    phone?: string;
    stage?: string;
    stageLabel?: string;
    inForm?: boolean;
    formFilled?: number;
    formTotal?: number;
    formLabels?: string[];
    submittedLead?: boolean;
  };
};

type Payload = {
  stats: {
    live: number;
    visitors: number;
    newLeads: number;
    todayLeads: number;
    totalLeads: number;
    chats: number;
    inForm: number;
  };
  live: Visitor[];
  visitors: Visitor[];
  leads: Lead[];
  chats: ChatThread[];
};

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - +new Date(iso)) / 1000));
  if (s < 60) return `${s}ث`;
  if (s < 3600) return `${Math.floor(s / 60)}د`;
  return `${Math.floor(s / 3600)}س`;
}

const STAGE_COLORS: Record<string, string> = {
  browsing: "bg-white/10 text-white/60",
  viewing_form: "bg-amber-500/20 text-amber-200",
  filling_form: "bg-orange-500/25 text-orange-200",
  submitted: "bg-teal-500/25 text-teal-200",
  thank_you: "bg-emerald-500/25 text-emerald-200",
};

function playChatPing() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.value = 0.1;
    o.start();
    o.stop(ctx.currentTime + 0.15);
  } catch {}
}

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [tab, setTab] = useState<"live" | "chat" | "leads" | "visitors">("live");
  const [flash, setFlash] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const knownLeads = useRef<Set<string>>(new Set());
  const knownChatUnread = useRef(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const primed = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/live", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!res.ok) return;
    const json = (await res.json()) as Payload;
    if (primed.current) {
      for (const l of json.leads) {
        if (l.status === "new" && !knownLeads.current.has(l.id)) {
          setFlash(`لياد جديد · ${l.name} · ${l.city} · ${l.phone}`);
          window.setTimeout(() => setFlash(null), 6000);
          break;
        }
      }
      const unreadTotal = json.chats.reduce((n, c) => n + (c.unreadAdmin || 0), 0);
      if (unreadTotal > knownChatUnread.current) {
        playChatPing();
        const newest = json.chats.find((c) => c.unreadAdmin > 0);
        const who =
          newest?.visitor.name ||
          newest?.visitor.city ||
          newest?.visitor.ip ||
          "زائر";
        setFlash(`💬 رسالة شات · ${who}: ${newest?.lastMessage?.text?.slice(0, 50) || ""}`);
        window.setTimeout(() => setFlash(null), 7000);
        if (tab !== "chat" && newest) {
          setActiveChat(newest.visitorId);
          setChatMessages(newest.messages || []);
        }
      }
      knownChatUnread.current = unreadTotal;
    }
    knownLeads.current = new Set(json.leads.map((l) => l.id));
    primed.current = true;
    setData(json);
  }, [router, tab]);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 1500);
    return () => window.clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (tab === "chat" && !activeChat && data?.chats?.length) {
      const unread = data.chats.find((c) => c.unreadAdmin > 0);
      const pick = unread || data.chats[0];
      setActiveChat(pick.visitorId);
      setChatMessages(pick.messages || []);
    }
  }, [tab, data?.chats, activeChat]);

  useEffect(() => {
    if (tab !== "chat" || !activeChat) return;
    let stopped = false;
    const pull = async () => {
      try {
        const res = await fetch(
          `/api/admin/chat?visitorId=${encodeURIComponent(activeChat)}&markRead=1`,
          { cache: "no-store" }
        );
        if (!res.ok || stopped) return;
        const json = await res.json();
        setChatMessages(json.messages || []);
      } catch {}
    };
    pull();
    const t = window.setInterval(pull, 1000);
    return () => {
      stopped = true;
      window.clearInterval(t);
    };
  }, [tab, activeChat]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeChat]);

  async function sendReply(e?: FormEvent) {
    e?.preventDefault();
    if (!activeChat || !reply.trim() || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");
    const optimistic: ChatMsg = {
      id: `tmp_${Date.now()}`,
      from: "admin",
      text,
      at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, optimistic]);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: activeChat, text }),
      });
      if (res.ok) {
        const json = await res.json();
        setChatMessages(json.messages || []);
        load();
      }
    } finally {
      setSending(false);
    }
  }

  function openChat(visitorId: string, messages: ChatMsg[] = []) {
    setTab("chat");
    setActiveChat(visitorId);
    setChatMessages(messages);
  }

  async function setStatus(id: string, status: Lead["status"]) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("حذف؟")) return;
    await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    load();
  }

  async function clearAll() {
    if (!confirm("مسح كل الليادات؟")) return;
    await fetch("/api/admin/leads?all=1", { method: "DELETE" });
    load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#070f0c] text-white" dir="rtl">
      {flash ? (
        <div className="fixed inset-x-0 top-3 z-50 mx-auto max-w-md rounded-xl bg-teal-400 px-4 py-3 text-center text-sm font-extrabold text-[#04201a] shadow-lg">
          لياد جديد · {flash}
        </div>
      ) : null}

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070f0c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-display text-2xl font-black">لوحة نَقْلِي</p>
            <p className="text-[11px] text-white/40">
              لايف · شات · فورم · ليادات
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-300"
            >
              مسح الليادات
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
          {[
            ["لايف الآن", data?.stats.live ?? "—", "text-emerald-300"],
            ["في الفورم", data?.stats.inForm ?? "—", "text-orange-300"],
            ["شات جديد", data?.stats.chats ?? "—", "text-[#25D366]"],
            ["ليادات جديدة", data?.stats.newLeads ?? "—", "text-amber-300"],
            ["اليوم", data?.stats.todayLeads ?? "—", "text-teal-300"],
            ["كل الليادات", data?.stats.totalLeads ?? "—", "text-white"],
          ].map(([l, v, c]) => (
            <div
              key={String(l)}
              className="rounded-xl border border-white/10 bg-[#101a17] px-3 py-3"
            >
              <p className="text-[10px] font-bold text-white/40">{l}</p>
              <p className={`font-display text-2xl font-black sm:text-3xl ${c}`}>
                {v}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["live", `لايف (${data?.stats.live ?? 0})`],
              [
                "chat",
                `شات مباشر${(data?.stats.chats || 0) > 0 ? ` (${data?.stats.chats})` : ""}`,
              ],
              ["leads", `ليادات (${data?.stats.totalLeads ?? 0})`],
              ["visitors", `زوار (${data?.stats.visitors ?? 0})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                tab === id
                  ? "bg-teal-400 text-[#04201a]"
                  : "bg-white/5 text-white/60"
              }`}
            >
              {label}
              {id === "chat" && (data?.stats.chats || 0) > 0 ? (
                <span className="mr-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px]">
                  {data?.stats.chats}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === "live" && (
          <section className="mt-4 space-y-2">
            {!data?.live.length && (
              <p className="rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-white/40">
                ما كاين حتى زائر لايف دابا…
              </p>
            )}
            {data?.live.map((v) => (
              <VisitorRow
                key={v.id}
                v={v}
                live
                onChat={() => {
                  const thread = data?.chats?.find((c) => c.visitorId === v.id);
                  openChat(v.id, thread?.messages || []);
                }}
              />
            ))}
          </section>
        )}

        {tab === "chat" && (
          <section className="mt-4 grid gap-3 lg:grid-cols-[300px_1fr]">
            <div className="max-h-[70vh] space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-[#101a17] p-2">
              {(data?.live?.length ?? 0) > 0 && (
                <>
                  <p className="px-2 pt-1 text-[10px] font-bold text-emerald-300">
                    ● زوار لايف — ابدأ محادثة
                  </p>
                  {data?.live.map((v) => {
                    const hasThread = data?.chats?.some(
                      (c) => c.visitorId === v.id
                    );
                    if (hasThread) return null;
                    return (
                      <button
                        key={`live-${v.id}`}
                        type="button"
                        onClick={() => openChat(v.id)}
                        className="flex w-full items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-right hover:bg-emerald-500/10"
                      >
                        <span className="text-lg">{v.flag}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {v.formDraft?.name || v.city || v.ip}
                          </p>
                          <p className="text-[10px] text-white/40">
                            {v.stageLabel} · {v.path}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-[#25D366]">
                          رد
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
              {!data?.chats?.length && !(data?.live?.length ?? 0) && (
                <p className="px-3 py-8 text-center text-sm text-white/45">
                  ما كاين شات بعد — الزائر يضغط الزر الأخضر باش يبدا.
                </p>
              )}
              {(data?.chats?.length ?? 0) > 0 ? (
                <p className="px-2 pt-2 text-[10px] font-bold text-white/35">
                  المحادثات
                </p>
              ) : null}
              {data?.chats?.map((c) => (
                <button
                  key={c.visitorId}
                  type="button"
                  onClick={() => openChat(c.visitorId, c.messages || [])}
                  className={`flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-right transition ${
                    activeChat === c.visitorId
                      ? "bg-[#075E54]/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl">{c.visitor.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {c.visitor.name || c.visitor.ip}
                      </p>
                      {c.unreadAdmin > 0 && (
                        <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-bold">
                          {c.unreadAdmin}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-white/45">
                      {c.lastMessage?.text || "—"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/30">
                      {c.visitor.online ? "● لايف · " : ""}
                      {c.visitor.stageLabel || c.visitor.stage}
                      {c.visitor.inForm
                        ? ` · فورم ${c.visitor.formFilled}/${c.visitor.formTotal}`
                        : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1614]">
              {!activeChat ? (
                <p className="m-auto text-sm text-white/40">
                  اختر محادثة
                </p>
              ) : (
                <>
                  <div className="border-b border-white/10 bg-[#075E54]/40 px-4 py-3">
                    {(() => {
                      const c = data?.chats?.find(
                        (x) => x.visitorId === activeChat
                      );
                      return (
                        <div>
                          <p className="font-bold">
                            {c?.visitor.flag}{" "}
                            {c?.visitor.name || c?.visitor.ip || activeChat}
                          </p>
                          <p className="text-xs text-white/50">
                            {c?.visitor.online ? "● لايف · " : ""}
                            {c?.visitor.path} · {c?.visitor.ip}
                          </p>
                          {c?.visitor.inForm ? (
                            <p className="mt-1 text-[11px] text-orange-200">
                              يعبّي الفورم الآن ·{" "}
                              {c.visitor.formLabels?.join(" · ") || "—"}
                            </p>
                          ) : c?.visitor.submittedLead ? (
                            <p className="mt-1 text-[11px] text-teal-200">
                              ✅ أرسل اللياد
                            </p>
                          ) : (
                            <p className="mt-1 text-[11px] text-white/40">
                              {c?.visitor.stageLabel} · ما عبّاش الفورم
                            </p>
                          )}
                          {c?.visitor.phone ? (
                            <a
                              href={`https://wa.me/966${c.visitor.phone.replace(/\D/g, "").replace(/^966/, "").replace(/^0/, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-block text-xs font-bold text-[#25D366]"
                            >
                              واتساب الزائر
                            </a>
                          ) : null}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto bg-[#0b1412] px-3 py-3">
                    {chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${
                          m.from === "admin" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            m.from === "admin"
                              ? "rounded-br-sm bg-[#005c4b] text-white"
                              : "rounded-bl-sm bg-[#1f2c2a] text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {m.text}
                          </p>
                          <p className="mt-1 text-left text-[10px] text-white/40">
                            {new Date(m.at).toLocaleTimeString("ar-SA", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                  <form
                    onSubmit={sendReply}
                    className="flex gap-2 border-t border-white/10 bg-[#101a17] p-3"
                  >
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="اكتب ردك هنا…"
                      className="flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm outline-none focus:border-[#25D366]"
                      dir="rtl"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={sending || !reply.trim()}
                      className="rounded-full bg-[#25D366] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      إرسال
                    </button>
                  </form>
                </>
              )}
            </div>
          </section>
        )}

        {tab === "visitors" && (
          <section className="mt-4 space-y-2">
            {data?.visitors.map((v) => (
              <VisitorRow key={v.id} v={v} />
            ))}
          </section>
        )}

        {tab === "leads" && (
          <section className="mt-4 space-y-2">
            {!data?.leads.length && (
              <p className="rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-white/40">
                بانتظار الليادات…
              </p>
            )}
            {data?.leads.map((l) => (
              <article
                key={l.id}
                className={`rounded-xl border px-3 py-2.5 ${
                  l.status === "new"
                    ? "border-teal-400/40 bg-[#0f1f1a]"
                    : "border-white/10 bg-[#101a17]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">
                      <span className="ml-1 text-lg">{l.flag || "🇸🇦"}</span>
                      {l.name}{" "}
                      <span className="font-normal text-white/50">
                        · {l.city}
                      </span>
                      {l.status === "new" ? (
                        <span className="mr-2 rounded bg-teal-400 px-1.5 py-0.5 text-[10px] font-extrabold text-[#04201a]">
                          جديد
                        </span>
                      ) : null}
                    </p>
                    <a
                      href={`tel:${l.phone}`}
                      className="mt-0.5 block font-mono text-base font-bold text-teal-200"
                      dir="ltr"
                    >
                      {l.phone}
                    </a>
                    <a
                      href={`https://wa.me/966${l.phone.replace(/\D/g, "").replace(/^966/, "").replace(/^0/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs font-bold text-[#25D366]"
                    >
                      واتساب الزبون
                    </a>
                    <p className="mt-1 text-xs text-white/70">{l.moveType}</p>
                    {(l.fromArea || l.toArea) && (
                      <p className="text-xs text-white/45">
                        {l.fromArea || "؟"} ← {l.toArea || "؟"}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-white/35">
                      {ago(l.createdAt)} · {l.id}
                      {l.ip ? (
                        <>
                          {" "}
                          · IP{" "}
                          <span className="font-mono text-amber-200/80">
                            {l.ip}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(
                      [
                        ["sent", "أُرسل"],
                        ["sold", "بيع"],
                        ["spam", "سبام"],
                        ["new", "جديد"],
                      ] as const
                    ).map(([s, label]) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(l.id, s)}
                        className={`rounded px-2 py-1 text-[10px] font-bold ${
                          l.status === s
                            ? "bg-teal-400 text-[#04201a]"
                            : "bg-white/5 text-white/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => remove(l.id)}
                      className="rounded px-2 py-1 text-[10px] font-bold text-red-300"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function VisitorRow({
  v,
  live,
  onChat,
}: {
  v: Visitor;
  live?: boolean;
  onChat?: () => void;
}) {
  const stageClass = STAGE_COLORS[v.stage] || STAGE_COLORS.browsing;

  return (
    <article className="rounded-xl border border-white/10 bg-[#101a17] px-3 py-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none" title={v.country}>
          {v.flag}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {live || v.online ? (
              <span className="text-[10px] font-bold text-emerald-400">
                ● LIVE
              </span>
            ) : null}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stageClass}`}
            >
              {v.stageLabel || v.stage}
            </span>
            {v.submittedLead ? (
              <span className="text-[10px] font-bold text-teal-300">
                ✅ أرسل
              </span>
            ) : null}
            {v.inForm ? (
              <span className="text-[10px] font-bold text-orange-300">
                📝 يعبّي الفورم
              </span>
            ) : null}
          </div>

          <p className="mt-1 truncate text-sm font-semibold text-white/90">
            📍 {v.path}
          </p>

          {v.inForm && (v.formFilled ?? 0) > 0 ? (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-orange-400 transition-all"
                    style={{
                      width: `${Math.round(((v.formFilled || 0) / (v.formTotal || 2)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-orange-200">
                  {v.formFilled}/{v.formTotal}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-white/50">
                {v.formLabels?.join(" · ") || "—"}
              </p>
              {v.formDraft?.name || v.formDraft?.phone ? (
                <p className="mt-0.5 text-[11px] text-teal-200/80">
                  {v.formDraft.name ? `الاسم: ${v.formDraft.name}` : ""}
                  {v.formDraft.phone ? ` · ${v.formDraft.phone}` : ""}
                  {v.formDraft.city ? ` · ${v.formDraft.city}` : ""}
                </p>
              ) : null}
            </div>
          ) : !v.submittedLead && v.stage === "browsing" ? (
            <p className="mt-1 text-[11px] text-white/40">
              ما وصلش للفورم بعد
            </p>
          ) : null}

          <p className="mt-1.5 text-[10px] text-white/40">
            IP <span className="font-mono text-amber-200/80">{v.ip}</span>
            {v.city ? ` · ${v.city}` : ""}
            {" · "}
            {v.secondsAgo < 60
              ? `${v.secondsAgo}ث`
              : `${Math.floor(v.secondsAgo / 60)}د`}
            {v.referrer ? ` · ref ${v.referrer.slice(0, 40)}` : ""}
          </p>

          {v.activity?.length ? (
            <p className="mt-1 text-[10px] text-white/30">
              آخر نشاط: {v.activity[v.activity.length - 1]}
            </p>
          ) : null}

          {onChat ? (
            <button
              type="button"
              onClick={onChat}
              className="mt-2 rounded-lg bg-[#25D366]/20 px-3 py-1.5 text-[11px] font-bold text-[#25D366] hover:bg-[#25D366]/30"
            >
              💬 رد على الشات
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
