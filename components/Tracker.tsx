"use client";

import { useEffect } from "react";

const KEY = "naqli_vid";

function visitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v_${Date.now()}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
}

function ping(stage?: string) {
  if (typeof window === "undefined") return;
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: visitorId(),
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      stage:
        stage ||
        (window.location.pathname.startsWith("/thank-you")
          ? "thank_you"
          : "browsing"),
    }),
    keepalive: true,
  }).catch(() => {});
}

/** Heartbeat tracker — mounts in layout */
export function Tracker() {
  useEffect(() => {
    ping();
    const t = window.setInterval(() => ping(), 15000);
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
