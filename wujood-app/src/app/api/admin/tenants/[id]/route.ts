import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Plan } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createAdminClient();

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { data: adminRow } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).single();
  if (!adminRow) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const tenantId = params.id;
  const body = await req.json() as { action: string; plan?: Plan; starts_at?: string; ends_at?: string };
  const { action } = body;

  let update: Record<string, unknown> = {};
  let logAction = action;
  let message = "";

  switch (action) {
    case "activate":
      update = { is_active: true };
      message = "تم تفعيل المكتب";
      break;

    case "deactivate":
      update = { is_active: false };
      message = "تم تعطيل المكتب";
      break;

    case "extend_year": {
      // Get current ends_at
      const { data: t } = await supabase.from("tenants").select("ends_at").eq("id", tenantId).single();
      const base = t?.ends_at ? new Date(t.ends_at) : new Date();
      if (base < new Date()) base.setTime(new Date().getTime()); // if expired, start from today
      base.setFullYear(base.getFullYear() + 1);
      update = { ends_at: base.toISOString(), is_active: true };
      message = `تم تمديد الاشتراك حتى ${base.toLocaleDateString("ar-SA")}`;
      logAction = "extend_year";
      break;
    }

    case "update_plan":
      update = {
        plan:      body.plan ?? undefined,
        starts_at: body.starts_at ?? undefined,
        ends_at:   body.ends_at ?? undefined,
      };
      message = "تم تحديث الباقة والتواريخ";
      logAction = "update_plan";
      break;

    default:
      return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("tenants")
    .update(update)
    .eq("id", tenantId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Log it
  await supabase.from("subscription_logs").insert({
    tenant_id:    tenantId,
    action:       logAction,
    plan:         updated.plan,
    performed_by: user.id,
    notes:        message,
  });

  return NextResponse.json({ tenant: updated, message });
}
