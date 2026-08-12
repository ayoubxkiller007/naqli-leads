import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/config";
import { ThankYouTracker } from "@/components/ThankYouTracker";

const STEPS = [
  {
    n: "1",
    title: "تم استلام طلبك",
    desc: "سجّلنا اسمك ورقمك في نظامنا الآمن",
  },
  {
    n: "2",
    title: "مكالمة من شركة شريكنا",
    desc: "راح يتصل بك مندوب معتمد خلال دقائق لتأكيد طلبك",
  },
  {
    n: "3",
    title: "احصل على أفضل عرض",
    desc: "بعد التأكيد، يعطيك السعر والتفاصيل — بدون أي التزام",
  },
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
              تم استلام طلبك بنجاح
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/65">
              شكراً لثقتك في{" "}
              <span className="font-bold text-teal-300">{BRAND.nameAr}</span>
            </p>
          </div>

          <div className="space-y-5 px-6 py-7">
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">📞</span>
                <div>
                  <p className="font-extrabold text-amber-100">
                    مهم جداً: أبقِ جوالك مفتوحاً
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-amber-100/80">
                    راح يتصل بك{" "}
                    <strong className="text-white">
                      مندوب من إحدى شركاتنا المعتمدة
                    </strong>{" "}
                    قريباً لتأكيد طلبك وإعطائك عرض السعر. أجب على المكالمة
                    باش تحصل على أفضل عرض.
                  </p>
                </div>
              </div>
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
                رقم الطلب:{" "}
                <span className="font-mono font-bold text-teal-200">{id}</span>
              </p>
            ) : null}

            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
              {[
                ["معتمد", "شركات موثوقة"],
                ["مجاني", "بدون رسوم"],
                ["سريع", "رد خلال دقائق"],
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
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
