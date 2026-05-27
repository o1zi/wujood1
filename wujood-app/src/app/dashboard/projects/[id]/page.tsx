import { notFound } from "next/navigation";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import ProjectEditForm from "./ProjectEditForm";

export const metadata = { title: "تعديل المشروع" };

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const isNew = id === "new";

  let project = null;
  let images: { id: string; url: string; display_order: number }[] = [];

  if (!isNew) {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenant.id)
      .is("deleted_at", null)
      .single();

    if (!data) notFound();
    project = data;

    const { data: imgs } = await supabase
      .from("project_images")
      .select("id, url, display_order")
      .eq("project_id", id)
      .order("display_order");

    images = imgs ?? [];
  }

  return <ProjectEditForm tenant={tenant} project={project} images={images} />;
}
