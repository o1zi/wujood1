import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import StatsClient from "./StatsClient";

export const metadata = { title: "الإحصاءات" };

export default async function StatsPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();
  const { data: stats } = await supabase.from("tenant_stats").select("*").eq("tenant_id", tenant.id).order("display_order");
  return <StatsClient stats={stats ?? []} />;
}
