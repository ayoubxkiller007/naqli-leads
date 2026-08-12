"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getVisitorId, trackVisitor } from "@/lib/visitor-client";

function isAdminPath(path: string) {
  return path.startsWith("/admin");
}

/** Heartbeat tracker — skips admin routes so you don't show as live */
export function Tracker() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (isAdminPath(pathname)) return;

    getVisitorId();
    const ping = () => {
      const path = window.location.pathname + window.location.search;
      if (isAdminPath(path)) return;
      trackVisitor({
        path,
        stage: path.startsWith("/thank-you") ? "thank_you" : "browsing",
      });
    };
    ping();
    const t = window.setInterval(ping, 8000);
    const onVis = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname]);

  return null;
}
