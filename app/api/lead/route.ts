import { NextRequest, NextResponse } from "next/server";
import { BRAND } from "@/lib/config";
import { clientIp, countryFromHeaders, lookupGeo } from "@/lib/geo";
import { saveLead } from "@/lib/leads-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 80);
  const phone = String(body.phone || "").replace(/\s/g, "").slice(0, 20);

  if (name.length < 2) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) {
    return NextResponse.json({ error: "رقم جوال صحيح مطلوب" }, { status: 400 });
  }

  const ip = clientIp(req);
  const geo = await lookupGeo(ip, countryFromHeaders(req));

  const lead = await saveLead({
    name,
    phone,
    city: BRAND.city,
    moveType: "طلب عرض — يؤكد بالمكالمة",
    ip,
    country: geo.country,
  });

  const visitorId = String(body.visitorId || "").slice(0, 64);
  if (visitorId) {
    const { upsertVisitor } = await import("@/lib/visitor-store");
    await upsertVisitor({
      id: visitorId,
      ip,
      country: geo.country,
      city: geo.city,
      region: geo.region,
      path: "/thank-you",
      stage: "submitted",
      submittedLead: true,
      activity: `أرسل لياد: ${name}`,
      formDraft: { name, phone },
    });
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
