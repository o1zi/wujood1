"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Tenant, CustomTheme } from "@/lib/types";
import { updateTenantTemplate } from "@/app/actions/tenant";
import { PLANS } from "@/lib/constants";

export default function ThemeClient({
  tenant,
  templates,
  customThemes,
}: {
  tenant: Tenant;
  templates: { id: string; nameAr: string; plan: string; colors: string[] }[];
  customThemes: CustomTheme[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(tenant.current_template);
  const [saving, setSaving] = useState(false);

  const plan = tenant.plan;
  const canUseTemplate = (templatePlan: string) => {
    if (plan === "premium") return true;
    if (plan === "pro") return templatePlan !== "premium";
    return templatePlan === "basic";
  };

  async function handleSave() {
    setSaving(true);
    const res = await updateTenantTemplate(selected);
    setSaving(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success("تم تغيير القالب");
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>القالب</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)" }}>
            القالب الحالي: <strong>{templates.find((t) => t.id === tenant.current_template)?.nameAr ?? tenant.current_template}</strong>
          </p>
        </div>
        {selected !== tenant.current_template && (
          <button onClick={handleSave} disabled={saving} style={btnPrimary}>
            {saving ? "جاري التطبيق..." : "تطبيق القالب المحدد"}
          </button>
        )}
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>القوالب الأساسية</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {templates.map((t) => {
          const allowed = canUseTemplate(t.plan);
          const isSelected = selected === t.id;
          const colors = t.colors ?? ["#fff", "#111", "#999"];

          return (
            <div
              key={t.id}
              onClick={() => allowed && setSelected(t.id)}
              style={{
                borderRadius: "var(--r-lg)", overflow: "hidden",
                border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                cursor: allowed ? "pointer" : "not-allowed",
                opacity: allowed ? 1 : 0.5,
                transition: "all .15s",
              }}
            >
              <div style={{ height: 100, display: "flex" }}>
                {colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
              </div>
              <div style={{ padding: "12px 14px", background: "var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{t.nameAr}</div>
                  {!allowed && (
                    <div style={{ fontSize: 11, color: "var(--accent)" }}>يتطلب باقة أعلى</div>
                  )}
                </div>
                {isSelected && <span style={{ color: "var(--primary)", fontSize: 12, fontWeight: 600 }}>✓ محدد</span>}
              </div>
            </div>
          );
        })}
      </div>

      {plan !== "basic" && (
        <>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>القوالب المخصصة</h2>
          {customThemes.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {customThemes.map((ct) => (
                <div key={ct.id} style={{ borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 16, background: "var(--surface)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{ct.name_ar}</div>
                  {ct.description && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{ct.description}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px dashed var(--border-strong)", textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
              لا توجد قوالب مخصصة متاحة حالياً
            </div>
          )}
        </>
      )}

      {plan === "basic" && (
        <div style={{ marginTop: 24, padding: 18, background: "var(--primary-soft)", borderRadius: "var(--r-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, color: "var(--primary)", fontWeight: 500 }}>
            ترقّ لباقة Pro للوصول إلى 5 قوالب إضافية
          </div>
          <Link href="/dashboard/subscription" style={{ ...btnPrimary, fontSize: 13 }}>ترقية الباقة</Link>
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = { display: "inline-flex", alignItems: "center", height: 38, padding: "0 16px", background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500, cursor: "pointer" };
