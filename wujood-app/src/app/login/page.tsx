import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    const params = await searchParams;
    if (params.redirect) {
      redirect(params.redirect);
    }
    redirect(adminRow ? "/admin" : "/dashboard");
  }

  const params = await searchParams;
  return <LoginForm redirectTo={params.redirect} />;
}
