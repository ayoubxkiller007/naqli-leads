import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { flagEmoji } from "@/lib/geo";
import { listLeads } from "@/lib/leads-store";
import {
  formProgress,
  isOnline,
  listChats,
  loadStore,
} from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  browsing: "يتصفح",
  viewing_form: "شاف الفورم",
  filling_form: "يعبّي الفورم",
  submitted: "أرسل اللياد",
  thank_you: "صفحة شكر",
};

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [store, leads, chats] = await Promise.all([
    loadStore(),
    listLeads(),
    listChats(),
  ]);
  const now = Date.now();

  const visitors = Object.values(store.visitors)
    .filter((v) => !v.path.startsWith("/admin"))
    .map((v) => {
      const progress = formProgress(v.formDraft);
      return {
        ...v,
        flag: flagEmoji(v.country),
        online: isOnline(v.lastSeen, 60_000),
        secondsAgo: Math.max(
          0,
          Math.round((now - +new Date(v.lastSeen)) / 1000)
        ),
        stageLabel: STAGE_LABELS[v.stage] || v.stage,
        formFilled: progress.filled,
        formTotal: progress.total,
        formLabels: progress.labels,
        inForm: ["viewing_form", "filling_form"].includes(v.stage),
      };
    })
    .sort((a, b) => +new Date(b.lastSeen) - +new Date(a.lastSeen));

  const live = visitors.filter((v) => v.online);
  const byId = Object.fromEntries(visitors.map((v) => [v.id, v]));

  const chatThreads = chats.slice(0, 50).map((c) => {
    const v = byId[c.visitorId];
    return {
      ...c,
      visitor: v
        ? {
            id: v.id,
            ip: v.ip,
            country: v.country,
            city: v.city,
            flag: v.flag,
            online: v.online,
            path: v.path,
            name: v.formDraft?.name,
            phone: v.formDraft?.phone,
            stage: v.stage,
            stageLabel: v.stageLabel,
            inForm: v.inForm,
            formFilled: v.formFilled,
            formTotal: v.formTotal,
            formLabels: v.formLabels,
            submittedLead: v.submittedLead,
          }
        : {
            id: c.visitorId,
            ip: "—",
            country: "ZZ",
            flag: "🌐",
            online: false,
            path: "—",
          },
      lastMessage: c.messages[c.messages.length - 1] || null,
    };
  });

  const unreadChats = chatThreads.reduce((n, c) => n + (c.unreadAdmin || 0), 0);

  return NextResponse.json({
    stats: {
      live: live.length,
      visitors: visitors.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      todayLeads: leads.filter(
        (l) => now - +new Date(l.createdAt) < 24 * 60 * 60 * 1000
      ).length,
      totalLeads: leads.length,
      chats: unreadChats,
      inForm: live.filter((v) => v.inForm).length,
    },
    live,
    visitors: visitors.slice(0, 80),
    leads: leads.slice(0, 100).map((l) => ({
      ...l,
      flag: flagEmoji(l.country || "SA"),
    })),
    chats: chatThreads,
  });
}
