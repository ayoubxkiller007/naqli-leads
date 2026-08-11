import { NextRequest, NextResponse } from "next/server";
import {
  checkCredentials,
  clearAdminSession,
  setAdminSession,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!checkCredentials(String(body.user || ""), String(body.pass || ""))) {
    return NextResponse.json({ error: "خطأ في الدخول" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
