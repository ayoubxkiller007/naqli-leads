import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { clientIp, countryFromHeaders, lookupGeo } from "@/lib/geo";
import type { FormDraft } from "@/lib/visitor-store";
import { upsertVisitor } from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

const STAGES = new Set([
  "browsing",
  "viewing_form",
  "filling_form",
  "submitted",
  "thank_you",
]);

export async function POST(req: NextRequest) {
  let body: {
    id?: string;
    path?: string;
    referrer?: string;
    stage?: string;
    formDraft?: FormDraft;
    activity?: string;
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

  const pagePath = (body.path || "/").slice(0, 200);
  if (pagePath.startsWith("/admin") || (await isAdminRequest())) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const ip = clientIp(req);
  const headerCountry = countryFromHeaders(req);
  const geo = await lookupGeo(ip, headerCountry);
  const stage = STAGES.has(body.stage || "") ? body.stage : undefined;

  const visitor = await upsertVisitor({
    id,
    ip,
    country: geo.country,
    city: geo.city,
    region: geo.region,
    path: pagePath,
    referrer: body.referrer?.slice(0, 300),
    userAgent: req.headers.get("user-agent") || undefined,
    stage,
    formDraft: body.formDraft,
    activity: body.activity?.slice(0, 120),
  });

  return NextResponse.json({
    ok: true,
    country: visitor.country,
  });
}
