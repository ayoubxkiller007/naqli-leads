import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { flagEmoji } from "@/lib/geo";
import { listLeads } from "@/lib/leads-store";
import { isOnline, loadStore } from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [store, leads] = await Promise.all([loadStore(), listLeads()]);
  const now = Date.now();

  const visitors = Object.values(store.visitors)
    .map((v) => ({
      ...v,
      flag: flagEmoji(v.country),
      online: isOnline(v.lastSeen, 60_000),
      secondsAgo: Math.max(
        0,
        Math.round((now - +new Date(v.lastSeen)) / 1000)
      ),
    }))
    .sort((a, b) => +new Date(b.lastSeen) - +new Date(a.lastSeen));

  const live = visitors.filter((v) => v.online);

  return NextResponse.json({
    stats: {
      live: live.length,
      visitors: visitors.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      todayLeads: leads.filter(
        (l) => now - +new Date(l.createdAt) < 24 * 60 * 60 * 1000
      ).length,
      totalLeads: leads.length,
    },
    live,
    visitors: visitors.slice(0, 80),
    leads: leads.slice(0, 100).map((l) => ({
      ...l,
      flag: flagEmoji(l.country || "SA"),
    })),
  });
}
