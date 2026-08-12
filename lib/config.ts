export const BRAND = {
  nameAr: "نَقْلِي",
  nameEn: "Naqli",
  city: "جدة",
  country: "السعودية",
  tagline: "نقل عفش — عروض مجانية من شركات معتمدة",
  /** WhatsApp only — used in wa.me links, never shown as visible text on the site */
  whatsapp: "212704497048",
  cities: ["جدة", "الرياض", "الدمام", "مكة", "الطائف", "الخبر", "المدينة"],
};

export const MOVE_TYPES = [
  "شقة / بيت كامل",
  "غرفة واحدة",
  "مكتب / محل",
  "نقل داخل نفس المدينة",
  "نقل بين مدن",
  "فك وتركيب أثاث فقط",
] as const;

export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "naqli2026";
