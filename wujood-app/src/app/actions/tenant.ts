"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { z } from "zod";

const TenantInfoSchema = z.object({
  name_ar: z.string().min(2).max(200),
  name_en: z.string().max(200).optional().nullable(),
  about_ar: z.string().max(2000).optional().nullable(),
  about_en: z.string().max(2000).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  address_ar: z.string().max(500).optional().nullable(),
  address_en: z.string().max(500).optional().nullable(),
  maps_url: z.string().url().optional().nullable().or(z.literal("")),
  whatsapp_note: z.string().max(500).optional().nullable(),
  social: z.object({
    instagram: z.string().max(100).optional().default(""),
    twitter: z.string().max(100).optional().default(""),
    linkedin: z.string().max(200).optional().default(""),
    snapchat: z.string().max(100).optional().default(""),
    tiktok: z.string().max(100).optional().default(""),
  }).optional().nullable(),
});

export async function updateTenantInfo(formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const raw = {
    name_ar: formData.get("name_ar") as string,
    name_en: (formData.get("name_en") as string) || null,
    about_ar: (formData.get("about_ar") as string) || null,
    about_en: (formData.get("about_en") as string) || null,
    phone: (formData.get("phone") as string) || null,
    whatsapp: (formData.get("whatsapp") as string) || null,
    email: (formData.get("email") as string) || null,
    address_ar: (formData.get("address_ar") as string) || null,
    address_en: (formData.get("address_en") as string) || null,
    maps_url: (formData.get("maps_url") as string) || null,
    whatsapp_note: (formData.get("whatsapp_note") as string) || null,
    social: {
      instagram: (formData.get("instagram") as string) || "",
      twitter: (formData.get("twitter") as string) || "",
      linkedin: (formData.get("linkedin") as string) || "",
      snapchat: (formData.get("snapchat") as string) || "",
      tiktok: (formData.get("tiktok") as string) || "",
    },
  };

  const parsed = TenantInfoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "بيانات غير صالحة" };
  }

  const { error } = await supabase
    .from("tenants")
    .update(parsed.data)
    .eq("id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/info");
  return { success: true };
}

export async function updateTenantTemplate(templateId: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { error } = await supabase
    .from("tenants")
    .update({ current_template: templateId })
    .eq("id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/theme");
  return { success: true };
}

export async function updateTenantThemeConfig(config: Record<string, unknown>) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { error } = await supabase
    .from("tenants")
    .update({ theme_config: config })
    .eq("id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/theme");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Redirect is handled client-side after calling this
}
