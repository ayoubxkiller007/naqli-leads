"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "هل فعلاً مجاني؟",
    a: "أي نعم — 100% مجاني. ما تدفع شي لـ نَقْلِي. الشركات هي اللي تعطيك العروض.",
  },
  {
    q: "متى بيتصلون فيني؟",
    a: "عادة خلال 5–15 دقيقة. خلّ جوالك مفتوح — مندوب من شركتنا المعتمدة بيكلمك.",
  },
  {
    q: "ليش تحتاجون اسمي ورقمي بس؟",
    a: "عشان نسهّل عليك — الباقي بيأكده معك المندوب بالمكالمة. ما تحتاج تملأ فورم طويل.",
  },
  {
    q: "هل في التزام أو عقد؟",
    a: "لا والله — تاخذ العروض وتختار اللي يناسبك. ما عليك أي التزام.",
  },
  {
    q: "وش المدن اللي تغطونها؟",
    a: "جدة، الرياض، الدمام، مكة، الطائف، الخبر، المدينة — ونوسّع باستمرار.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-2xl px-4 pb-14" dir="rtl">
      <h2 className="font-display text-center text-2xl font-black text-white">
        أسئلة شائعة
      </h2>
      <ul className="mt-6 space-y-2">
        {FAQS.map((f, i) => (
          <li
            key={f.q}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#101a17]"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-right text-sm font-bold text-white"
            >
              {f.q}
              <span className="text-teal-400">{open === i ? "−" : "+"}</span>
            </button>
            {open === i ? (
              <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/55">
                {f.a}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
