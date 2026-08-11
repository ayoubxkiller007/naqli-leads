export const BRAND = {
  nameAr: "نَقْلِي",
  nameEn: "Naqli",
  city: "جدة",
  country: "السعودية",
  tagline: "عروض نقل عفش مجانية من شركات معتمدة",
  phone: "0500000000",
  phoneDisplay: "050 000 0000",
  phoneTel: "+966500000000",
  whatsapp: "966500000000",
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
