import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BRAND } from "@/lib/config";
import { PAGES } from "@/lib/pages-content";

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const data = PAGES[page];
  if (!data) return {};
  return {
    title: `${data.title} | ${BRAND.nameAr}`,
    description: data.description ?? data.sections[0]?.p.slice(0, 160),
  };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const data = PAGES[page];
  if (!data) notFound();

  return (
    <div
      className="min-h-screen bg-[#0a1411] px-4 py-10 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-bold text-teal-400 hover:text-teal-300"
        >
          ← الرئيسية
        </Link>
        <h1 className="font-display mt-6 text-3xl font-black">{data.title}</h1>
        <div className="mt-8 space-y-5">
          {data.sections.map((s, i) => (
            <article
              key={i}
              className="rounded-2xl border border-white/10 bg-[#101a17] p-5"
            >
              <h2 className="font-display text-lg font-bold text-teal-300">
                {s.h}
              </h2>
              <p className="mt-2 leading-relaxed text-white/75">{s.p}</p>
            </article>
          ))}
        </div>
        {page === "privacy" && (
          <p className="mt-8 text-center text-xs text-white/35">
            آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
          </p>
        )}
        <footer className="mt-10 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-6 text-xs text-white/40">
          <Link href="/pages/about" className="hover:text-teal-400">
            من نحن
          </Link>
          <Link href="/pages/how-it-works" className="hover:text-teal-400">
            كيف تعمل
          </Link>
          <Link href="/pages/privacy" className="hover:text-teal-400">
            الخصوصية
          </Link>
          <Link href="/pages/terms" className="hover:text-teal-400">
            الشروط
          </Link>
          <Link href="/pages/contact" className="hover:text-teal-400">
            تواصل
          </Link>
        </footer>
      </div>
    </div>
  );
}
