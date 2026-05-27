import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import { PLANS, WHATSAPP_SUPPORT } from "@/lib/constants";
import { fmtDate, daysUntil } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "الاشتراك" };

export default async function SubscriptionPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("subscription_logs")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("performed_at", { ascending: false })
    .limit(10);

  const plan = PLANS[tenant.plan];
  const days = tenant.ends_at ? daysUntil(tenant.ends_at) : 0;
  const waMsg = encodeURIComponent(`أود تجديد اشتراك مكتب: ${tenant.name_ar} (${tenant.slug}) — الباقة الحالية: ${plan.labelAr}`);

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>الاشتراك</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted)" }}>تفاصيل باقتك الحالية وسجل المدفوعات</p>

      {/* Current plan */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>الباقة الحالية</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>{plan.labelAr}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
              {tenant.ends_at && (
                <>
                  {days > 0
                    ? <span style={{ color: days <= 30 ? "var(--warn)" : "var(--success)", fontWeight: 500 }}>{days} يوم متبق</span>
                    : <span style={{ color: "var(--danger)", fontWeight: 500 }}>منتهي</span>}
                  {" — ينتهي "}{fmtDate(tenant.ends_at)}
                </>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a
              href={`https://wa.me/${WHATSAPP_SUPPORT.replace(/\D/g, "")}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 16px", background: "var(--success)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500 }}
            >
              🔄 تجديد الاشتراك
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_SUPPORT.replace(/\D/g, "")}?text=${encodeURIComponent("أود ترقية اشتراكي: " + tenant.name_ar)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 16px", background: "var(--accent)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500 }}
            >
              ⬆ ترقية الباقة
            </a>
          </div>
        </div>

        {/* Plan features */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-soft)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "المشاريع", value: plan.projects === Infinity ? "غير محدود" : String(plan.projects) },
            { label: "التخزين", value: plan.storage_mb >= 1000 ? `${plan.storage_mb / 1000} جيجا` : `${plan.storage_mb} ميجا` },
            { label: "دومين مخصص", value: plan.customDomain ? "✓ متاح" : "✗ غير متاح" },
          ].map((f) => (
            <div key={f.label} style={{ background: "var(--bg-alt)", borderRadius: "var(--r-md)", padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--primary-soft)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--primary-ink)" }}>
          📌 الدفع يتم يدوياً عبر التحويل البنكي — بعد التحويل راسل الأدمن على واتساب بإرفاق إيصال التحويل.
        </div>
      </div>

      {/* Logs */}
      {logs && logs.length > 0 && (
        <div style={card}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>سجل الاشتراكات</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["الإجراء", "الباقة", "المبلغ", "الملاحظة", "التاريخ"].map((h) => (
                  <th key={h} style={{ padding: "6px 10px", textAlign: "right", color: "var(--muted)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 500 }}>{log.action}</td>
                  <td style={{ padding: "8px 10px", color: "var(--muted)" }}>{log.plan}</td>
                  <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)" }}>{log.amount ? `${log.amount.toLocaleString()} ر.س` : "-"}</td>
                  <td style={{ padding: "8px 10px", color: "var(--muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.notes ?? "-"}</td>
                  <td style={{ padding: "8px 10px", color: "var(--muted)", fontFamily: "var(--font-mono)", direction: "ltr" }}>{new Date(log.performed_at).toLocaleDateString("ar-SA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const card: React.CSSProperties = { background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20 };
