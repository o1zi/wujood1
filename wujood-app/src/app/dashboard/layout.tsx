import { getTenantOrRedirect } from "@/lib/tenant-guard";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tenant } = await getTenantOrRedirect();
  return <DashboardShell tenant={tenant}>{children}</DashboardShell>;
}
