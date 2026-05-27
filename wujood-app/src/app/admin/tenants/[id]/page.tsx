import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Tenant, SubscriptionLog } from "@/lib/types";
import TenantAdminClient from "./TenantAdminClient";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  const { data } = await supabase.from("tenants").select("name_ar").eq("id", params.id).single();
  return { title: data ? `${data.name_ar} — أدمن وجود` : "مكتب" };
}

export default async function TenantAdminPage({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();

  const { data: tenant } = await supabase.from("tenants").select("*").eq("id", params.id).single();
  if (!tenant) notFound();

  const { data: logs } = await supabase
    .from("subscription_logs")
    .select("*")
    .eq("tenant_id", params.id)
    .order("performed_at", { ascending: false })
    .limit(20);

  // Count projects
  const { count: projectCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", params.id)
    .is("deleted_at", null);

  return (
    <TenantAdminClient
      tenant={tenant as Tenant}
      logs={(logs ?? []) as SubscriptionLog[]}
      projectCount={projectCount ?? 0}
    />
  );
}
