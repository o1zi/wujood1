import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Tenant } from "@/lib/types";
import ModernTemplate from "@/templates/modern";
import ClassicTemplate from "@/templates/classic";
import HeritageTemplate from "@/templates/heritage";
import MinimalTemplate from "@/templates/minimal";
import LuxuryTemplate from "@/templates/luxury";
import StudioTemplate from "@/templates/studio";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: t } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();
  const tenantMeta = t as Tenant | null;
  if (!tenantMeta) return {};
  return {
    title: tenantMeta.name_ar,
    description: tenantMeta.about_ar?.slice(0, 160) ?? undefined,
    openGraph: { title: tenantMeta.name_ar, images: tenantMeta.logo_url ? [tenantMeta.logo_url] : [] },
  };
}

export default async function SitePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();
  const tenant = raw as Tenant | null;

  if (!tenant) notFound();

  const [
    { data: projects },
    { data: services },
    { data: features },
    { data: stats },
    { data: testimonials },
    { data: faqs },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("tenant_id", tenant.id)
      .is("deleted_at", null)
      .order("display_order"),
    supabase
      .from("content_blocks")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("type", "service")
      .eq("is_published", true)
      .order("display_order"),
    supabase
      .from("content_blocks")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("type", "feature")
      .eq("is_published", true)
      .order("display_order"),
    supabase
      .from("tenant_stats")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("display_order"),
    supabase
      .from("tenant_testimonials")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("is_published", true)
      .order("display_order"),
    supabase
      .from("tenant_faqs")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("is_published", true)
      .order("display_order"),
  ]);

  const props = {
    tenant,
    projects: projects ?? [],
    services: services ?? [],
    features: features ?? [],
    stats: stats ?? [],
    testimonials: testimonials ?? [],
    faqs: faqs ?? [],
  };

  switch (tenant.current_template) {
    case "classic":  return <ClassicTemplate  {...props} />;
    case "heritage": return <HeritageTemplate {...props} />;
    case "minimal":  return <MinimalTemplate  {...props} />;
    case "luxury":   return <LuxuryTemplate   {...props} />;
    case "studio":   return <StudioTemplate   {...props} />;
    default:         return <ModernTemplate   {...props} />;
  }
}
