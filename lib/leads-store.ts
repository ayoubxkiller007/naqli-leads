import type { Lead } from "./lead-types";
import { loadStore, saveStore } from "./visitor-store";

export type { Lead };

export async function saveLead(
  input: Omit<Lead, "id" | "createdAt" | "status">
) {
  const data = await loadStore();
  const lead: Lead = {
    ...input,
    id: `NQ-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  data.leads.unshift(lead);
  await saveStore(data);
  return lead;
}

export async function listLeads() {
  return (await loadStore()).leads;
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  const data = await loadStore();
  const i = data.leads.findIndex((l) => l.id === id);
  if (i < 0) return null;
  data.leads[i] = { ...data.leads[i], status };
  await saveStore(data);
  return data.leads[i];
}

export async function deleteLead(id: string) {
  const data = await loadStore();
  const before = data.leads.length;
  data.leads = data.leads.filter((l) => l.id !== id);
  if (data.leads.length === before) return false;
  await saveStore(data);
  return true;
}

export async function clearLeads() {
  const data = await loadStore();
  const n = data.leads.length;
  data.leads = [];
  await saveStore(data);
  return n;
}
