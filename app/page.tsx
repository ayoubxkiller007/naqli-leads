import Image from "next/image";
import { BRAND } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";
import { StickyBar } from "@/components/StickyBar";

export default function HomePage() {
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "السلام عليكم، أحتاج عرض نقل عفش"
  )}`;

  return (
    <>
      <div className="hero-bg min-h-screen pb-24 md:pb-0" dir="rtl">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="fade-up">
            <Image
              src="/logo-light.png"
              alt={BRAND.nameAr}
              width={180}
              height={72}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </div>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="fade-up hidden rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-extrabold text-white sm:inline-flex"
          >
            واتساب
          </a>
        </header>

        <main className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-2 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
          <section className="fade-up space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/hero.png"
                alt="نقل عفش جدة"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div>
            <p className="text-xs font-bold text-teal-300">
              {BRAND.city} · {BRAND.country} · عروض مجانية
            </p>
            <h1 className="font-display fade-up-d mt-3 max-w-xl text-4xl font-black leading-[1.15] text-white sm:text-5xl lg:text-6xl">
              تبي تنقل عفشك؟
              <span className="mt-2 block text-teal-300">
                خلك تاخذ عدة عروض بضغطة.
              </span>
            </h1>
            <p className="fade-up-d2 mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              {BRAND.nameAr} يوصّلك بشركات نقل عفش معتمدة — اكتب اسمك ورقمك
              فقط، وشركة شريكنا تتصل بك وتأكد معك التفاصيل. مجاني وبدون التزام.
            </p>

            <div className="fade-up-d2 mt-7 flex flex-wrap gap-3">
              <a
                href="#lead-form"
                className="pulse-cta inline-flex rounded-xl bg-teal-400 px-6 py-4 text-base font-extrabold text-[#04201a]"
              >
                اطلب عرض مجاني
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-bold text-white"
              >
                تواصل واتساب
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {[
                ["كلمات بحث قوية", "+40 ألف"],
                ["مدن مغطاة", String(BRAND.cities.length)],
                ["التكلفة عليك", "مجاناً"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-bold text-white/40">{k}</dt>
                  <dd className="font-display text-2xl font-black text-white sm:text-3xl">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            </div>
          </section>

          <aside className="fade-up-d2 lg:sticky lg:top-6">
            <LeadForm />
          </aside>
        </main>

        <section className="mx-auto max-w-6xl px-4 pb-14">
          <h2 className="font-display text-3xl font-black text-white">
            ليش الناس تستخدم {BRAND.nameAr}؟
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["عروض متعددة", "ما تعتمد على شركة واحدة — قارن بسرعة"],
              ["شركات محلية", "جدة، الرياض، الدمام والمزيد"],
              ["واتساب سريع", "رد خلال دقائق من شركات النقل"],
            ].map(([t, d]) => (
              <li
                key={t}
                className="border-r-2 border-teal-400/80 bg-white/[0.03] py-4 pr-4 pl-3"
              >
                <p className="font-display text-xl font-bold text-white">{t}</p>
                <p className="mt-1 text-sm text-white/50">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y border-white/10 bg-[#0c1613]/80 py-10">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl font-black text-white">
              نغطي
            </h2>
            <p className="mt-3 flex flex-wrap gap-3 text-sm font-medium text-white/60">
              {BRAND.cities.map((c) => (
                <span key={c} className="rounded-full bg-white/5 px-3 py-1">
                  {c}
                </span>
              ))}
            </p>
          </div>
        </section>

        <footer className="px-4 py-8 text-center text-xs text-white/35">
          © {new Date().getFullYear()} {BRAND.nameAr} ({BRAND.nameEn}) ·{" "}
          <a href="/admin" className="underline hover:text-white/60">
            لوحة التحكم
          </a>
        </footer>
      </div>
      <StickyBar />
    </>
  );
}
