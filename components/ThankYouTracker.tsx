"use client";

import { useEffect } from "react";
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
