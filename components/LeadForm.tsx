"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LiveActivity,
  SlotsLeft,
  TodayCounter,
} from "@/components/ConversionWidgets";
import { getVisitorId, trackVisitor } from "@/lib/visitor-client";

function normalizeSaudiPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("966")) d = "0" + d.slice(3);
  if (d.startsWith("00966")) d = "0" + d.slice(5);
  return d.slice(0, 10);
}

function isValidSaudiPhone(digits: string) {
  return /^05\d{8}$/.test(digits);
}

export function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const draft = useCallback(() => ({ name, phone }), [name, phone]);
  const nameOk = name.trim().length >= 2;
  const phoneDigits = normalizeSaudiPhone(phone);
  const phoneOk = isValidSaudiPhone(phoneDigits);
  const filled = Number(nameOk) + Number(phoneOk);
  const ready = nameOk && phoneOk;

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
    [draft],
  );

  useEffect(() => {
    return () => {
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

    if (!nameOk) {
      setError("اكتب اسمك كامل (حرفين على الأقل)");
      nameRef.current?.focus();
      return;
    }
    if (!phoneOk) {
      setError("رقم جوال سعودي صحيح — مثال: 05xxxxxxxx");
      phoneRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneDigits,
          visitorId: getVisitorId(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "حدث خطأ — حاول مرة ثانية");
        return;
      }
      router.push(`/thank-you?id=${encodeURIComponent(json.id || "")}`);
    } catch {
      setError("خطأ في الاتصال — تأكد من النت وحاول مرة أخرى");
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
      className="space-y-3 rounded-2xl border-2 border-teal-400/25 bg-[#101a17] p-4 shadow-[0_0_28px_rgba(45,212,191,0.1)] md:relative md:space-y-4 md:overflow-hidden md:bg-[#101a17]/95 md:p-6 md:backdrop-blur"
      dir="rtl"
    >
      <div className="pointer-events-none absolute -left-8 -top-8 hidden h-24 w-24 rounded-full bg-teal-400/10 blur-2xl md:block" />

      <LiveActivity />

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
          <span className="mb-1 flex items-center justify-between text-xs font-bold text-white/50">
            الاسم
            {nameOk ? (
              <span className="text-[10px] text-teal-300">✓ تمام</span>
            ) : null}
          </span>
          <input
            ref={nameRef}
            className={field}
            placeholder="محمد العتيبي"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
              pushDraft("filling_form", "يكتب: الاسم");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                phoneRef.current?.focus();
              }
            }}
            autoComplete="name"
            enterKeyHint="next"
            autoCapitalize="words"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 flex items-center justify-between text-xs font-bold text-white/50">
            رقم الجوال
            {phoneOk ? (
              <span className="text-[10px] text-teal-300">✓ تمام</span>
            ) : null}
          </span>
          <input
            ref={phoneRef}
            className={`${field} font-mono tracking-wide`}
            placeholder="05xxxxxxxx"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              const next = normalizeSaudiPhone(e.target.value);
              setPhone(next);
              setError("");
              pushDraft("filling_form", "يكتب: الجوال");
            }}
            autoComplete="tel"
            enterKeyHint="go"
            dir="ltr"
            maxLength={10}
            required
          />
          <span className="mt-1 block text-[10px] text-white/35">
            يبدأ بـ 05 ويتكون من 10 أرقام
          </span>
        </label>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !ready}
        className="pulse-cta w-full rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 md:shadow-lg md:shadow-teal-400/20"
      >
        {loading
          ? "جاري الإرسال…"
          : ready
            ? "🚚 اطلب عرض نقل عفش مجاني"
            : "أكمل الاسم والجوال"}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-white/45">
        <span>✓ مجاني</span>
        <span>✓ بدون التزام</span>
        <span>✓ رد خلال دقايق</span>
      </div>

      <TodayCounter />

      <p className="text-center text-[10px] leading-relaxed text-white/35">
        بإرسالك الطلب توافق على{" "}
        <a href="/pages/privacy" className="text-teal-400/80 underline">
          سياسة الخصوصية
        </a>{" "}
        و{" "}
        <a href="/pages/terms" className="text-teal-400/80 underline">
          الشروط
        </a>
        .
      </p>
    </form>
  );
}
