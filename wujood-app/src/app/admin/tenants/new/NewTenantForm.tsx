"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SECTORS, PLANS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { Sector, Plan } from "@/lib/types";

function randPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function NewTenantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name_ar:    "",
    slug:       "",
    sector:     "architecture" as Sector,
    plan:       "pro"          as Plan,
    email:      "",
    password:   randPassword(),
    starts_at:  today,
    ends_at:    nextYear,
  });

  function set(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function handleNameChange(v: string) {
    setForm((prev) => ({
      ...prev,
      name_ar: v,
      slug: prev.slug === "" || prev.slug === slugify(prev.name_ar) ? slugify(v) : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name_ar || !form.slug || !form.email || !form.password) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "حدث خطأ");

      toast.success(`تم إنشاء مكتب "${form.name_ar}" بنجاح`);
      router.push(`/admin/tenants/${json.tenantId}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
          إنشاء مكتب جديد
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
          سيُنشأ حساب Supabase Auth + سجل المكتب + ربط المستخدم تلقائياً
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Section: معلومات المكتب */}
        <Section title="معلومات المكتب">
          <Field label="اسم المكتب (عربي) *">
            <input value={form.name_ar} onChange={(e) => handleNameChange(e.target.value)}
              required placeholder="مثال: مكتب الرياض الهندسي"
              style={inputStyle} />
          </Field>
          <Field label="الـ Slug (رابط الموقع) *">
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--surface)" }}>
              <span style={{ padding: "0 10px", fontSize: 12, color: "var(--muted)", background: "var(--bg)", borderInlineStart: "1px solid var(--border-strong)", height: 38, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                .wujood.sa
              </span>
              <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))}
                required dir="ltr" placeholder="riyadh-office"
                style={{ flex: 1, padding: "8px 12px", fontSize: 13, border: "none", background: "transparent", color: "var(--ink)", outline: "none" }} />
            </div>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="القطاع">
              <select value={form.sector} onChange={(e) => set("sector", e.target.value as Sector)} style={inputStyle}>
                {(Object.entries(SECTORS) as [Sector, { label: string }][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </Field>
            <Field label="الباقة">
              <select value={form.plan} onChange={(e) => set("plan", e.target.value as Plan)} style={inputStyle}>
                {(Object.entries(PLANS) as [Plan, { labelAr: string; priceYearly: number }][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelAr} — {v.priceYearly.toLocaleString()} ر.س</option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* Section: الاشتراك */}
        <Section title="فترة الاشتراك">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="تاريخ البداية">
              <input type="date" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)}
                style={{ ...inputStyle, direction: "ltr" }} />
            </Field>
            <Field label="تاريخ الانتهاء">
              <input type="date" value={form.ends_at} onChange={(e) => set("ends_at", e.target.value)}
                style={{ ...inputStyle, direction: "ltr" }} />
            </Field>
          </div>
        </Section>

        {/* Section: حساب المستخدم */}
        <Section title="حساب المستخدم (تسجيل الدخول)">
          <Field label="البريد الإلكتروني *">
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              required dir="ltr" placeholder="owner@office.com"
              style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </Field>
          <Field label="كلمة المرور المؤقتة">
            <div style={{ display: "flex", gap: 8 }}>
              <input value={form.password} onChange={(e) => set("password", e.target.value)}
                dir="ltr"
                style={{ ...inputStyle, flex: 1, direction: "ltr", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 12 }} />
              <button type="button" onClick={() => set("password", randPassword())}
                style={{ padding: "0 12px", background: "var(--bg)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--muted)", cursor: "pointer", whiteSpace: "nowrap" }}>
                توليد
              </button>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--muted)" }}>
              أرسلها للعميل — لن تُعرض مجدداً بعد الإنشاء
            </p>
          </Field>
        </Section>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", paddingTop: 8 }}>
          <button type="submit" disabled={loading}
            style={{
              padding: "10px 28px", background: loading ? "var(--muted-soft)" : "var(--primary)", color: "#fff",
              borderRadius: "var(--r-md)", fontSize: 14, fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer", transition: "background .15s",
            }}>
            {loading ? "جاري الإنشاء..." : "إنشاء المكتب"}
          </button>
          <a href="/admin/tenants"
            style={{ padding: "10px 20px", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--ink-soft)" }}>
            إلغاء
          </a>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px",
  border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
  fontSize: 13, background: "var(--surface)", color: "var(--ink)",
  outline: "none",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{title}</span>
      </div>
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)" }}>{label}</label>
      {children}
    </div>
  );
}
