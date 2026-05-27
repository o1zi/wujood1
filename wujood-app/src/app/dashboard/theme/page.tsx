import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import ThemeClient from "./ThemeClient";
import { PLANS, TEMPLATES } from "@/lib/constants";

export const metadata = { title: "القالب" };

export default async function ThemePage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  // Get custom themes accessible to this tenant
  const plan = PLANS[tenant.plan];
  const { data: customThemes } = await supabase
    .from("custom_themes")
    .select("*")
    .eq("is_active", true)
    .eq("visibility", "public")
    .in("required_plan", tenant.plan === "premium" ? ["basic", "pro", "premium"] : tenant.plan === "pro" ? ["basic", "pro"] : ["basic"]);

  return <ThemeClient tenant={tenant} templates={TEMPLATES} customThemes={customThemes ?? []} />;
}
