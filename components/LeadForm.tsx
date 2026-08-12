"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LiveActivity,
  SlotsLeft,
  TodayCounter,
} from "@/components/ConversionWidgets";
import { getVisitorId, trackVisitor } from "@/lib/visitor-client";

export function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const draft = useCallback(() => ({ name, phone }), [name, phone]);
  const filled = Number(name.trim().length >= 2) + Number(phone.replace(/\D/g, "").length >= 9);

  const pushDraft = useCallback(
    (stage: "viewing_form" | "filling_form", activity?: string) => {
      if (trackTimer.current) clearTimeout(trackTimer.current);
      trackTimer.current = setTimeout(() => {
        trackVisitor({
          path: window.location.pathname + window.location.hash,
          stage,
          formDraft: draft(),
          activity,
        });
      }, 400);
    },
    [draft]
  );

  useEffect(() => {
    const t = window.setTimeout(() => nameRef.current?.focus(), 600);
    return () => {
      window.clearTimeout(t);
      if (trackTimer.current) clearTimeout(trackTimer.current);
    };
  }, []);

  function onFocusForm() {
    if (!focused) {
      setFocused(true);
      trackVisitor({
        path: window.location.pathname + "#lead-form",
        stage: "viewing_form",
        activity: "شاف الفورم",
      });
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          visitorId: getVisitorId(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "حدث خطأ");
        return;
      }
      router.push(`/thank-you?id=${encodeURIComponent(json.id || "")}`);
    } catch {
      setError("خطأ في الاتصال — حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-[#0a1210] px-4 py-3.5 text-base text-white outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20";

  return (
    <form
      id="lead-form"
      onSubmit={onSubmit}
      onFocus={onFocusForm}
      className="relative space-y-4 overflow-hidden rounded-2xl border-2 border-teal-400/25 bg-[#101a17]/95 p-5 shadow-[0_0_40px_rgba(45,212,191,0.12)] backdrop-blur sm:p-6"
      dir="rtl"
    >
      <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-teal-400/10 blur-2xl" />

      <LiveActivity />

      <div>
        <p className="text-xs font-bold tracking-wide text-teal-300">
          ⚡ 30 ثانية · مجاني 100% · ما عليك التزام
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
          اطلب عرض نقل عفش
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          اسمك + رقمك — وبيكلمك مندوب ويعطيك أفضل عروض
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-white/40">
          <span>تقدم الطلب</span>
          <span className="text-teal-300">{filled}/2</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-teal-400 transition-all duration-300"
            style={{ width: `${(filled / 2) * 100}%` }}
          />
        </div>
      </div>

      <SlotsLeft />

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-white/50">
            1. الاسم الكامل
          </span>
          <input
            ref={nameRef}
            className={field}
            placeholder="مثال: محمد العتيبي"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              pushDraft("filling_form", "يكتب: الاسم");
            }}
            autoComplete="name"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-white/50">
            2. رقم الجوال
          </span>
          <input
            className={`${field} font-mono tracking-wide`}
            placeholder="05xxxxxxxx"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              pushDraft("filling_form", "يكتب: الجوال");
            }}
            autoComplete="tel"
            dir="ltr"
            required
          />
          <p className="mt-1 text-[10px] text-white/35">
            🔒 رقمك محمي — ما نشاركه إلا مع شركات النقل المعتمدة
          </p>
        </label>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="pulse-cta w-full rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a] shadow-lg shadow-teal-400/20 hover:bg-teal-300 disabled:opacity-60"
      >
        {loading ? "جاري الإرسال…" : "🔥 أبي أطلب عرض مجاني — اتصلوا فيني"}
      </button>

      <TodayCounter />

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-white/40">
        <span>✓ مجاني</span>
        <span>✓ بدون التزام</span>
        <span>✓ شركات معتمدة</span>
        <span>✓ رد خلال دقايق</span>
      </div>
    </form>
  );
}
