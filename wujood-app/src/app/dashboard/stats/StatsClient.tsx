"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { TenantStat } from "@/lib/types";
import { upsertStat, deleteStat } from "@/app/actions/content";

export default function StatsClient({ stats }: { stats: TenantStat[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا الرقم؟")) return;
    await deleteStat(id);
    toast.success("تم الحذف");
    router.refresh();
  }

  async function handleSave(id: string | null, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await upsertStat(id, new FormData(e.currentTarget));
    if (res.error) { toast.error(res.error); return; }
    toast.success("تم الحفظ");
    setEditingId(null);
    setAdding(false);
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>الإحصاءات</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)" }}>أرقام الإنجازات التي تظهر على موقعك</p>
        </div>
        <button onClick={() => setAdding(true)} style={btnPrimary}>+ إضافة رقم</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {stats.map((stat) => (
          editingId === stat.id ? (
            <StatForm key={stat.id} stat={stat} onSave={(e) => handleSave(stat.id, e)} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={stat.id} style={card}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--primary)" }}>
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{stat.label}</div>
              <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                <button onClick={() => setEditingId(stat.id)} style={btnSm}>تعديل</button>
                <button onClick={() => handleDelete(stat.id)} style={{ ...btnSm, color: "var(--danger)" }}>حذف</button>
              </div>
            </div>
          )
        ))}
        {adding && <StatForm onSave={(e) => handleSave(null, e)} onCancel={() => setAdding(false)} />}
      </div>
    </div>
  );
}

function StatForm({ stat, onSave, onCancel }: { stat?: TenantStat; onSave: (e: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return (
    <form onSubmit={onSave} style={{ ...card, border: "2px solid var(--primary)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 6, marginBottom: 10 }}>
        <input name="prefix" defaultValue={stat?.prefix ?? ""} placeholder="قبل" style={inputS} />
        <input name="value" type="number" defaultValue={stat?.value} placeholder="الرقم" required style={inputS} />
        <input name="suffix" defaultValue={stat?.suffix ?? ""} placeholder="بعد" style={inputS} />
      </div>
      <input name="label" defaultValue={stat?.label} placeholder="التسمية *" required style={{ ...inputS, marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={onCancel} style={{ fontSize: 12, color: "var(--muted)" }}>إلغاء</button>
        <button type="submit" style={{ fontSize: 12, color: "#fff", background: "var(--primary)", padding: "4px 10px", borderRadius: 6 }}>حفظ</button>
      </div>
    </form>
  );
}

const card: React.CSSProperties = { background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 18 };
const btnSm: React.CSSProperties = { fontSize: 12, color: "var(--ink-soft)", padding: "3px 8px", border: "1px solid var(--border-strong)", borderRadius: 6 };
const btnPrimary: React.CSSProperties = { display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500 };
const inputS: React.CSSProperties = { background: "var(--bg-alt)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "7px 10px", fontSize: 13, width: "100%" };
