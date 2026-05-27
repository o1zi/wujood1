import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import FaqsClient from "./FaqsClient";

export const metadata = { title: "الأسئلة الشائعة" };

export default async function FaqsPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();
  const { data } = await supabase.from("tenant_faqs").select("*").eq("tenant_id", tenant.id).order("display_order");
  return <FaqsClient items={data ?? []} />;
}
