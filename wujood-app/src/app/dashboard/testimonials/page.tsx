import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import TestimonialsClient from "./TestimonialsClient";

export const metadata = { title: "شهادات العملاء" };

export default async function TestimonialsPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();
  const { data } = await supabase.from("tenant_testimonials").select("*").eq("tenant_id", tenant.id).order("display_order");
  return <TestimonialsClient items={data ?? []} />;
}
