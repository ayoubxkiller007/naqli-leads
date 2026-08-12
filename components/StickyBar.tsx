"use client";

export function StickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070f0c] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      dir="rtl"
    >
      <a
        href="#lead-form"
        className="mx-auto flex max-w-lg items-center justify-center rounded-xl bg-teal-400 py-3.5 text-base font-extrabold text-[#04201a] active:opacity-90"
      >
        اطلب عرض نقل عفش
      </a>
    </div>
  );
}
