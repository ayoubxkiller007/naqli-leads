import { promises as fs } from "fs";
import path from "path";
import type { Lead } from "./lead-types";

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
};

type Store = {
  visitors: Record<string, Visitor>;
  leads: Lead[];
};

const MAX_VISITORS = 200;
const memory: Store = { visitors: {}, leads: [] };

function filePath() {
  return path.join(process.cwd(), "data", "store.json");
}

async function readFs(): Promise<Store> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const p = JSON.parse(raw) as Store;
    return { visitors: p.visitors || {}, leads: p.leads || [] };
  } catch {
    // migrate old leads.json if present
    try {
      const old = path.join(process.cwd(), "data", "leads.json");
      const raw = await fs.readFile(old, "utf8");
      const p = JSON.parse(raw) as { leads?: Lead[] };
      return { visitors: {}, leads: p.leads || [] };
    } catch {
      return { visitors: {}, leads: [] };
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
        return { visitors: d.visitors || {}, leads: d.leads || [] };
      }
    } catch {}
  }
  if (process.env.NETLIFY) {
    return {
      visitors: { ...memory.visitors },
      leads: [...memory.leads],
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
  memory.visitors = data.visitors;
  memory.leads = data.leads;

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
    if (input.stage) existing.stage = input.stage;
    data.visitors[input.id] = existing;
  }
  await saveStore(data);
  return data.visitors[input.id];
}

export function isOnline(lastSeen: string, withinMs = 60_000) {
  return Date.now() - +new Date(lastSeen) < withinMs;
}
