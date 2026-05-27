"use server";

import { createClient } from "@/lib/supabase/server";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { UPLOAD_LIMITS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

type UploadType = "logo" | "cover" | "projectCover" | "projectImage";

export async function uploadFile(
  file: File,
  type: UploadType,
  projectId?: string,
): Promise<{ url?: string; error?: string }> {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const limits = type === "logo" ? UPLOAD_LIMITS.logo
    : type === "cover" ? UPLOAD_LIMITS.cover
    : UPLOAD_LIMITS.projectImage;

  // Validate size
  if (file.size > limits.maxMb * 1024 * 1024) {
    return { error: `حجم الملف يتجاوز الحد المسموح (${limits.maxMb} MB)` };
  }

  // Validate format
  if (!(limits.formats as readonly string[]).includes(file.type)) {
    return { error: `صيغة الملف غير مدعومة. الصيغ المقبولة: ${limits.formats.map((f) => f.split("/")[1]).join(", ")}` };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  let path: string;

  if (type === "logo") {
    path = `${tenant.id}/logo.${ext}`;
  } else if (type === "cover") {
    path = `${tenant.id}/cover.${ext}`;
  } else if (type === "projectCover" && projectId) {
    path = `${tenant.id}/projects/${projectId}/cover.${ext}`;
  } else if (type === "projectImage" && projectId) {
    path = `${tenant.id}/projects/${projectId}/gallery/${crypto.randomUUID()}.${ext}`;
  } else {
    return { error: "نوع رفع غير صالح" };
  }

  const { error: uploadError } = await supabase.storage
    .from("tenants")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("tenants")
    .getPublicUrl(path);

  // Update tenant logo/cover directly
  if (type === "logo") {
    await supabase.from("tenants").update({ logo_url: publicUrl }).eq("id", tenant.id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/info");
  } else if (type === "cover") {
    await supabase.from("tenants").update({ cover_url: publicUrl }).eq("id", tenant.id);
    revalidatePath("/dashboard/info");
  }

  return { url: publicUrl };
}
