const KEY = "naqli_vid";

export function getVisitorId() {
  if (typeof window === "undefined") return "";
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

export type TrackStage =
  | "browsing"
  | "viewing_form"
  | "filling_form"
  | "submitted"
  | "thank_you";

export type FormDraft = {
  name?: string;
  phone?: string;
  city?: string;
  moveType?: string;
  fromArea?: string;
  toArea?: string;
  notes?: string;
};

export function trackVisitor(payload: {
  path?: string;
  referrer?: string;
  stage?: TrackStage;
  formDraft?: FormDraft;
  activity?: string;
}) {
  if (typeof window === "undefined") return;
  const id = getVisitorId();
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      path:
        payload.path ?? window.location.pathname + window.location.search,
      referrer: payload.referrer ?? document.referrer ?? "",
      stage: payload.stage,
      formDraft: payload.formDraft,
      activity: payload.activity,
    }),
    keepalive: true,
  }).catch(() => {});
}
