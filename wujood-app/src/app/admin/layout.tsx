import { getAdminOrRedirect } from "@/lib/tenant-guard";
import AdminShell from "./AdminShell";

export const metadata = { title: "لوحة الأدمن — وجود" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await getAdminOrRedirect();
  return <AdminShell>{children}</AdminShell>;
}
