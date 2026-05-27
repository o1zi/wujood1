import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Sector, Plan } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = await createAdminClient();

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { data: adminRow } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).single();
  if (!adminRow) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await req.json() as {
    name_ar:   string;
    slug:      string;
    sector:    Sector;
    plan:      Plan;
    email:     string;
    password:  string;
    starts_at: string;
    ends_at:   string;
  };

  const { name_ar, slug, sector, plan, email, password, starts_at, ends_at } = body;

  // 1 — Create Auth user
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

  const ownerId = authData.user.id;

  // 2 — Create tenant
  const { data: tenant, error: tenantErr } = await supabase.from("tenants").insert({
    slug,
    name_ar,
    sector,
    plan,
    current_template: "modern",
    is_active: true,
    starts_at,
    ends_at,
  }).select().single();

  if (tenantErr) {
    // Rollback: delete auth user
    await supabase.auth.admin.deleteUser(ownerId);
    return NextResponse.json({ error: tenantErr.message }, { status: 400 });
  }

  // 3 — Link user to tenant
  const { error: linkErr } = await supabase.from("tenant_users").insert({
    tenant_id: tenant.id,
    user_id:   ownerId,
    role:      "owner",
  });

  if (linkErr) {
    await supabase.auth.admin.deleteUser(ownerId);
    await supabase.from("tenants").delete().eq("id", tenant.id);
    return NextResponse.json({ error: linkErr.message }, { status: 400 });
  }

  // 4 — Subscription log
  await supabase.from("subscription_logs").insert({
    tenant_id:    tenant.id,
    action:       "create",
    plan,
    amount:       0,
    notes:        `إنشاء المكتب بواسطة الأدمن`,
    performed_by: user.id,
  });

  return NextResponse.json({ tenantId: tenant.id });
}
