"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import type { Tenant } from "@/lib/types";
import { updateTenantInfo } from "@/app/actions/tenant";
import { uploadFile } from "@/app/actions/upload";

export default function TenantInfoForm({ tenant }: { tenant: Tenant }) {
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(tenant.logo_url ?? "");
  const [coverUrl, setCoverUrl] = useState(tenant.cover_url ?? "");
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    const res = await uploadFile(file, "logo");
    setLogoUploading(false);
    if (res.error) { toast.error(res.error); return; }
    if (res.url) setLogoUrl(res.url);
    toast.success("تم رفع الشعار");
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const res = await uploadFile(file, "cover");
    setCoverUploading(false);
    if (res.error) { toast.error(res.error); return; }
    if (res.url) setCoverUrl(res.url);
    toast.success("تم رفع صورة الغلاف");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateTenantInfo(fd);
    setLoading(false);
    if (res?.error) { toast.error(res.error); return; }
    toast.success("تم حفظ المعلومات");
  }

  const social = (tenant.social ?? {}) as Record<string, string>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>المعلومات الأساسية</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)" }}>بيانات مكتبك التي تظهر على موقعك العام</p>
        </div>
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {/* Media */}
      <Section title="الهوية البصرية">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
          {/* Logo */}
          <div>
            <label style={labelStyle}>الشعار</label>
            <div
              onClick={() => logoRef.current?.click()}
              style={{
                width: 80, height: 80, borderRadius: "var(--r-md)", cursor: "pointer",
                border: "2px dashed var(--border-strong)", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-alt)",
              }}
            >
              {logoUploading ? <span style={{ fontSize: 12, color: "var(--muted)" }}>جاري الرفع...</span> :
                logoUrl ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
                <span style={{ fontSize: 24 }}>+</span>}
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>PNG/SVG/WebP · 2MB</p>
          </div>

          {/* Cover */}
          <div>
            <label style={labelStyle}>صورة الغلاف</label>
            <div
              onClick={() => coverRef.current?.click()}
              style={{
                height: 80, borderRadius: "var(--r-md)", cursor: "pointer",
                border: "2px dashed var(--border-strong)", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: coverUrl ? "transparent" : "var(--bg-alt)",
              }}
            >
              {coverUploading ? <span style={{ fontSize: 12, color: "var(--muted)" }}>جاري الرفع...</span> :
                coverUrl ? <img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
                <span style={{ fontSize: 12, color: "var(--muted)" }}>+ رفع صورة الغلاف</span>}
            </div>
            <input ref={coverRef} type="file" accept="image/jpeg,image/webp" style={{ display: "none" }} onChange={handleCoverChange} />
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>JPG/WebP · 5MB</p>
          </div>
        </div>
      </Section>

      {/* Basic info */}
      <Section title="البيانات الأساسية">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="اسم المكتب (عربي) *" name="name_ar" defaultValue={tenant.name_ar} required />
          <Field label="اسم المكتب (إنجليزي)" name="name_en" defaultValue={tenant.name_en ?? ""} dir="ltr" />
          <Field label="البريد الإلكتروني" name="email" type="email" defaultValue={tenant.email ?? ""} dir="ltr" />
          <Field label="رقم الهاتف" name="phone" defaultValue={tenant.phone ?? ""} dir="ltr" />
          <Field label="واتساب" name="whatsapp" defaultValue={tenant.whatsapp ?? ""} dir="ltr" />
          <Field label="رابط الخريطة (Google Maps)" name="maps_url" defaultValue={tenant.maps_url ?? ""} dir="ltr" />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextareaField label="العنوان (عربي)" name="address_ar" defaultValue={tenant.address_ar ?? ""} rows={2} />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextareaField label="نبذة عن المكتب (عربي) *" name="about_ar" defaultValue={tenant.about_ar ?? ""} rows={4} required />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextareaField label="About (English)" name="about_en" defaultValue={tenant.about_en ?? ""} rows={3} dir="ltr" />
        </div>
      </Section>

      {/* Social */}
      <Section title="السوشيال ميديا">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "انستقرام", name: "instagram", placeholder: "username" },
            { label: "تويتر / X", name: "twitter", placeholder: "username" },
            { label: "لينكدإن", name: "linkedin", placeholder: "رابط أو username" },
            { label: "سناب شات", name: "snapchat", placeholder: "username" },
            { label: "تيك توك", name: "tiktok", placeholder: "username" },
          ].map((s) => (
            <Field key={s.name} label={s.label} name={s.name} defaultValue={social[s.name] ?? ""} placeholder={s.placeholder} dir="ltr" />
          ))}
        </div>
      </Section>

      {/* WhatsApp note */}
      <Section title="رسالة واتساب">
        <TextareaField
          label="رسالة ترحيب أولية (تُرسل مع واتساب)"
          name="whatsapp_note"
          defaultValue={tenant.whatsapp_note ?? ""}
          rows={3}
          placeholder="مثال: أهلاً، تواصلت معك من موقع مكتبنا..."
        />
      </Section>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24, background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "var(--ink)", borderBottom: "1px solid var(--border-soft)", paddingBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, name, required, defaultValue, type = "text", placeholder, dir }: {
  label: string; name: string; required?: boolean; defaultValue?: string;
  type?: string; placeholder?: string; dir?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} defaultValue={defaultValue} required={required} placeholder={placeholder}
        dir={dir}
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", padding: "9px 12px", fontSize: 14, color: "var(--ink)", width: "100%" }}
      />
    </div>
  );
}

function TextareaField({ label, name, required, defaultValue, rows = 3, placeholder, dir }: {
  label: string; name: string; required?: boolean; defaultValue?: string;
  rows?: number; placeholder?: string; dir?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        name={name} defaultValue={defaultValue} required={required} rows={rows} placeholder={placeholder}
        dir={dir}
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", padding: "9px 12px", fontSize: 14, color: "var(--ink)", width: "100%", resize: "vertical" }}
      />
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" };
const btnStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", height: 38, padding: "0 18px",
  background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)",
  fontSize: 13.5, fontWeight: 500, cursor: "pointer",
};
