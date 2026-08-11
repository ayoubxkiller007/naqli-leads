import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  clearLeads,
  deleteLead,
  listLeads,
  updateLeadStatus,
  type Lead,
} from "@/lib/leads-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await listLeads();
  const now = Date.now();
  return NextResponse.json({
    stats: {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      today: leads.filter(
        (l) => now - +new Date(l.createdAt) < 24 * 60 * 60 * 1000
      ).length,
    },
    leads,
  });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const status = body.status as Lead["status"];
  if (!id || !["new", "sent", "sold", "spam"].includes(status)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const lead = await updateLeadStatus(id, status);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (req.nextUrl.searchParams.get("all") === "1") {
    return NextResponse.json({ ok: true, cleared: await clearLeads() });
  }
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const ok = await deleteLead(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
