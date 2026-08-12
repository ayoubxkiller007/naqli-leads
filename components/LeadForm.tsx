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
  const filled =
    Number(name.trim().length >= 2) +
    Number(phone.replace(/\D/g, "").length >= 9);

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
      }, 600);
    },
    [draft]
  );

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop) return;
    const t = window.setTimeout(() => nameRef.current?.focus(), 400);
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
    "w-full rounded-xl border border-white/15 bg-[#0a1210] px-4 py-4 text-base text-white outline-none focus:border-teal-400/60 md:py-3.5";

  return (
    <form
      id="lead-form"
      onSubmit={onSubmit}
      onFocus={onFocusForm}
      className="space-y-3 rounded-2xl border border-teal-400/20 bg-[#101a17] p-4 md:relative md:space-y-4 md:overflow-hidden md:border-2 md:border-teal-400/25 md:bg-[#101a17]/95 md:p-6 md:shadow-[0_0_40px_rgba(45,212,191,0.12)] md:backdrop-blur"
      dir="rtl"
    >
      <div className="hidden md:block absolute -left-8 -top-8 h-24 w-24 rounded-full bg-teal-400/10 blur-2xl" />

      <div className="hidden md:block">
        <LiveActivity />
      </div>

      <div>
        <p className="text-[11px] font-bold text-teal-300 md:text-xs">
          🚚 نقل عفش · مجاني · 30 ثانية
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-white md:text-3xl">
          اطلب عرض نقل عفش مجاني
        </h2>
        <p className="mt-1 text-xs text-white/55 md:text-sm">
          اسم + رقم — شركات نقل عفش معتمدة بيكلمونك
        </p>
      </div>

      <div className="hidden space-y-1 md:block">
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

      <div className="hidden md:block">
        <SlotsLeft />
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-white/50">
            الاسم
          </span>
          <input
            ref={nameRef}
            className={field}
            placeholder="محمد العتيبي"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              pushDraft("filling_form", "يكتب: الاسم");
            }}
            autoComplete="name"
            enterKeyHint="next"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-white/50">
            رقم الجوال
          </span>
          <input
            className={`${field} font-mono`}
            placeholder="05xxxxxxxx"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              pushDraft("filling_form", "يكتب: الجوال");
            }}
            autoComplete="tel"
            enterKeyHint="go"
            dir="ltr"
            required
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="pulse-cta w-full rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a] active:scale-[0.98] md:shadow-lg md:shadow-teal-400/20"
      >
        {loading ? "جاري الإرسال…" : "🚚 اطلب عرض نقل عفش مجاني"}
      </button>

      <p className="text-center text-[11px] font-semibold text-white/40 md:hidden">
        ✓ نقل عفش · ✓ فك وتركيب · ✓ مجاني
      </p>

      <div className="hidden md:block">
        <TodayCounter />
      </div>

      <div className="hidden flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-white/40 md:flex">
        <span>✓ مجاني</span>
        <span>✓ بدون التزام</span>
        <span>✓ شركات نقل عفش</span>
      </div>
    </form>
  );
}
