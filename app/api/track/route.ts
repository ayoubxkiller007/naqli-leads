import { NextRequest, NextResponse } from "next/server";
import { clientIp, countryFromHeaders, lookupGeo } from "@/lib/geo";
import { upsertVisitor } from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    id?: string;
    path?: string;
    referrer?: string;
    stage?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = (body.id || "").slice(0, 64);
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const ip = clientIp(req);
  const headerCountry = countryFromHeaders(req);
  const geo = await lookupGeo(ip, headerCountry);

  const visitor = await upsertVisitor({
    id,
    ip,
    country: geo.country,
    city: geo.city,
    region: geo.region,
    path: (body.path || "/").slice(0, 200),
    referrer: body.referrer?.slice(0, 300),
    userAgent: req.headers.get("user-agent") || undefined,
    stage: body.stage?.slice(0, 40),
  });

  return NextResponse.json({
    ok: true,
    country: visitor.country,
  });
}
