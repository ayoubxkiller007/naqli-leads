import { promises as fs } from "fs";
import path from "path";

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  moveType: string;
  fromArea?: string;
  toArea?: string;
  notes?: string;
  ip?: string;
  status: "new" | "sent" | "sold" | "spam";
};

type Store = { leads: Lead[] };
const MAX = 500;
const memory: Store = { leads: [] };

function filePath() {
  return path.join(process.cwd(), "data", "leads.json");
}

async function readFs(): Promise<Store> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return { leads: (JSON.parse(raw) as Store).leads || [] };
  } catch {
    return { leads: [] };
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

async function load(): Promise<Store> {
  const blobs = await getBlobStore();
  if (blobs) {
    try {
      const data = await blobs.get("store", { type: "json" });
      if (data && typeof data === "object") {
        return { leads: (data as Store).leads || [] };
      }
    } catch {
      // fall through
    }
  }
  if (process.env.NETLIFY) {
    return { leads: [...memory.leads] };
  }
  return readFs();
}

async function save(data: Store) {
  data.leads = data.leads.slice(0, MAX);
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

export async function saveLead(
  input: Omit<Lead, "id" | "createdAt" | "status">
) {
  const data = await load();
  const lead: Lead = {
    ...input,
    id: `NQ-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  data.leads.unshift(lead);
  await save(data);
  return lead;
}

export async function listLeads() {
  return (await load()).leads;
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  const data = await load();
  const i = data.leads.findIndex((l) => l.id === id);
  if (i < 0) return null;
  data.leads[i] = { ...data.leads[i], status };
  await save(data);
  return data.leads[i];
}

export async function deleteLead(id: string) {
  const data = await load();
  const before = data.leads.length;
  data.leads = data.leads.filter((l) => l.id !== id);
  if (data.leads.length === before) return false;
  await save(data);
  return true;
}

export async function clearLeads() {
  const data = await load();
  const n = data.leads.length;
  data.leads = [];
  await save(data);
  return n;
}
