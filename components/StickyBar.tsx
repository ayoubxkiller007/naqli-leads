"use client";

import { useEffect, useState } from "react";

export function StickyBar() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const form = document.getElementById("lead-form");
    if (!form || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Hide sticky CTA while the form is clearly on screen
        setShow(!entry.isIntersecting);
      },
      { threshold: 0.35, rootMargin: "-40px 0px 0px 0px" },
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-400/20 bg-[#070f0c]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      dir="rtl"
    >
      <a
        href="#lead-form"
        className="pulse-cta mx-auto flex max-w-lg items-center justify-center gap-2 rounded-xl bg-teal-400 py-3.5 text-base font-extrabold text-[#04201a] active:opacity-90"
      >
        <span>🚚</span>
        <span>اطلب عرض نقل عفش مجاني</span>
      </a>
      <p className="mt-1.5 text-center text-[10px] font-bold text-white/40">
        بدون رسوم · رد خلال دقايق
      </p>
    </div>
  );
}
