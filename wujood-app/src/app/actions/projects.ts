"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { PLANS } from "@/lib/constants";
import { z } from "zod";

const ProjectSchema = z.object({
  title_ar: z.string().min(1).max(300),
  title_en: z.string().max(300).optional().nullable(),
  description_ar: z.string().max(2000).optional().nullable(),
  description_en: z.string().max(2000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  is_featured: z.boolean().optional().default(false),
  price: z.coerce.number().optional().nullable(),
  area_sqm: z.coerce.number().optional().nullable(),
  status: z.string().max(100).optional().nullable(),
  rooms: z.coerce.number().int().optional().nullable(),
  bathrooms: z.coerce.number().int().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export async function createProject(formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  // Enforce project limit
  const planConfig = PLANS[tenant.plan];
  if (planConfig.projects !== Infinity) {
    const { count } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenant.id)
      .is("deleted_at", null);

    if ((count ?? 0) >= planConfig.projects) {
      return { error: `باقتك تسمح بـ ${planConfig.projects} مشاريع فقط. يرجى الترقية لإضافة المزيد.` };
    }
  }

  const raw = {
    title_ar: formData.get("title_ar") as string,
    title_en: (formData.get("title_en") as string) || null,
    description_ar: (formData.get("description_ar") as string) || null,
    description_en: (formData.get("description_en") as string) || null,
    category: (formData.get("category") as string) || null,
    location: (formData.get("location") as string) || null,
    year: formData.get("year") ? Number(formData.get("year")) : null,
    is_featured: formData.get("is_featured") === "true",
    price: formData.get("price") ? Number(formData.get("price")) : null,
    area_sqm: formData.get("area_sqm") ? Number(formData.get("area_sqm")) : null,
    status: (formData.get("status") as string) || null,
    rooms: formData.get("rooms") ? Number(formData.get("rooms")) : null,
    bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean) : null,
  };

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) return { error: "بيانات غير صالحة" };

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/projects");
  return { success: true, id: data.id };
}

export async function updateProject(id: string, formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const raw = {
    title_ar: formData.get("title_ar") as string,
    title_en: (formData.get("title_en") as string) || null,
    description_ar: (formData.get("description_ar") as string) || null,
    description_en: (formData.get("description_en") as string) || null,
    category: (formData.get("category") as string) || null,
    location: (formData.get("location") as string) || null,
    year: formData.get("year") ? Number(formData.get("year")) : null,
    is_featured: formData.get("is_featured") === "true",
    price: formData.get("price") ? Number(formData.get("price")) : null,
    area_sqm: formData.get("area_sqm") ? Number(formData.get("area_sqm")) : null,
    status: (formData.get("status") as string) || null,
    rooms: formData.get("rooms") ? Number(formData.get("rooms")) : null,
    bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean) : null,
  };

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) return { error: "بيانات غير صالحة" };

  const { error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
  return { success: true };
}

export async function deleteProject(id: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function reorderProjects(orderedIds: string[]) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("projects")
      .update({ display_order: index })
      .eq("id", id)
      .eq("tenant_id", tenant.id)
  );

  await Promise.all(updates);
  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function setCoverImage(projectId: string, coverUrl: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ cover_url: coverUrl })
    .eq("id", projectId)
    .eq("tenant_id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function addProjectImage(projectId: string, url: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  // Enforce max images per project
  const { count } = await supabase
    .from("project_images")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if ((count ?? 0) >= 20) {
    return { error: "الحد الأقصى هو 20 صورة لكل مشروع" };
  }

  const { error } = await supabase
    .from("project_images")
    .insert({ project_id: projectId, tenant_id: tenant.id, url });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function deleteProjectImage(imageId: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { data: img } = await supabase
    .from("project_images")
    .select("url")
    .eq("id", imageId)
    .eq("tenant_id", tenant.id)
    .single();

  if (!img) return { error: "الصورة غير موجودة" };

  await supabase.from("project_images").delete().eq("id", imageId).eq("tenant_id", tenant.id);

  // Delete from storage
  const supabaseAdmin = await createClient();
  const path = img.url.split("/storage/v1/object/public/tenants/")[1];
  if (path) {
    await supabaseAdmin.storage.from("tenants").remove([path]);
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}
