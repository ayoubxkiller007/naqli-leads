import { NextRequest, NextResponse } from "next/server";
import { clientIp, countryFromHeaders, lookupGeo } from "@/lib/geo";
import {
  appendChatMessage,
  getChat,
  markChatRead,
  upsertVisitor,
} from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const visitorId = req.nextUrl.searchParams.get("visitorId") || "";
  if (!visitorId) {
    return NextResponse.json({ error: "visitorId required" }, { status: 400 });
  }
  const thread = await getChat(visitorId);
  if (thread?.unreadVisitor) {
    await markChatRead(visitorId, "visitor");
  }
  return NextResponse.json({
    messages: thread?.messages || [],
    updatedAt: thread?.updatedAt || null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const visitorId = String(body.visitorId || "").slice(0, 64);
  const text = String(body.text || "");
  if (!visitorId || !text.trim()) {
    return NextResponse.json(
      { error: "visitorId and text required" },
      { status: 400 }
    );
  }

  const ip = clientIp(req);
  const headerCountry = countryFromHeaders(req);
  const geo = await lookupGeo(ip, headerCountry);
  await upsertVisitor({
    id: visitorId,
    ip,
    country: geo.country,
    city: geo.city,
    region: geo.region,
    path: String(body.path || "/").slice(0, 200),
    userAgent: req.headers.get("user-agent") || undefined,
    activity: "أرسل رسالة شات",
  });

  const thread = await appendChatMessage({
    visitorId,
    from: "visitor",
    text,
  });

  return NextResponse.json({
    ok: true,
    messages: thread?.messages || [],
  });
}
