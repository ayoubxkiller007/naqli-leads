import Link from "next/link";
import { BRAND } from "@/lib/config";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `السلام عليكم، أرسلت طلب نقل عفش${id ? ` رقم ${id}` : ""}`
  )}`;

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101a17] p-8 text-center">
        <p className="text-xs font-bold text-teal-300">تم استلام طلبك</p>
        <h1 className="font-display mt-3 text-4xl font-black text-white">
          جاري مطابقة الشركات
        </h1>
        <p className="mt-3 text-white/60">
          بيتواصلون معك قريب بعروض النقل
          {id ? (
            <>
              {" "}
              · رقم{" "}
              <span className="font-mono text-teal-200">{id}</span>
            </>
          ) : null}
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] py-3.5 font-extrabold text-white"
        >
          أو راسلنا واتساب
        </a>
        <Link href="/" className="mt-4 inline-block text-sm text-white/45">
          ← رجوع
        </Link>
      </div>
    </main>
  );
}
