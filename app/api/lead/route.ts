import { NextRequest, NextResponse } from "next/server";
import { BRAND, MOVE_TYPES } from "@/lib/config";
import { clientIp, countryFromHeaders, lookupGeo } from "@/lib/geo";
import { saveLead } from "@/lib/leads-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 80);
  const phone = String(body.phone || "").replace(/\s/g, "").slice(0, 20);
  const city = String(body.city || "").trim().slice(0, 40);
  const moveType = String(body.moveType || "").trim().slice(0, 80);
  const fromArea = String(body.fromArea || "").trim().slice(0, 80);
  const toArea = String(body.toArea || "").trim().slice(0, 80);
  const notes = String(body.notes || "").trim().slice(0, 400);

  if (name.length < 2) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) {
    return NextResponse.json({ error: "رقم جوال صحيح مطلوب" }, { status: 400 });
  }
  if (!city || !BRAND.cities.includes(city as (typeof BRAND.cities)[number])) {
    return NextResponse.json({ error: "اختر المدينة" }, { status: 400 });
  }
  if (!moveType || !(MOVE_TYPES as readonly string[]).includes(moveType)) {
    return NextResponse.json({ error: "اختر نوع النقل" }, { status: 400 });
  }

  const ip = clientIp(req);
  const geo = await lookupGeo(ip, countryFromHeaders(req));

  const lead = await saveLead({
    name,
    phone,
    city,
    moveType,
    fromArea: fromArea || undefined,
    toArea: toArea || undefined,
    notes: notes || undefined,
    ip,
    country: geo.country,
  });

  return NextResponse.json({ ok: true, id: lead.id });
}
