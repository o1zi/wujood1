"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { z } from "zod";

const ContentBlockSchema = z.object({
  type: z.enum(["service", "feature"]),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  is_published: z.boolean().default(true),
});

export async function createContentBlock(formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const parsed = ContentBlockSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description") || null,
    icon: formData.get("icon") || null,
    is_published: formData.get("is_published") !== "false",
  });

  if (!parsed.success) return { error: "بيانات غير صالحة" };

  const { error } = await supabase
    .from("content_blocks")
    .insert({ ...parsed.data, tenant_id: tenant.id });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function updateContentBlock(id: string, formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const parsed = ContentBlockSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description") || null,
    icon: formData.get("icon") || null,
    is_published: formData.get("is_published") !== "false",
  });

  if (!parsed.success) return { error: "بيانات غير صالحة" };

  const { error } = await supabase
    .from("content_blocks")
    .update(parsed.data)
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function deleteContentBlock(id: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { error } = await supabase
    .from("content_blocks")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  return { success: true };
}

// ── Stats ──────────────────────────────────────────────────────────────────

export async function upsertStat(id: string | null, formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const data = {
    tenant_id: tenant.id,
    value: Number(formData.get("value")),
    prefix: (formData.get("prefix") as string) || null,
    suffix: (formData.get("suffix") as string) || null,
    label: formData.get("label") as string,
  };

  if (id) {
    await supabase.from("tenant_stats").update(data).eq("id", id).eq("tenant_id", tenant.id);
  } else {
    await supabase.from("tenant_stats").insert(data);
  }

  revalidatePath("/dashboard/stats");
  return { success: true };
}

export async function deleteStat(id: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();
  await supabase.from("tenant_stats").delete().eq("id", id).eq("tenant_id", tenant.id);
  revalidatePath("/dashboard/stats");
  return { success: true };
}

// ── Testimonials ───────────────────────────────────────────────────────────

export async function upsertTestimonial(id: string | null, formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const data = {
    tenant_id: tenant.id,
    client_name: formData.get("client_name") as string,
    client_role: (formData.get("client_role") as string) || null,
    text: formData.get("text") as string,
    rating: formData.get("rating") ? Number(formData.get("rating")) : null,
    is_published: formData.get("is_published") !== "false",
  };

  if (id) {
    await supabase.from("tenant_testimonials").update(data).eq("id", id).eq("tenant_id", tenant.id);
  } else {
    await supabase.from("tenant_testimonials").insert(data);
  }

  revalidatePath("/dashboard/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();
  await supabase.from("tenant_testimonials").delete().eq("id", id).eq("tenant_id", tenant.id);
  revalidatePath("/dashboard/testimonials");
  return { success: true };
}

// ── FAQs ───────────────────────────────────────────────────────────────────

export async function upsertFaq(id: string | null, formData: FormData) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const data = {
    tenant_id: tenant.id,
    question: formData.get("question") as string,
    answer: formData.get("answer") as string,
    is_published: formData.get("is_published") !== "false",
  };

  if (id) {
    await supabase.from("tenant_faqs").update(data).eq("id", id).eq("tenant_id", tenant.id);
  } else {
    await supabase.from("tenant_faqs").insert(data);
  }

  revalidatePath("/dashboard/faqs");
  return { success: true };
}

export async function deleteFaq(id: string) {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();
  await supabase.from("tenant_faqs").delete().eq("id", id).eq("tenant_id", tenant.id);
  revalidatePath("/dashboard/faqs");
  return { success: true };
}
