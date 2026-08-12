"use client";

import { useEffect } from "react";
import { getVisitorId, trackVisitor } from "@/lib/visitor-client";

/** Heartbeat — slower on mobile to stay light */
export function Tracker() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    getVisitorId();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const ms = mobile ? 20_000 : 10_000;

    const ping = () => {
      const path = window.location.pathname + window.location.search;
      if (path.startsWith("/admin")) return;
      trackVisitor({
        path,
        stage: path.startsWith("/thank-you") ? "thank_you" : "browsing",
      });
    };
    ping();
    const t = window.setInterval(ping, ms);
    const onVis = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return null;
}
