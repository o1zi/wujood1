import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import ServicesClient from "./ServicesClient";

export const metadata = { title: "الخدمات والمميزات" };

export default async function ServicesPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { data: blocks } = await supabase
    .from("content_blocks")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("display_order");

  return <ServicesClient blocks={blocks ?? []} tenantId={tenant.id} />;
}
