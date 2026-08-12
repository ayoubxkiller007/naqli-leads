"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getVisitorId, trackVisitor } from "@/lib/visitor-client";

export function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draft = useCallback(() => ({ name, phone }), [name, phone]);

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
      className="space-y-4 rounded-2xl border border-white/10 bg-[#101a17]/95 p-5 shadow-2xl backdrop-blur sm:p-6"
      dir="rtl"
    >
      <div>
        <p className="text-xs font-bold tracking-wide text-teal-300">
          30 ثانية فقط · مجاني 100%
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
          اطلب عرض نقل عفش
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          اكتب اسمك ورقمك — شركة شريكنا تتصل بك وتأكد معك التفاصيل
        </p>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-white/50">
            الاسم الكامل
          </span>
          <input
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
            رقم الجوال
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
        </label>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="pulse-cta w-full rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a] hover:bg-teal-300 disabled:opacity-60"
      >
        {loading ? "جاري الإرسال…" : "أرسل — وتصلك مكالمة تأكيد"}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-white/40">
        <span>✓ مجاني</span>
        <span>✓ بدون التزام</span>
        <span>✓ شركات معتمدة</span>
      </div>
    </form>
  );
}
