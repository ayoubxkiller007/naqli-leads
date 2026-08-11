import { NextRequest } from "next/server";

export function clientIp(req: NextRequest): string {
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.split(",")[0].trim();
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "0.0.0.0";
}

export function countryFromHeaders(req: NextRequest): string {
  for (const k of [
    "x-country",
    "x-nf-country-code",
    "cf-ipcountry",
    "cloudfront-viewer-country",
  ]) {
    const v = req.headers.get(k);
    if (v && v.length === 2 && v !== "XX") return v.toUpperCase();
  }
  return "";
}

export async function lookupGeo(ip: string, headerCountry: string) {
  if (headerCountry) {
    return { country: headerCountry, city: "", region: "" };
  }
  if (
    !ip ||
    ip === "0.0.0.0" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip === "::1"
  ) {
    return { country: "ZZ", city: "Local", region: "" };
  }
  try {
    const res = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return { country: "ZZ", city: "", region: "" };
    const data = (await res.json()) as {
      country_code?: string;
      city?: string;
      region?: string;
      error?: boolean;
    };
    if (data.error) return { country: "ZZ", city: "", region: "" };
    return {
      country: (data.country_code || "ZZ").toUpperCase(),
      city: data.city || "",
      region: data.region || "",
    };
  } catch {
    return { country: "ZZ", city: "", region: "" };
  }
}

export function flagEmoji(code: string) {
  if (!code || code.length !== 2 || code === "ZZ") return "🌐";
  const cc = code.toUpperCase();
  const A = 0x1f1e6;
  return String.fromCodePoint(
    A + (cc.charCodeAt(0) - 65),
    A + (cc.charCodeAt(1) - 65)
  );
}
