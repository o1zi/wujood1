import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PLANS, SECTORS } from "@/lib/constants";
import { fmtDate, daysUntil } from "@/lib/utils";
import type { Tenant, Plan } from "@/lib/types";
import { PlanBadge, StatusBadge } from "../page";

export const metadata = { title: "المكاتب — أدمن وجود" };

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: { q?: string; plan?: string; status?: string };
}) {
  const supabase = await createAdminClient();

  let query = supabase.from("tenants").select("*").order("created_at", { ascending: false });

  const { data } = await query;
  let tenants = (data ?? []) as Tenant[];

  // Client-side filter (small data set)
  const q      = searchParams.q?.toLowerCase() ?? "";
  const plan   = searchParams.plan ?? "";
  const status = searchParams.status ?? "";

  if (q)      tenants = tenants.filter((t) => t.name_ar.toLowerCase().includes(q) || t.slug.includes(q));
  if (plan)   tenants = tenants.filter((t) => t.plan === plan);
  if (status === "active")   tenants = tenants.filter((t) => t.is_active);
  if (status === "inactive") tenants = tenants.filter((t) => !t.is_active);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>المكاتب</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>{tenants.length} مكتب</p>
        </div>
        <Link href="/admin/tenants/new"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 18px", background: "var(--primary)", color: "#fff",
            borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500,
          }}>
          + إنشاء مكتب جديد
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="بحث باسم المكتب أو الـ slug..."
          style={{
            flex: "1 1 220px", padding: "8px 14px",
            border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
            fontSize: 13, background: "var(--surface)", color: "var(--ink)",
          }}
        />
        <select name="plan" defaultValue={searchParams.plan ?? ""}
          style={{ padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", fontSize: 13, background: "var(--surface)", color: "var(--ink)" }}>
          <option value="">كل الباقات</option>
          {(["basic","pro","premium"] as Plan[]).map((p) => (
            <option key={p} value={p}>{PLANS[p].labelAr}</option>
          ))}
        </select>
        <select name="status" defaultValue={searchParams.status ?? ""}
          style={{ padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", fontSize: 13, background: "var(--surface)", color: "var(--ink)" }}>
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">معطّل</option>
        </select>
        <button type="submit"
          style={{ padding: "8px 16px", background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500 }}>
          بحث
        </button>
        {(q || plan || status) && (
          <Link href="/admin/tenants"
            style={{ padding: "8px 14px", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--muted)" }}>
            مسح
          </Link>
        )}
      </form>

      {/* Table */}
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
        {tenants.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>لا توجد نتائج</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                  {["المكتب","القطاع","الباقة","الحالة","ينتهي","تاريخ الإنشاء",""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "var(--ink-soft)", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => {
                  const daysLeft = t.ends_at ? daysUntil(t.ends_at) : null;
                  const expiring = daysLeft !== null && daysLeft <= 30 && daysLeft > 0;
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
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
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        {t.ends_at ? (
                          <span style={{ color: expiring ? "var(--warn)" : "var(--muted)", fontSize: 12, fontWeight: expiring ? 600 : 400 }}>
                            {expiring ? `⚠ ${daysLeft} يوم` : fmtDate(t.ends_at)}
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted-soft)", fontSize: 12 }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)", whiteSpace: "nowrap", fontSize: 12 }}>
                        {fmtDate(t.created_at)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link href={`/admin/tenants/${t.id}`}
                          style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500, whiteSpace: "nowrap" }}>
                          إدارة ←
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
