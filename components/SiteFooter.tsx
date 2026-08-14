import Link from "next/link";
import { BRAND } from "@/lib/config";

const LINKS = [
  { href: "/pages/about", label: "من نحن" },
  { href: "/pages/how-it-works", label: "كيف تعمل" },
  { href: "/pages/privacy", label: "سياسة الخصوصية" },
  { href: "/pages/terms", label: "الشروط" },
  { href: "/pages/contact", label: "تواصل" },
] as const;

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-white/10 bg-[#0c1613] px-4 py-8 text-center ${className}`}
      dir="rtl"
    >
      <p className="mb-3 text-xs font-bold text-teal-300/80">روابط مهمة</p>
      <nav className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-bold text-white/70">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:border-teal-400/40 hover:text-teal-300"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="text-xs text-white/30">
        © {new Date().getFullYear()} {BRAND.nameEn} ({BRAND.nameAr}) · operated
        by {BRAND.legalName}
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-white/25">
        {BRAND.addressLine}
      </p>
    </footer>
  );
}
