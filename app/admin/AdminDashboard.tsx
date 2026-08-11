"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
};

type Payload = {
  stats: { total: number; new: number; today: number };
  leads: Lead[];
};

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - +new Date(iso)) / 1000));
  if (s < 60) return `${s}ث`;
  if (s < 3600) return `${Math.floor(s / 60)}د`;
  return `${Math.floor(s / 3600)}س`;
}

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const known = useRef<Set<string>>(new Set());
  const primed = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/leads", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!res.ok) return;
    const json = (await res.json()) as Payload;
    if (primed.current) {
      for (const l of json.leads) {
        if (l.status === "new" && !known.current.has(l.id)) {
          setFlash(`${l.name} · ${l.city} · ${l.moveType}`);
          window.setTimeout(() => setFlash(null), 5000);
          break;
        }
      }
    }
    known.current = new Set(json.leads.map((l) => l.id));
    primed.current = true;
    setData(json);
  }, [router]);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 2000);
    return () => window.clearInterval(t);
  }, [load]);

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
        <div className="fixed inset-x-0 top-3 z-50 mx-auto max-w-md rounded-xl bg-teal-400 px-4 py-3 text-center text-sm font-extrabold text-[#04201a]">
          لياد جديد · {flash}
        </div>
      ) : null}

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070f0c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-display text-2xl font-black">ليادات نَقْلِي</p>
            <p className="text-[11px] text-white/40">تحديث كل ثانيتين</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-300"
            >
              مسح الكل
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
        <div className="grid grid-cols-3 gap-2">
          {[
            ["جديد", data?.stats.new ?? "—"],
            ["اليوم", data?.stats.today ?? "—"],
            ["الكل", data?.stats.total ?? "—"],
          ].map(([l, v]) => (
            <div
              key={l}
              className="rounded-xl border border-white/10 bg-[#101a17] px-3 py-3"
            >
              <p className="text-[10px] font-bold text-white/40">{l}</p>
              <p className="font-display text-3xl font-black text-teal-300">{v}</p>
            </div>
          ))}
        </div>

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
                    {l.name}{" "}
                    <span className="font-normal text-white/50">· {l.city}</span>
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
                    واتساب
                  </a>
                  <p className="mt-1 text-xs text-white/70">{l.moveType}</p>
                  {(l.fromArea || l.toArea) && (
                    <p className="text-xs text-white/45">
                      {l.fromArea || "؟"} ← {l.toArea || "؟"}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-white/35">
                    {ago(l.createdAt)} · {l.id}
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
      </main>
    </div>
  );
}
