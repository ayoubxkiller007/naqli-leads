import Image from "next/image";
import { BRAND } from "@/lib/config";
import { TopUrgencyBar } from "@/components/ConversionWidgets";
import { FAQ } from "@/components/FAQ";
import { LeadForm } from "@/components/LeadForm";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyBar } from "@/components/StickyBar";
import { Testimonials } from "@/components/Testimonials";

const SERVICES = ["نقل عفش", "فك وتركيب", "تغليف أثاث", "نقل بين المدن"];

const STEPS = [
  ["1", "اطلب عرض نقل عفش", "اسم + رقم — 30 ثانية"],
  ["2", "بيكلمك مندوب النقل", "يأكد معك: من وين لوين، نوع الأثاث"],
  ["3", "تاخذ أفضل سعر", "مجاني — ما عليك أي التزام"],
];

const BENEFITS = [
  ["⚡ سريع", "30 ثانية — وبيكلمك مندوب نقل العفش"],
  ["💰 مجاني", "عروض نقل عفش بدون رسوم"],
  ["✅ معتمدين", "شركات نقل أثاث موثوقة"],
];

export default function HomePage() {
  return (
    <>
      <TopUrgencyBar />
      <div className="hero-bg min-h-screen pb-24 md:pb-0" dir="rtl">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
          <Image
            src="/logo-light.png"
            alt={`${BRAND.nameAr} — نقل عفش`}
            width={140}
            height={56}
            className="h-9 w-auto md:h-14"
            priority
          />
          <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] font-bold text-white/55 md:gap-x-4 md:text-xs">
            <a href="/pages/about" className="hover:text-teal-300">
              من نحن
            </a>
            <a href="/pages/privacy" className="hover:text-teal-300">
              الخصوصية
            </a>
            <a
              href="#lead-form"
              className="rounded-lg bg-teal-400 px-3 py-1.5 text-[11px] font-extrabold text-[#04201a] md:rounded-xl md:px-5 md:py-2.5 md:text-sm"
            >
              عرض مجاني
            </a>
          </nav>
        </header>

        {/* Mobile: form first */}
        <main className="mx-auto max-w-lg px-4 pt-1 md:hidden">
          <p className="mb-2 inline-flex rounded-full bg-teal-400/15 px-3 py-1 text-[11px] font-bold text-teal-300">
            🚚 نقل عفش · {BRAND.city} والمملكة
          </p>
          <h1 className="font-display mb-2 text-2xl font-black leading-tight text-white">
            شركات نقل عفش معتمدة
            <span className="mt-1 block text-base font-bold text-teal-300">
              اطلب عرض مجاني — فك وتركيب · تغليف · بين المدن
            </span>
          </h1>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SERVICES.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-white/55"
              >
                {s}
              </span>
            ))}
          </div>
          <LeadForm />

          {/* Trust strip under form */}
          <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ["+40", "طلب اليوم"],
              ["5–15", "دقيقة رد"],
              ["100%", "مجاني"],
            ].map(([v, k]) => (
              <li
                key={k}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3"
              >
                <p className="font-display text-lg font-black text-teal-300">
                  {v}
                </p>
                <p className="text-[10px] font-bold text-white/45">{k}</p>
              </li>
            ))}
          </ul>
        </main>

        {/* Desktop */}
        <main className="mx-auto hidden max-w-6xl gap-10 px-4 pb-10 pt-2 md:grid lg:grid-cols-[1fr_420px] lg:items-start">
          <aside className="lg:sticky lg:top-6">
            <LeadForm />
          </aside>
          <section className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/hero.png"
                alt="نقل عفش — شركة نقل أثاث في السعودية"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="inline-flex rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-300">
                🚚 نقل عفش · {BRAND.country} · مجاني 100%
              </p>
              <h1 className="font-display mt-4 max-w-xl text-5xl font-black leading-[1.12] text-white">
                شركات نقل عفش معتمدة
                <span className="mt-2 block text-teal-300">
                  عروض مجانية — فك وتركيب · تغليف · نقل بين المدن
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/65">
                {BRAND.nameAr} يربطك بأفضل شركات{" "}
                <strong className="text-white">نقل العفش والأثاث</strong> في
                المملكة. اكتب اسمك ورقمك — المندوب بيكلمك ويعطيك أسعار نقل
                العفش. مجاني وبدون التزام.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {[
                  ["طلبات نقل عفش", "+40"],
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

        {/* Shared content — mobile + desktop */}
        <div className="mx-auto max-w-6xl">
          <section className="px-4 pb-10 pt-10 md:pb-12">
            <h2 className="font-display text-center text-xl font-black text-white md:text-2xl">
              كيف تطلب نقل عفش؟ — 3 خطوات
            </h2>
            <ol className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-8 md:gap-4">
              {STEPS.map(([n, t, d]) => (
                <li
                  key={n}
                  className="rounded-2xl border border-white/10 bg-[#101a17] p-4 text-center md:p-5"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-400/20 text-base font-black text-teal-300 md:h-10 md:w-10 md:text-lg">
                    {n}
                  </span>
                  <p className="mt-2 font-display text-base font-bold text-white md:mt-3 md:text-lg">
                    {t}
                  </p>
                  <p className="mt-1 text-xs text-white/50 md:text-sm">{d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="px-4 pb-10 md:pb-12">
            <h2 className="font-display text-xl font-black text-white md:text-2xl">
              ليش تطلب نقل عفش من {BRAND.nameAr}؟
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3 md:mt-6 md:gap-4">
              {BENEFITS.map(([t, d]) => (
                <li
                  key={t}
                  className="border-r-2 border-teal-400/80 bg-white/[0.03] py-3 pr-4 pl-3 md:py-4"
                >
                  <p className="font-display text-lg font-bold text-white md:text-xl">
                    {t}
                  </p>
                  <p className="mt-1 text-xs text-white/50 md:text-sm">{d}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Mobile hero image */}
          <section className="px-4 pb-8 md:hidden">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/hero.png"
                alt="نقل عفش — شركة نقل أثاث في السعودية"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          </section>

          <Testimonials />
          <FAQ />

          <section className="border-y border-white/10 bg-[#0c1613]/80 py-8 md:py-10">
            <div className="px-4 text-center">
              <h2 className="font-display text-xl font-black text-white md:text-2xl">
                نقل عفش في كل المملكة
              </h2>
              <p className="mt-2 text-xs text-white/45 md:text-sm">
                نقل عفش جدة · الرياض · الدمام · مكة · الطائف · الخبر · المدينة
              </p>
              <p className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-medium text-white/60 md:gap-3 md:text-sm">
                {BRAND.cities.map((c) => (
                  <span key={c} className="rounded-full bg-white/5 px-2.5 py-1">
                    نقل عفش {c}
                  </span>
                ))}
              </p>
            </div>
          </section>

          <section className="px-4 py-10 text-center md:py-12">
            <h2 className="font-display text-xl font-black text-white md:text-2xl">
              جاهز تنقل عفشك؟
            </h2>
            <p className="mt-2 text-sm text-white/50">
              اطلب عرض نقل عفش مجاني — بيكلمك مندوب خلال دقايق
            </p>
            <a
              href="#lead-form"
              className="pulse-cta mt-5 inline-flex w-full max-w-lg items-center justify-center rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a]"
            >
              عرض نقل عفش مجاني الآن
            </a>
            <p className="mt-3 text-[11px] font-semibold text-white/40">
              بدون رسوم · بدون التزام · رد خلال دقايق
            </p>
          </section>
        </div>

        <SiteFooter />
      </div>
      <StickyBar />
    </>
  );
}
