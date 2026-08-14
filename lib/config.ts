export const BRAND = {
  nameAr: "نَقْلِي",
  nameEn: "Naql",
  legalName: "Ayoub Elamiry",
  city: "جدة",
  country: "السعودية",
  operatorCountry: "Morocco",
  operatorCity: "Casablanca",
  addressLine: "Hay Mohammadi, 3 N 21, Casablanca 20350, Morocco",
  addressAr: "حي المحمدي، رقم 3 ن 21، الدار البيضاء 20350، المغرب",
  tagline: "نقل عفش — عروض مجانية من شركات معتمدة",
  whatsapp: "212704497048",
  whatsappDisplay: "+212 704-497048",
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
