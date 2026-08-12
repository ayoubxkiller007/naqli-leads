import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/config";
import { CallCountdown, ThankYouTracker } from "@/components/ThankYouTracker";

const STEPS = [
  {
    n: "1",
    title: "وصلنا طلبك",
    desc: "سجّلنا اسمك ورقمك — كل شي تمام ✅",
  },
  {
    n: "2",
    title: "بيكلمك مندوب نقل العفش",
    desc: "مندوب من شركة نقل عفش معتمدة بيتصل فيك ويأكد: من وين لوين، حجم الأثاث",
  },
  {
    n: "3",
    title: "تاخذ أفضل عرض",
    desc: "بعد التأكيد يعطيك السعر — مجاني وما عليك أي التزام",
  },
];

const TIPS = [
  "خلّ جوالك مفتوح وصوته عالي",
  "ارفع المكالمة حتى لو الرقم ما تعرفه",
  "جهّز: من وين لوين تبي تنقل العفش",
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="hero-bg min-h-screen px-4 py-8" dir="rtl">
      <ThankYouTracker />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center">
        <div className="fade-up w-full overflow-hidden rounded-3xl border border-white/10 bg-[#101a17]/95 shadow-2xl backdrop-blur">
          <div className="border-b border-white/10 bg-gradient-to-b from-teal-500/10 to-transparent px-6 py-8 text-center">
            <Image
              src="/logo-light.png"
              alt={BRAND.nameAr}
              width={160}
              height={64}
              className="mx-auto h-11 w-auto"
              priority
            />
            <div className="thank-check mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-400/15 ring-4 ring-teal-400/25">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 text-teal-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-display mt-5 text-3xl font-black text-white sm:text-4xl">
              تم طلبك — نقل عفش ✅
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/65">
              شكراً — سجّلنا طلب{" "}
              <span className="font-bold text-teal-300">نقل العفش</span> في{" "}
              {BRAND.nameAr}
            </p>
            <CallCountdown />
          </div>

          <div className="space-y-5 px-6 py-7">
            <div className="phone-pulse rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-400/15 to-amber-500/5 px-4 py-5">
              <div className="flex items-start gap-3">
                <span className="phone-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-2xl">
                  📞
                </span>
                <div>
                  <p className="text-lg font-black text-amber-50">
                    مهم: خلّ جوالك مفتوح الحين
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
                    بيكلمك{" "}
                    <strong className="text-white">
                      مندوب من شركتنا المعتمدة
                    </strong>{" "}
                    قريب عشان يأكد معك الطلب ويعطيك عرض السعر.{" "}
                    <strong className="text-white">
                      ارفع المكالمة
                    </strong>{" "}
                    — ما تفوّتها عشان توصلك أفضل عرض.
                  </p>
                  <p className="mt-2 text-xs font-bold text-amber-200/80">
                    ⚠️ الرقم ممكن يطلع ما تعرفه — هذا طبيعي، المندوب من
                    شركائنا
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <p className="text-sm font-extrabold text-white">
                وش تسوي الحين؟
              </p>
              <ul className="mt-3 space-y-2.5">
                {TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-white/65"
                  >
                    <span className="mt-0.5 text-teal-400">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <ol className="space-y-4">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-400/20 text-sm font-black text-teal-300">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-bold text-white">{s.title}</p>
                    <p className="mt-0.5 text-sm text-white/50">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            {id ? (
              <p className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-white/45">
                رقم طلبك:{" "}
                <span className="font-mono font-bold text-teal-200">{id}</span>
                <span className="mt-1 block text-[11px] text-white/35">
                  احفظه — ممكن يسألوك عنه بالمكالمة
                </span>
              </p>
            ) : null}

            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
              {[
                ["معتمدين", "شركات موثوقة"],
                ["مجاني", "بدون رسوم"],
                ["سريع", "رد خلال دقايق"],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="text-xs font-extrabold text-teal-300">{t}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="fade-up-d mt-6 text-sm font-semibold text-white/40 hover:text-white/70"
        >
          ← رجوع للرئيسية
        </Link>
      </div>
    </main>
  );
}
