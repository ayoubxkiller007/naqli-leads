"use client";

export function StickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-400/20 bg-[#070f0c]/98 p-3 backdrop-blur md:hidden"
      dir="rtl"
    >
      <a
        href="#lead-form"
        className="pulse-cta mx-auto flex max-w-lg items-center justify-center gap-2 rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a] shadow-lg"
      >
        🔥 اطلب عرض مجاني — 30 ثانية
      </a>
    </div>
  );
}
