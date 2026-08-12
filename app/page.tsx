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
      <div className="hero-bg min-h-screen pb-24 md:pb-0" dir="rtl">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Image
            src="/logo-light.png"
            alt={BRAND.nameAr}
            width={180}
            height={72}
            className="fade-up h-11 w-auto sm:h-14"
            priority
          />
          <a
            href="#lead-form"
            className="fade-up rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-extrabold text-[#04201a] sm:px-5"
          >
            اطلب عرض مجاني
          </a>
        </header>

        <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-2 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10">
          {/* Form first on mobile = higher conversion */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-6">
            <LeadForm />
          </aside>

          <section className="order-2 space-y-6 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/hero.png"
                alt="نقل عفش السعودية"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="fade-up">
              <p className="inline-flex rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-300">
                🇸🇦 {BRAND.country} · {BRAND.cities.length} مدن · مجاني 100%
              </p>
              <h1 className="font-display mt-4 max-w-xl text-4xl font-black leading-[1.12] text-white sm:text-5xl">
                تبي تنقل عفشك؟
                <span className="mt-2 block text-teal-300">
                  اكتب اسمك ورقمك — وباقي علينا.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
                {BRAND.nameAr} يربطك بشركات نقل عفش معتمدة.{" "}
                <strong className="text-white">ما تحتاج تتعب</strong> — المندوب
                بيكلمك ويعطيك أفضل العروض. مجاني وبدون التزام.
              </p>

              <a
                href="#lead-form"
                className="pulse-cta mt-6 inline-flex w-full items-center justify-center rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a] sm:w-auto sm:px-8"
              >
                🔥 اطلب عرض مجاني الحين
              </a>

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
          <p className="mt-2 text-sm text-white/50">
            اكتب اسمك ورقمك — وبيكلمك مندوب خلال دقايق
          </p>
          <a
            href="#lead-form"
            className="pulse-cta mt-6 inline-flex w-full items-center justify-center rounded-xl bg-teal-400 py-4 text-base font-extrabold text-[#04201a]"
          >
            🔥 اطلب عرض مجاني
          </a>
        </section>

        <footer className="px-4 py-8 text-center text-xs text-white/30">
          © {new Date().getFullYear()} {BRAND.nameAr} · عروض نقل عفش مجانية
        </footer>
      </div>
      <StickyBar />
    </>
  );
}
