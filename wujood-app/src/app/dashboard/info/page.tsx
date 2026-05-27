import { getTenantOrRedirect } from "@/lib/tenant-guard";
import TenantInfoForm from "./TenantInfoForm";

export const metadata = { title: "المعلومات الأساسية" };

export default async function InfoPage() {
  const { tenant } = await getTenantOrRedirect();
  return <TenantInfoForm tenant={tenant} />;
}
