"use client";

import { useEffect, useState } from "react";
import { trackVisitor } from "@/lib/visitor-client";

export function ThankYouTracker() {
  useEffect(() => {
    trackVisitor({
      path: "/thank-you",
      stage: "thank_you",
      activity: "وصل صفحة الشكر",
    });
  }, []);
  return null;
}

export function CallCountdown() {
  const [mins, setMins] = useState(12);

  useEffect(() => {
    const start = Date.now();
    const t = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 60_000);
      setMins(Math.max(3, 12 - elapsed));
    }, 30_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <p className="mt-2 text-sm font-bold text-teal-200">
      ⏱ المتوقع: يكلمك خلال{" "}
      <span className="font-mono text-base text-white">{mins}</span> دقيقة
    </p>
  );
}
