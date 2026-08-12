"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/config";

const NAMES = [
  "فهد", "نورة", "سلمان", "ريم", "عبدالله", "سارة", "خالد", "منى",
  "تركي", "هيفاء", "ماجد", "لينا", "يوسف", "دانة", "فيصل",
];

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function minsAgo(seed: number) {
  return (seed % 47) + 2;
}

export function LiveActivity() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 4000);
    return () => window.clearInterval(t);
  }, []);

  const seed = tick + new Date().getDate();
  const name = pick(NAMES, seed);
  const city = pick([...BRAND.cities], seed + 3);
  const mins = minsAgo(seed);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/10 px-3 py-2.5">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </span>
      <p className="text-xs font-semibold text-teal-100/90">
        <strong className="text-white">{name}</strong> من {city} طلب عرض من{" "}
        <span className="font-mono text-teal-200">{mins}</span> دقيقة
      </p>
    </div>
  );
}

export function TodayCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const d = new Date();
    const base = 28 + (d.getDate() % 11) * 3 + Math.floor(d.getHours() / 2);
    setCount(base);
  }, []);

  if (count === null) return null;

  return (
    <p className="text-center text-xs font-bold text-white/45">
      🔥{" "}
      <span className="text-teal-300">{count}+</span> شخص طلبوا عرض اليوم في
      السعودية
    </p>
  );
}

export function SlotsLeft() {
  const [slots, setSlots] = useState<number | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    setSlots(Math.max(4, 14 - (h % 10)));
  }, []);

  if (slots === null) return null;

  return (
    <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-center text-xs font-bold text-amber-200">
      ⚡ باقي{" "}
      <span className="font-mono text-sm text-amber-100">{slots}</span> مقاعد
      مجانية اليوم — اطلب الحين
    </p>
  );
}

export function TopUrgencyBar() {
  return (
    <div className="border-b border-teal-400/20 bg-teal-400/10 px-4 py-2 text-center text-xs font-bold text-teal-200">
      🎁 عرض مجاني · ما عليك التزام · بيكلمك مندوب خلال دقايق
    </div>
  );
}
