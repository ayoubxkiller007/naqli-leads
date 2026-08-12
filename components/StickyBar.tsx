"use client";

import { BRAND } from "@/lib/config";

export function StickyBar() {
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "السلام عليكم، أحتاج عرض نقل عفش"
  )}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070f0c]/95 p-3 backdrop-blur md:hidden" dir="rtl">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center rounded-xl bg-[#25D366] py-3.5 text-sm font-extrabold text-white"
        >
          واتساب الآن
        </a>
        <a
          href="#lead-form"
          className="flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm font-bold text-white"
        >
          النموذج السريع
        </a>
      </div>
    </div>
  );
}
