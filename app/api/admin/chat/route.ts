import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  appendChatMessage,
  getChat,
  markChatRead,
} from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const visitorId = req.nextUrl.searchParams.get("visitorId") || "";
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId required" }, { status: 400 });
  }
  const mark = req.nextUrl.searchParams.get("markRead") === "1";
  if (mark) await markChatRead(visitorId, "admin");
  const thread = await getChat(visitorId);
  return NextResponse.json({
    messages: thread?.messages || [],
    unreadAdmin: thread?.unreadAdmin || 0,
    updatedAt: thread?.updatedAt || null,
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const visitorId = String(body.visitorId || "").slice(0, 64);
  const text = String(body.text || "");
  if (!visitorId || !text.trim()) {
    return NextResponse.json(
      { error: "visitorId and text required" },
      { status: 400 }
    );
  }
  const thread = await appendChatMessage({
    visitorId,
    from: "admin",
    text,
  });
  await markChatRead(visitorId, "admin");
  return NextResponse.json({
    ok: true,
    messages: thread?.messages || [],
  });
}
