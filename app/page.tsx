import Image from "next/image";
import { BRAND } from "@/lib/config";
import { TopUrgencyBar } from "@/components/ConversionWidgets";
import { FAQ } from "@/components/FAQ";
import { LeadForm } from "@/components/LeadForm";
import { StickyBar } from "@/components/StickyBar";
import { Testimonials } from "@/components/Testimonials";

const STEPS = [
  ["1", "اكتب اسمك ورقمك", "30 ثانية — ما تحتاج تملأ فورم طويل"],
  ["2", "بيكلمك المندوب", "يأكد معك التفاصيل بالتليفون"],
  ["3", "تاخذ أفضل عرض", "مجاني — وما عليك أي التزام"],
];

export default function HomePage() {
  return (
    <>
      <TopUrgencyBar />
      <div className="hero-bg min-h-screen pb-[4.5rem] md:pb-0" dir="rtl">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <Image
            src="/logo-light.png"
            alt={BRAND.nameAr}
            width={140}
            height={56}
            className="h-9 w-auto md:h-14"
            priority
          />
          <a
            href="#lead-form"
            className="hidden rounded-xl bg-teal-400 px-5 py-2.5 text-sm font-extrabold text-[#04201a] md:inline-flex"
          >
            اطلب عرض مجاني
          </a>
        </header>

        {/* Mobile: form only — light & fast */}
        <main className="mx-auto max-w-lg px-4 pt-1 md:hidden">
          <h1 className="font-display mb-3 text-2xl font-black leading-tight text-white">
            تبي تنقل عفشك؟
            <span className="mt-1 block text-base font-bold text-teal-300">
              اسم + رقم — وبيكلمك مندوب
            </span>
          </h1>
          <LeadForm />
        </main>

        {/* Desktop: full layout */}
        <main className="mx-auto hidden max-w-6xl gap-10 px-4 pb-10 pt-2 md:grid lg:grid-cols-[1fr_420px] lg:items-start">
          <aside className="lg:sticky lg:top-6">
            <LeadForm />
          </aside>
          <section className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/hero.png"
                alt="نقل عفش السعودية"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="inline-flex rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-300">
                🇸🇦 {BRAND.country} · مجاني 100%
              </p>
              <h1 className="font-display mt-4 max-w-xl text-5xl font-black leading-[1.12] text-white">
                تبي تنقل عفشك؟
                <span className="mt-2 block text-teal-300">
                  اكتب اسمك ورقمك — وباقي علينا.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/65">
                {BRAND.nameAr} يربطك بشركات نقل عفش معتمدة. المندوب بيكلمك
                ويعطيك أفضل العروض — مجاني وبدون التزام.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {[
                  ["طلبات اليوم", "+40"],
                  ["مدن", String(BRAND.cities.length)],
                  ["عليك", "مجاناً"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10px] font-bold text-white/40">{k}</dt>
                    <dd className="font-display text-2xl font-black text-white">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </main>

        <div className="hidden md:block">
          <section className="mx-auto max-w-6xl px-4 pb-12">
            <h2 className="font-display text-center text-2xl font-black text-white">
              كيف يشتغل؟ — 3 خطوات بس
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {STEPS.map(([n, t, d]) => (
                <li
                  key={n}
                  className="rounded-2xl border border-white/10 bg-[#101a17] p-5 text-center"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/20 text-lg font-black text-teal-300">
                    {n}
                  </span>
                  <p className="mt-3 font-display text-lg font-bold text-white">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-12">
            <h2 className="font-display text-2xl font-black text-white">
              ليش تستخدم {BRAND.nameAr}؟
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["⚡ سريع", "30 ثانية — وبيكلمك المندوب"],
                ["💰 مجاني", "ما تدفع شي — العروض علينا"],
                ["✅ معتمدين", "شركات نقل موثوقة في المملكة"],
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

          <Testimonials />
          <FAQ />

          <section className="border-y border-white/10 bg-[#0c1613]/80 py-10">
            <div className="mx-auto max-w-6xl px-4 text-center">
              <h2 className="font-display text-2xl font-black text-white">
                نغطي كل المملكة
              </h2>
              <p className="mt-3 flex flex-wrap justify-center gap-3 text-sm font-medium text-white/60">
                {BRAND.cities.map((c) => (
                  <span key={c} className="rounded-full bg-white/5 px-3 py-1">
                    {c}
                  </span>
                ))}
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-lg px-4 py-12 text-center">
            <h2 className="font-display text-2xl font-black text-white">
              جاهز تنقل عفشك؟
            </h2>
            <a
              href="#lead-form"
              className="pulse-cta mt-6 inline-flex w-full items-center justify-center rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a]"
            >
              اطلب عرض مجاني
            </a>
          </section>
        </div>

        <footer className="hidden px-4 py-8 text-center text-xs text-white/30 md:block">
          © {new Date().getFullYear()} {BRAND.nameAr} · عروض نقل عفش مجانية
        </footer>
      </div>
      <StickyBar />
    </>
  );
}
