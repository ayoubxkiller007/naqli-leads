"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/config";

const NAMES = [
  "فهد", "نورة", "سلمان", "ريم", "عبدالله", "سارة", "خالد", "منى",
];

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

export function LiveActivity() {
  const [line, setLine] = useState("");

  useEffect(() => {
    const seed = new Date().getDate() + new Date().getHours();
    const name = pick(NAMES, seed);
    const city = pick([...BRAND.cities], seed + 2);
    const mins = (seed % 20) + 3;
    setLine(`${name} من ${city} طلب عرض من ${mins} دقيقة`);

    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop) return;

    let tick = 0;
    const t = window.setInterval(() => {
      tick += 1;
      const s = tick + seed;
      setLine(
        `${pick(NAMES, s)} من ${pick([...BRAND.cities], s + 2)} طلب عرض من ${(s % 20) + 3} دقيقة`
      );
    }, 6000);
    return () => window.clearInterval(t);
  }, []);

  if (!line) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/10 px-3 py-2.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
      <p className="text-xs font-semibold text-teal-100/90">{line}</p>
    </div>
  );
}

export function TodayCounter() {
  const d = new Date();
  const count = 28 + (d.getDate() % 11) * 3 + Math.floor(d.getHours() / 2);

  return (
    <p className="text-center text-xs font-bold text-white/45">
      <span className="text-teal-300">{count}+</span> شخص طلبوا عرض اليوم
    </p>
  );
}

export function SlotsLeft() {
  const slots = Math.max(4, 14 - (new Date().getHours() % 10));

  return (
    <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-center text-xs font-bold text-amber-200">
      باقي <span className="font-mono text-sm text-amber-100">{slots}</span>{" "}
      مقاعد مجانية اليوم
    </p>
  );
}

export function TopUrgencyBar() {
  return (
    <div className="border-b border-teal-400/15 bg-teal-400/10 px-3 py-1.5 text-center text-[11px] font-bold text-teal-200 md:py-2 md:text-xs">
      عرض مجاني · ما عليك التزام · بيكلمك مندوب
    </div>
  );
}
