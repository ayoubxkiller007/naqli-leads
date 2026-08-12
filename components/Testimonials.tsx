const REVIEWS = [
  {
    name: "فهد العتيبي",
    city: "جدة",
    text: "طلبت عرض نقل عفش — اتصلوا فيني خلال 10 دقايق وعطوني 3 أسعار. وفرت فلوس!",
    stars: 5,
  },
  {
    name: "نورة القحطاني",
    city: "الرياض",
    text: "أسهل طريقة تلقى شركة نقل أثاث. المندوب أكد معي كل تفاصيل النقل بالتليفون.",
    stars: 5,
  },
  {
    name: "خالد الدوسري",
    city: "الدمام",
    text: "نقل عفش مجاني فعلاً. اخترت أفضل عرض من شركات النقل اللي تواصلوا معي.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14" dir="rtl">
      <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
        تجارب نقل عفش حقيقية
      </h2>
      <p className="mt-2 text-sm text-white/45">
        آلاف السعوديين طلبوا عروض نقل عفش عبر {`نَقْلِي`}
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <li
            key={r.name}
            className="rounded-2xl border border-white/10 bg-[#101a17] p-5"
          >
            <p className="text-amber-300" aria-hidden>
              {"★".repeat(r.stars)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              &ldquo;{r.text}&rdquo;
            </p>
            <p className="mt-4 text-xs font-bold text-white/50">
              {r.name} · {r.city}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
