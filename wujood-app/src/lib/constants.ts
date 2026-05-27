import type { Sector, Plan, SectorConfig, PlanConfig } from "./types";

export const SECTORS: Record<Sector, SectorConfig> = {
  architecture: { label: "هندسة معمارية وإنشائية", projectWord: "مشاريع", actionLabel: "استعرض مشاريعنا" },
  contractor:   { label: "مقاولات بناء",            projectWord: "مشاريع منجزة", actionLabel: "أعمالنا" },
  realestate:   { label: "تطوير عقاري",             projectWord: "وحدات سكنية", actionLabel: "استعرض الوحدات" },
  interior:     { label: "ديكور داخلي",             projectWord: "أعمال",       actionLabel: "استعرض الأعمال" },
  photo:        { label: "تصوير",                   projectWord: "بورتفوليو",   actionLabel: "استعرض الأعمال" },
  legal:        { label: "استشارات قانونية",        projectWord: "خدمات",       actionLabel: "خدماتنا" },
  medical:      { label: "عيادات طبية",             projectWord: "تخصصات",      actionLabel: "خدماتنا" },
  general:      { label: "مكتب عام",                projectWord: "أعمال",       actionLabel: "أعمالنا" },
};

export const PLANS: Record<Plan, PlanConfig & { label: string; labelAr: string }> = {
  basic: {
    label: "Basic",
    labelAr: "أساسية",
    priceYearly: 1200,
    projects: 10,
    storage_mb: 500,
    templates: ["modern"],
    customDomain: false,
  },
  pro: {
    label: "Pro",
    labelAr: "احترافية",
    priceYearly: 2000,
    projects: 30,
    storage_mb: 2000,
    templates: ["modern", "classic", "heritage", "minimal", "luxury", "studio"],
    customDomain: false,
  },
  premium: {
    label: "Premium",
    labelAr: "بريميوم",
    priceYearly: 3500,
    projects: Infinity,
    storage_mb: 10000,
    templates: ["all"],
    customDomain: true,
  },
};

export const TEMPLATES = [
  { id: "modern",   nameAr: "عصري",   nameEn: "Modern",   plan: "basic" as Plan },
  { id: "classic",  nameAr: "كلاسيكي", nameEn: "Classic", plan: "pro" as Plan },
  { id: "heritage", nameAr: "تراثي",  nameEn: "Heritage", plan: "pro" as Plan },
  { id: "minimal",  nameAr: "بسيط",   nameEn: "Minimal",  plan: "pro" as Plan },
  { id: "luxury",   nameAr: "فاخر",   nameEn: "Luxury",   plan: "pro" as Plan },
  { id: "studio",   nameAr: "ستوديو", nameEn: "Studio",   plan: "pro" as Plan },
];

export const UPLOAD_LIMITS = {
  logo:         { maxMb: 2,  formats: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"] },
  cover:        { maxMb: 5,  formats: ["image/jpeg", "image/webp"] },
  projectImage: { maxMb: 10, formats: ["image/jpeg", "image/webp"] },
  maxImagesPerProject: 20,
} as const;

export const STORAGE_LIMITS_MB: Record<Plan, number> = {
  basic:   500,
  pro:     2000,
  premium: 10000,
};

export const WHATSAPP_SUPPORT = process.env.WHATSAPP_SUPPORT_NUMBER ?? "+966500000000";

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "wujood.sa";
