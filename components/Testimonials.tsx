const REVIEWS = [
  {
    name: "فهد العتيبي",
    city: "جدة",
    text: "كتبت اسمي ورقمي — اتصلوا فيني خلال 10 دقايق وعطوني 3 عروض. وفرت فلوس!",
    stars: 5,
  },
  {
    name: "نورة القحطاني",
    city: "الرياض",
    text: "أسهل طريقة — ما حتت تعب نفسك تدور. المندوب أكد معي كل شي بالتليفون.",
    stars: 5,
  },
  {
    name: "خالد الدوسري",
    city: "الدمام",
    text: "مجاني فعلاً. ما دفعت شي — بس اخترت أفضل عرض من الشركات اللي تواصلوا معي.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14" dir="rtl">
      <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
        وش يقولون الناس؟
      </h2>
      <p className="mt-2 text-sm text-white/45">
        آلاف السعوديين استخدموا {`نَقْلِي`} — وهذي تجاربهم
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
