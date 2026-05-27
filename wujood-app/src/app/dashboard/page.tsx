import Link from "next/link";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import { PLANS, WHATSAPP_SUPPORT } from "@/lib/constants";
import { daysUntil, fmtDate } from "@/lib/utils";

export const metadata = { title: "الرئيسية" };

export default async function DashboardHome() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const [{ count: projectCount }, { data: analytics }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("tenant_id", tenant.id).is("deleted_at", null),
    supabase.from("visitor_events").select("id", { count: "exact", head: true }).eq("tenant_id", tenant.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const days = tenant.ends_at ? daysUntil(tenant.ends_at) : 0;
  const plan = PLANS[tenant.plan];

  const steps = [
    { done: !!tenant.logo_url, label: "رفع شعار المكتب", href: "/dashboard/info" },
    { done: !!tenant.about_ar, label: "إعداد النبذة التعريفية", href: "/dashboard/info" },
    { done: (projectCount ?? 0) >= 3, label: "إضافة 3 مشاريع على الأقل", href: "/dashboard/projects" },
    { done: !!tenant.phone || !!tenant.whatsapp, label: "إضافة معلومات التواصل", href: "/dashboard/info" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>
            أهلاً، {tenant.name_ar}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)" }}>
            {tenant.ends_at ? `الاشتراك ينتهي بعد ${days} يوم — ${fmtDate(tenant.ends_at)}` : "الاشتراك نشط"}
          </p>
        </div>
        <a
          href={`//${tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "wujood.sa"}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 16px",
            background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)",
            fontSize: 13.5, fontWeight: 500,
          }}
        >
          زيارة موقعي
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
        </a>
      </div>

      {/* Renewal warning */}
      {days > 0 && days <= 30 && (
        <div style={{ marginBottom: 18, padding: "14px 16px", background: "var(--warn-soft)", borderRadius: "var(--r-md)", border: "1px solid var(--warn)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 14, color: "var(--warn)", fontWeight: 500 }}>
            ⚠ اشتراكك يقارب الانتهاء — تواصل معنا على واتساب لتجديده قبل توقف الموقع.
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_SUPPORT.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", height: 32, padding: "0 12px", background: "var(--accent)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500 }}
          >
            تجديد الاشتراك
          </a>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "المشاريع المنشورة", value: projectCount ?? 0, suffix: `/ ${plan.projects === Infinity ? "∞" : plan.projects}`, color: "var(--primary)" },
          { label: "زيارات آخر 30 يوم", value: analytics?.length ?? 0, suffix: "", color: "var(--accent)" },
          { label: "حالة الاشتراك", value: tenant.is_active ? "نشط" : "موقوف", suffix: "", color: tenant.is_active ? "var(--success)" : "var(--danger)" },
          { label: "أيام متبقية", value: days, suffix: " يوم", color: days <= 30 ? "var(--warn)" : "var(--ink)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: s.color }}>
              {s.value}{s.suffix}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        {/* Quick links */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>روابط موقعك</h3>
          {[
            { label: "Subdomain", value: `${tenant.slug}.wujood.sa` },
            ...(tenant.custom_domain ? [{ label: "دومين مخصص", value: tenant.custom_domain }] : []),
          ].map((link) => (
            <div key={link.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-alt)", borderRadius: 8, marginBottom: 8, fontSize: 13 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{link.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.value}</div>
              </div>
              <a href={`//${link.value}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--primary)" }}>زيارة</a>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>وصول سريع</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "إضافة مشروع", href: "/dashboard/projects" },
                { label: "تعديل المعلومات", href: "/dashboard/info" },
                { label: "تغيير القالب", href: "/dashboard/theme" },
                { label: "عرض التحليلات", href: "/dashboard/analytics" },
              ].map((q) => (
                <Link key={q.href} href={q.href} style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 36, borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500,
                  border: "1px solid var(--border-strong)", color: "var(--ink-soft)",
                  background: "var(--surface)", transition: "all .15s",
                }}>
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>الخطوات التالية</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {steps.map((step) => (
              <Link key={step.href + step.label} href={step.href} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
                color: step.done ? "var(--muted)" : "var(--ink)",
                textDecoration: step.done ? "line-through" : "none",
                fontSize: 13.5,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  background: step.done ? "var(--primary)" : "var(--bg-alt)",
                  color: step.done ? "#fff" : "var(--muted)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  border: step.done ? "none" : "1px solid var(--border-strong)",
                  fontSize: 10,
                }}>
                  {step.done && "✓"}
                </span>
                {step.label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: "12px 14px", background: "var(--primary-soft)", borderRadius: "var(--r-md)" }}>
            <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>باقة {plan.labelAr}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              {projectCount ?? 0} / {plan.projects === Infinity ? "∞" : plan.projects} مشروع
            </div>
            {tenant.plan !== "premium" && (
              <Link href="/dashboard/subscription" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500, display: "block", marginTop: 6 }}>
                ترقية الباقة ←
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
