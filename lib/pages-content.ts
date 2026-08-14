import { BRAND } from "@/lib/config";

export type PageSection = { h: string; p: string };

export type StaticPage = {
  title: string;
  description?: string;
  sections: PageSection[];
};

export const PAGES: Record<string, StaticPage> = {
  about: {
    title: "من نحن",
    description: "نَقْل — منصة طلب عروض نقل عفش، يديرها أيوب العميري",
    sections: [
      {
        h: "الجهة المشغّلة",
        p: `الاسم القانوني: ${BRAND.legalName}. الاسم التجاري: ${BRAND.nameEn} (${BRAND.nameAr}). العنوان: ${BRAND.addressAr}.`,
      },
      {
        h: "وش نقدم",
        p: `${BRAND.nameAr} منصة إلكترونية لطلب عروض نقل عفش في السعودية (جدة، الرياض، الدمام ومدن أخرى). العميل يرسل الاسم والجوال مجاناً. شركات نقل عفش مرخّصة في المملكة تتصل بالعميل وتنفّذ النقل إذا اتفقوا. ${BRAND.legalName} يشغّل الموقع والإعلانات فقط — ما نملِك شاحنات وما ننقل الأثاث بأنفسنا.`,
      },
      {
        h: "من يقدّم خدمة النقل للعميل",
        p: "خدمة النقل الفعلية يقدّمها شركاء نقل عفش مستقلون في السعودية. السعر، الموعد، والدفع يكون بين العميل وشركة النقل. تفاصيل الشريك تظهر للعميل عند الاتصال.",
      },
      {
        h: "Legal (English)",
        p: `${BRAND.nameEn} is a trade name operated by ${BRAND.legalName}, ${BRAND.addressLine}. We generate furniture-moving quote requests for customers in Saudi Arabia and pass them to licensed moving companies who provide the move.`,
      },
    ],
  },
  "how-it-works": {
    title: "كيف تعمل الخدمة",
    sections: [
      {
        h: "1 — اطلب عرضاً",
        p: "املأ النموذج: الاسم ورقم الجوال.",
      },
      {
        h: "2 — اتصال من شركة النقل",
        p: "مندوب من شركة نقل عفش في السعودية يتصل خلال دقائق ويأكد: من أين إلى أين، نوع الأثاث، التاريخ.",
      },
      {
        h: "3 — تختار وتنقل",
        p: "تستلم السعر من شركة النقل. إذا ناسبك، التنفيذ والدفع معها مباشرة — ليس مع نَقْل.",
      },
    ],
  },
  privacy: {
    title: "سياسة الخصوصية",
    description: "كيف نجمع ونستخدم ونحمي بياناتك",
    sections: [
      {
        h: "مسؤول البيانات",
        p: `${BRAND.legalName}، يشغّل ${BRAND.nameEn} (${BRAND.nameAr}). العنوان: ${BRAND.addressAr}. واتساب: ${BRAND.whatsappDisplay}.`,
      },
      {
        h: "البيانات التي نجمعها",
        p: "عند إرسال طلب عرض: الاسم، رقم الجوال، ومدينة الطلب. قد نسجل عنوان IP تقريبياً ونوع المتصفح للأمان. لا نجمع رقم هوية وطنية أو بيانات بنكية عبر الموقع.",
      },
      {
        h: "لماذا نجمعها",
        p: "لتمرير طلبك إلى شركة نقل عفش لتتصل بك، ولدعم العملاء. إعلانات Google قد تستخدم ملفات تعريف الارتباط للقياس.",
      },
      {
        h: "مشاركة البيانات",
        p: "نشارك الاسم ورقم الجوال مع شريك النقل الذي سيتصل بك فقط. لا نبيع قوائم لأطراف غير ذات صلة.",
      },
      {
        h: "حقوقك",
        p: `يمكنك طلب الاطلاع أو التصحيح أو الحذف عبر واتساب ${BRAND.whatsappDisplay} أو صفحة تواصل معنا.`,
      },
    ],
  },
  terms: {
    title: "الشروط والأحكام",
    sections: [
      {
        h: "طبيعة الخدمة",
        p: `${BRAND.nameEn} وسيط إعلانات وطلبات عروض. العقد النهائي للنقل بينك وبين شركة النقل في السعودية. المشغّل: ${BRAND.legalName}، ${BRAND.addressLine}.`,
      },
      {
        h: "مجانية الطلب",
        p: "طلب العرض عبر الموقع مجاني للعميل. أي رسوم للنقل تُدفع لشركة النقل.",
      },
      {
        h: "حدود المسؤولية",
        p: "لسنا مسؤولين عن أضرار أثاث أو تأخير أو نزاعات مع شركة النقل.",
      },
    ],
  },
  contact: {
    title: "تواصل معنا",
    sections: [
      {
        h: "المسؤول",
        p: `${BRAND.legalName} — الاسم التجاري ${BRAND.nameEn} / ${BRAND.nameAr}`,
      },
      {
        h: "العنوان",
        p: BRAND.addressAr,
      },
      {
        h: "Address (English)",
        p: BRAND.addressLine,
      },
      {
        h: "الهاتف / واتساب",
        p: BRAND.whatsappDisplay,
      },
    ],
  },
};
