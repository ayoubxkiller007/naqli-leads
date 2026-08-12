"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND, MOVE_TYPES } from "@/lib/config";
import { getVisitorId, trackVisitor } from "@/lib/visitor-client";

export function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(BRAND.city);
  const [moveType, setMoveType] = useState<string>(MOVE_TYPES[0]);
  const [fromArea, setFromArea] = useState("");
  const [toArea, setToArea] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draft = useCallback(
    () => ({ name, phone, city, moveType, fromArea, toArea, notes }),
    [name, phone, city, moveType, fromArea, toArea, notes]
  );

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

  function onFieldChange(
    setter: (v: string) => void,
    value: string,
    label: string
  ) {
    setter(value);
    pushDraft("filling_form", `يكتب: ${label}`);
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
          city,
          moveType,
          fromArea,
          toArea,
          notes,
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
      setError("خطأ في الاتصال — تواصل واتساب");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-[#0a1210] px-3.5 py-3 text-[15px] text-white outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/25";

  return (
    <form
      id="lead-form"
      onSubmit={onSubmit}
      onFocus={onFocusForm}
      className="space-y-3 rounded-2xl border border-white/10 bg-[#101a17]/95 p-5 shadow-2xl backdrop-blur"
      dir="rtl"
    >
      <div>
        <p className="text-xs font-bold tracking-wide text-teal-300">
          عرض مجاني خلال دقائق
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-white">
          اطلب عروض نقل عفش
        </h2>
        <p className="mt-1 text-sm text-white/55">
          نربطك بشركات نقل معتمدة في مدينتك
        </p>
      </div>

      <input
        className={field}
        placeholder="الاسم الكامل"
        value={name}
        onChange={(e) => onFieldChange(setName, e.target.value, "الاسم")}
        required
      />
      <input
        className={field}
        placeholder="رقم الجوال (05xxxxxxxx)"
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => onFieldChange(setPhone, e.target.value, "الجوال")}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          className={field}
          value={city}
          onChange={(e) => onFieldChange(setCity, e.target.value, "المدينة")}
          required
        >
          {BRAND.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={field}
          value={moveType}
          onChange={(e) =>
            onFieldChange(setMoveType, e.target.value, "نوع النقل")
          }
          required
        >
          {MOVE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          className={field}
          placeholder="من حي…"
          value={fromArea}
          onChange={(e) => onFieldChange(setFromArea, e.target.value, "من")}
        />
        <input
          className={field}
          placeholder="إلى حي…"
          value={toArea}
          onChange={(e) => onFieldChange(setToArea, e.target.value, "إلى")}
        />
      </div>
      <textarea
        className={`${field} min-h-[70px] resize-none`}
        placeholder="ملاحظات (اختياري)"
        value={notes}
        onChange={(e) => onFieldChange(setNotes, e.target.value, "ملاحظات")}
      />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-teal-400 py-3.5 text-[15px] font-extrabold text-[#04201a] hover:bg-teal-300 disabled:opacity-60"
      >
        {loading ? "جاري الإرسال…" : "احصل على عروض مجانية"}
      </button>
      <p className="text-center text-[11px] text-white/40">
        مجاني · بدون التزام · شركات موثوقة
      </p>
    </form>
  );
}
