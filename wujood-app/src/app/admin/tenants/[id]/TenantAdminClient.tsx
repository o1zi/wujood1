"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PLANS, SECTORS, ROOT_DOMAIN } from "@/lib/constants";
import { fmtDate, daysUntil } from "@/lib/utils";
import type { Tenant, SubscriptionLog, Plan } from "@/lib/types";
import { PlanBadge, StatusBadge } from "../../components";

export default function TenantAdminClient({
  tenant: initial,
  logs,
  projectCount,
}: {
  tenant: Tenant;
  logs: SubscriptionLog[];
  projectCount: number;
}) {
  const router = useRouter();
  const [tenant, setTenant] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const daysLeft = tenant.ends_at ? daysUntil(tenant.ends_at) : null;

  // ── Subscription actions ──────────────────────────────────────
  async function doAction(action: string, extra?: Record<string, unknown>) {
    setActionLoading(action);
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "حدث خطأ");
      toast.success(json.message ?? "تم بنجاح");
      setTenant((prev) => ({ ...prev, ...json.tenant }));
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setActionLoading(null);
    }
  }

  // ── Save plan / dates ─────────────────────────────────────────
  const [editPlan, setEditPlan]       = useState(tenant.plan);
  const [editEnds, setEditEnds]       = useState(tenant.ends_at?.slice(0, 10) ?? "");
  const [editStarts, setEditStarts]   = useState(tenant.starts_at?.slice(0, 10) ?? "");

  async function savePlanDates() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_plan", plan: editPlan, starts_at: editStarts, ends_at: editEnds }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "حدث خطأ");
      toast.success("تم حفظ التغييرات");
      setTenant((prev) => ({ ...prev, ...json.tenant }));
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900, margin: "0 auto" }}>

      {/* Back + header */}
      <div>
        <Link href="/admin/tenants"
          style={{ fontSize: 13, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          ← العودة للمكاتب
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>
              {tenant.name_ar}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
              <StatusBadge active={tenant.is_active} />
              <PlanBadge plan={tenant.plan} />
              <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {tenant.slug}.{ROOT_DOMAIN}
              </span>
            </div>
          </div>
          <a href={`//${tenant.slug}.${ROOT_DOMAIN}`} target="_blank" rel="noopener noreferrer"
            style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--primary)", display: "flex", alignItems: "center", gap: 6 }}>
            زيارة الموقع ↗
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="tid-stats">
        <MiniStat label="المشاريع" value={projectCount.toString()} />
        <MiniStat label="القطاع" value={SECTORS[tenant.sector]?.label ?? tenant.sector} small />
        <MiniStat
          label="ينتهي الاشتراك"
          value={tenant.ends_at ? (daysLeft !== null && daysLeft > 0 ? `${daysLeft} يوم` : "منتهي") : "—"}
          color={daysLeft !== null && daysLeft <= 30 && daysLeft > 0 ? "var(--warn)" : undefined}
        />
      </div>

      {/* Quick actions */}
      <Card title="الإجراءات السريعة">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {tenant.is_active ? (
            <ActionBtn
              label="تعطيل المكتب"
              color="var(--danger)"
              bg="var(--danger-soft)"
              loading={actionLoading === "deactivate"}
              confirm="هل أنت متأكد من تعطيل هذا المكتب؟"
              onClick={() => doAction("deactivate")}
            />
          ) : (
            <ActionBtn
              label="تفعيل المكتب"
              color="var(--success)"
              bg="#e8f5ee"
              loading={actionLoading === "activate"}
              onClick={() => doAction("activate")}
            />
          )}
          <ActionBtn
            label="تمديد سنة"
            color="var(--primary)"
            bg="var(--primary-soft)"
            loading={actionLoading === "extend_year"}
            onClick={() => doAction("extend_year")}
          />
        </div>
      </Card>

      {/* Plan & dates */}
      <Card title="الباقة وفترة الاشتراك">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="tid-plan">
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>الباقة</label>
            <select value={editPlan} onChange={(e) => setEditPlan(e.target.value as Plan)} style={inputStyle}>
              {(Object.entries(PLANS) as [Plan, { labelAr: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.labelAr}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>تاريخ البداية</label>
            <input type="date" value={editStarts} onChange={(e) => setEditStarts(e.target.value)}
              style={{ ...inputStyle, direction: "ltr" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>تاريخ الانتهاء</label>
            <input type="date" value={editEnds} onChange={(e) => setEditEnds(e.target.value)}
              style={{ ...inputStyle, direction: "ltr" }} />
          </div>
        </div>
        <button onClick={savePlanDates} disabled={saving}
          style={{
            marginTop: 4, padding: "8px 20px",
            background: saving ? "var(--muted-soft)" : "var(--primary)", color: "#fff",
            borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer",
          }}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </Card>

      {/* Tenant info */}
      <Card title="معلومات المكتب">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "الاسم العربي", value: tenant.name_ar },
            { label: "الاسم الإنجليزي", value: tenant.name_en ?? "—" },
            { label: "الـ Slug", value: tenant.slug, mono: true },
            { label: "الدومين المخصص", value: tenant.custom_domain ?? "—", mono: true },
            { label: "الإيميل", value: tenant.email ?? "—" },
            { label: "الهاتف", value: tenant.phone ?? "—" },
            { label: "تاريخ الإنشاء", value: fmtDate(tenant.created_at) },
            { label: "آخر تحديث", value: fmtDate(tenant.updated_at) },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, color: "var(--ink)", fontFamily: mono ? "var(--font-mono)" : undefined }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Subscription logs */}
      <Card title="سجل الاشتراكات">
        {logs.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>لا يوجد سجل بعد</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                padding: "10px 0", borderBottom: "1px solid var(--border-soft)", fontSize: 13,
              }}>
                <div>
                  <span style={{ fontWeight: 500, color: "var(--ink)" }}>{actionLabel(log.action)}</span>
                  {log.notes && <span style={{ color: "var(--muted)", marginInlineStart: 8 }}>{log.notes}</span>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <PlanBadge plan={log.plan} />
                  <span style={{ fontSize: 11, color: "var(--muted-soft)" }}>
                    {fmtDate(log.performed_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <style>{`
        @media(max-width:600px){
          .tid-stats,.tid-plan{ grid-template-columns:1fr!important; }
        }
      `}</style>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────

function actionLabel(action: string) {
  const map: Record<string, string> = {
    create:       "إنشاء المكتب",
    activate:     "تفعيل",
    deactivate:   "تعطيل",
    extend_year:  "تمديد سنة",
    update_plan:  "تغيير الباقة",
    renew:        "تجديد",
    suspend:      "إيقاف",
  };
  return map[action] ?? action;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px",
  border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
  fontSize: 13, background: "var(--surface)", color: "var(--ink)", outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, color: "var(--ink-soft)",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{title}</span>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

function MiniStat({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", padding: "14px 18px" }}>
      <div style={{ fontSize: small ? 14 : 22, fontWeight: 700, color: color ?? "var(--primary)", fontFamily: small ? undefined : "var(--font-mono)" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ActionBtn({
  label, color, bg, loading, onClick, confirm: confirmMsg,
}: {
  label: string; color: string; bg: string;
  loading: boolean; onClick: () => void; confirm?: string;
}) {
  function handleClick() {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    onClick();
  }
  return (
    <button onClick={handleClick} disabled={loading}
      style={{
        padding: "9px 18px", background: loading ? "var(--muted-soft)" : bg,
        color: loading ? "var(--muted)" : color,
        border: `1px solid ${color}22`,
        borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
      }}>
      {loading ? "جاري التنفيذ..." : label}
    </button>
  );
}
