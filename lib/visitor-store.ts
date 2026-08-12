import { promises as fs } from "fs";
import path from "path";
import type { Lead } from "./lead-types";

export type FormDraft = {
  name?: string;
  phone?: string;
  city?: string;
  moveType?: string;
  fromArea?: string;
  toArea?: string;
  notes?: string;
  updatedAt?: string;
};

export type Visitor = {
  id: string;
  ip: string;
  country: string;
  city?: string;
  region?: string;
  path: string;
  firstSeen: string;
  lastSeen: string;
  referrer?: string;
  userAgent?: string;
  stage: string;
  formDraft?: FormDraft;
  submittedLead?: boolean;
  activity?: string[];
};

export type ChatMessage = {
  id: string;
  from: "visitor" | "admin";
  text: string;
  at: string;
};

export type ChatThread = {
  visitorId: string;
  messages: ChatMessage[];
  updatedAt: string;
  unreadAdmin: number;
  unreadVisitor: number;
};

type Store = {
  visitors: Record<string, Visitor>;
  leads: Lead[];
  chats: Record<string, ChatThread>;
};

const MAX_VISITORS = 200;
const MAX_CHATS = 100;
const MAX_MESSAGES = 80;
const memory: Store = { visitors: {}, leads: [], chats: {} };

function filePath() {
  return path.join(process.cwd(), "data", "store.json");
}

async function readFs(): Promise<Store> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const p = JSON.parse(raw) as Store;
    return {
      visitors: p.visitors || {},
      leads: p.leads || [],
      chats: p.chats || {},
    };
  } catch {
    try {
      const old = path.join(process.cwd(), "data", "leads.json");
      const raw = await fs.readFile(old, "utf8");
      const p = JSON.parse(raw) as { leads?: Lead[] };
      return { visitors: {}, leads: p.leads || [], chats: {} };
    } catch {
      return { visitors: {}, leads: [], chats: {} };
    }
  }
}

async function writeFs(data: Store) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(data, null, 2));
}

async function getBlobStore() {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: "naqli-leads", consistency: "strong" });
  } catch {
    return null;
  }
}

export async function loadStore(): Promise<Store> {
  const blobs = await getBlobStore();
  if (blobs) {
    try {
      const data = await blobs.get("store", { type: "json" });
      if (data && typeof data === "object") {
        const d = data as Store;
        return {
          visitors: d.visitors || {},
          leads: d.leads || [],
          chats: d.chats || {},
        };
      }
    } catch {}
  }
  if (process.env.NETLIFY) {
    return {
      visitors: { ...memory.visitors },
      leads: [...memory.leads],
      chats: { ...memory.chats },
    };
  }
  return readFs();
}

export async function saveStore(data: Store) {
  const vList = Object.values(data.visitors).sort(
    (a, b) => +new Date(b.lastSeen) - +new Date(a.lastSeen)
  );
  data.visitors = Object.fromEntries(
    vList.slice(0, MAX_VISITORS).map((v) => [v.id, v])
  );
  data.leads = data.leads.slice(0, 500);
  if (!data.chats) data.chats = {};
  const chatList = Object.values(data.chats).sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
  data.chats = Object.fromEntries(
    chatList.slice(0, MAX_CHATS).map((c) => [c.visitorId, c])
  );
  memory.visitors = data.visitors;
  memory.leads = data.leads;
  memory.chats = data.chats;

  const blobs = await getBlobStore();
  if (blobs) {
    try {
      await blobs.setJSON("store", data);
      return;
    } catch (e) {
      console.error("Blob save failed:", e);
    }
  }
  if (!process.env.NETLIFY) {
    try {
      await writeFs(data);
    } catch (e) {
      console.error("FS save failed:", e);
    }
  }
}

function pushActivity(visitor: Visitor, text: string, at: string) {
  if (!visitor.activity) visitor.activity = [];
  visitor.activity.push(`${at.slice(11, 19)} ${text}`);
  if (visitor.activity.length > 12) {
    visitor.activity = visitor.activity.slice(-12);
  }
}

export async function upsertVisitor(input: {
  id: string;
  ip: string;
  country: string;
  city?: string;
  region?: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  stage?: string;
  formDraft?: FormDraft;
  activity?: string;
  submittedLead?: boolean;
}) {
  const data = await loadStore();
  const now = new Date().toISOString();
  const existing = data.visitors[input.id];
  if (!existing) {
    data.visitors[input.id] = {
      id: input.id,
      ip: input.ip,
      country: input.country || "ZZ",
      city: input.city,
      region: input.region,
      path: input.path,
      firstSeen: now,
      lastSeen: now,
      referrer: input.referrer,
      userAgent: input.userAgent,
      stage: input.stage || "browsing",
      formDraft: input.formDraft,
      submittedLead: input.submittedLead,
      activity: input.activity ? [input.activity] : [],
    };
  } else {
    existing.ip = input.ip || existing.ip;
    existing.country = input.country || existing.country;
    existing.city = input.city || existing.city;
    existing.region = input.region || existing.region;
    existing.path = input.path || existing.path;
    existing.lastSeen = now;
    if (input.referrer) existing.referrer = input.referrer;
    if (input.userAgent) existing.userAgent = input.userAgent;
    if (input.submittedLead) existing.submittedLead = true;
    if (input.formDraft) {
      existing.formDraft = {
        ...existing.formDraft,
        ...input.formDraft,
        updatedAt: now,
      };
    }
    if (input.activity) pushActivity(existing, input.activity, now);
    if (input.stage) {
      const rank: Record<string, number> = {
        browsing: 1,
        viewing_form: 2,
        filling_form: 3,
        submitted: 4,
        thank_you: 5,
      };
      const cur = rank[existing.stage] || 0;
      const next = rank[input.stage] || 0;
      if (next >= cur || input.stage === "browsing") {
        existing.stage = input.stage;
      }
    }
    data.visitors[input.id] = existing;
  }
  await saveStore(data);
  return data.visitors[input.id];
}

export function isOnline(lastSeen: string, withinMs = 60_000) {
  return Date.now() - +new Date(lastSeen) < withinMs;
}

function makeMsgId() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function appendChatMessage(input: {
  visitorId: string;
  from: "visitor" | "admin";
  text: string;
}) {
  const text = input.text.trim().slice(0, 1000);
  if (!text || !input.visitorId) return null;

  const data = await loadStore();
  if (!data.chats) data.chats = {};
  const now = new Date().toISOString();
  const thread =
    data.chats[input.visitorId] ||
    ({
      visitorId: input.visitorId,
      messages: [],
      updatedAt: now,
      unreadAdmin: 0,
      unreadVisitor: 0,
    } satisfies ChatThread);

  const msg: ChatMessage = {
    id: makeMsgId(),
    from: input.from,
    text,
    at: now,
  };
  thread.messages.push(msg);
  if (thread.messages.length > MAX_MESSAGES) {
    thread.messages = thread.messages.slice(-MAX_MESSAGES);
  }
  thread.updatedAt = now;
  if (input.from === "visitor") {
    thread.unreadAdmin += 1;
    const v = data.visitors[input.visitorId];
    if (v) {
      v.lastSeen = now;
      pushActivity(v, `شات: ${text.slice(0, 50)}`, now);
      data.visitors[input.visitorId] = v;
    }
  } else {
    thread.unreadVisitor += 1;
  }
  data.chats[input.visitorId] = thread;
  await saveStore(data);
  return thread;
}

export async function getChat(visitorId: string) {
  const data = await loadStore();
  return data.chats?.[visitorId] || null;
}

export async function listChats() {
  const data = await loadStore();
  return Object.values(data.chats || {}).sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
}

export async function markChatRead(
  visitorId: string,
  who: "admin" | "visitor"
) {
  const data = await loadStore();
  const thread = data.chats?.[visitorId];
  if (!thread) return null;
  if (who === "admin") thread.unreadAdmin = 0;
  else thread.unreadVisitor = 0;
  data.chats[visitorId] = thread;
  await saveStore(data);
  return thread;
}

export function formProgress(draft?: FormDraft) {
  if (!draft) return { filled: 0, total: 6, labels: [] as string[] };
  const checks = [
    ["الاسم", Boolean(draft.name?.trim())],
    ["الجوال", (draft.phone?.replace(/\D/g, "") ?? "").length >= 9],
    ["المدينة", Boolean(draft.city?.trim())],
    ["نوع النقل", Boolean(draft.moveType?.trim())],
    ["من/إلى", Boolean(draft.fromArea?.trim() || draft.toArea?.trim())],
    ["ملاحظات", Boolean(draft.notes?.trim())],
  ] as const;
  const labels = checks.filter(([, ok]) => ok).map(([l]) => l);
  return { filled: labels.length, total: checks.length, labels };
}
