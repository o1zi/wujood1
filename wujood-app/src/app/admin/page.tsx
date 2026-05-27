import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PLANS, SECTORS } from "@/lib/constants";
import { fmtDate, daysUntil } from "@/lib/utils";
import type { Tenant, Plan } from "@/lib/types";

export default async function AdminPage() {
  const supabase = await createAdminClient();

  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  const all   = (tenants ?? []) as Tenant[];
  const total  = all.length;
  const active = all.filter((t) => t.is_active).length;
  const inactive = total - active;

  const byPlan = {
    basic:   all.filter((t) => t.plan === "basic").length,
    pro:     all.filter((t) => t.plan === "pro").length,
    premium: all.filter((t) => t.plan === "premium").length,
  };

  const expiringSoon = all.filter((t) => {
    if (!t.ends_at || !t.is_active) return false;
    const d = daysUntil(t.ends_at);
    return d > 0 && d <= 30;
  });

  const recent = all.slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="adm-stats">
        <StatCard label="إجمالي المكاتب" value={total}   color="var(--primary)" />
        <StatCard label="نشطة"            value={active}  color="var(--success)" />
        <StatCard label="معطّلة"           value={inactive} color="var(--danger)" />
        <StatCard label="تنتهي خلال 30 يوم" value={expiringSoon.length} color="var(--warn)" />
      </div>

      {/* Plans breakdown */}
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: "20px 24px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>توزيع الباقات</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["basic","pro","premium"] as Plan[]).map((p) => (
            <div key={p} style={{
              flex: "1 1 120px", padding: "14px 18px",
              background: "var(--bg)", borderRadius: "var(--r-md)", border: "1px solid var(--border)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{byPlan[p]}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{PLANS[p].labelAr}</div>
              <div style={{ fontSize: 11, color: "var(--muted-soft)", marginTop: 2 }}>{PLANS[p].priceYearly.toLocaleString("ar-SA")} ر.س/سنة</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expiring soon */}
      {expiringSoon.length > 0 && (
        <div style={{ background: "var(--warn-soft)", borderRadius: "var(--r-lg)", border: "1px solid var(--warn)", padding: "20px 24px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "var(--warn)" }}>
            ⚠️ مكاتب تنتهي اشتراكاتها قريباً
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expiringSoon.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <Link href={`/admin/tenants/${t.id}`}
                  style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                  {t.name_ar}
                </Link>
                <span style={{ fontSize: 12, color: "var(--warn)" }}>
                  {daysUntil(t.ends_at!)} يوم متبقي · {fmtDate(t.ends_at!)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent tenants */}
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>أحدث المكاتب</h2>
          <Link href="/admin/tenants"
            style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500 }}>
            عرض الكل ←
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["المكتب","القطاع","الباقة","الحالة","تاريخ الإنشاء",""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "var(--ink-soft)", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <TenantRow key={t.id} tenant={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`.adm-stats { @media(max-width:700px){ grid-template-columns:repeat(2,1fr)!important; } }`}</style>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)",
      padding: "20px 22px",
    }}>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: "var(--font-mono)" }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function TenantRow({ tenant: t }: { tenant: Tenant }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ fontWeight: 500, color: "var(--ink)" }}>{t.name_ar}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{t.slug}</div>
      </td>
      <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
        {SECTORS[t.sector]?.label ?? t.sector}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <PlanBadge plan={t.plan} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <StatusBadge active={t.is_active} />
      </td>
      <td style={{ padding: "12px 16px", color: "var(--muted)", whiteSpace: "nowrap" }}>
        {fmtDate(t.created_at)}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Link href={`/admin/tenants/${t.id}`}
          style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}>
          تفاصيل
        </Link>
      </td>
    </tr>
  );
}

export function PlanBadge({ plan }: { plan: Plan }) {
  const colors: Record<Plan, { bg: string; text: string }> = {
    basic:   { bg: "var(--border-soft)",  text: "var(--muted)"   },
    pro:     { bg: "var(--primary-soft)", text: "var(--primary)" },
    premium: { bg: "var(--accent-soft)",  text: "var(--accent)"  },
  };
  const c = colors[plan];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
      {PLANS[plan].labelAr}
    </span>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: 11, fontWeight: 600,
      background: active ? "#e8f5ee" : "var(--danger-soft)",
      color: active ? "var(--success)" : "var(--danger)",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
      {active ? "نشط" : "معطّل"}
    </span>
  );
}
