"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { TenantTestimonial } from "@/lib/types";
import { upsertTestimonial, deleteTestimonial } from "@/app/actions/content";

export default function TestimonialsClient({ items }: { items: TenantTestimonial[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("حذف هذه الشهادة؟")) return;
    await deleteTestimonial(id);
    toast.success("تم الحذف");
    router.refresh();
  }

  async function handleSave(id: string | null, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await upsertTestimonial(id, new FormData(e.currentTarget));
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
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>شهادات العملاء</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)" }}>آراء عملائك التي تُعزز مصداقية مكتبك</p>
        </div>
        <button onClick={() => setAdding(true)} style={btnPrimary}>+ إضافة شهادة</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          editingId === item.id ? (
            <TestimonialForm key={item.id} item={item} onSave={(e) => handleSave(item.id, e)} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={item.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{item.client_name}</div>
                  {item.client_role && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{item.client_role}</div>}
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>"{item.text}"</div>
                  {item.rating && <div style={{ marginTop: 6, color: "var(--accent)", fontSize: 14 }}>{"★".repeat(item.rating)}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => setEditingId(item.id)} style={btnSm}>تعديل</button>
                  <button onClick={() => handleDelete(item.id)} style={{ ...btnSm, color: "var(--danger)" }}>حذف</button>
                </div>
              </div>
            </div>
          )
        ))}
        {adding && <TestimonialForm onSave={(e) => handleSave(null, e)} onCancel={() => setAdding(false)} />}
        {items.length === 0 && !adding && (
          <div style={{ ...card, textAlign: "center", color: "var(--muted)", fontSize: 14, border: "1px dashed var(--border-strong)" }}>
            لا توجد شهادات بعد — اضغط "+ إضافة شهادة"
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialForm({ item, onSave, onCancel }: { item?: TenantTestimonial; onSave: (e: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return (
    <form onSubmit={onSave} style={{ ...card, border: "2px solid var(--primary)", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <input name="client_name" defaultValue={item?.client_name} placeholder="اسم العميل *" required style={inputS} />
        <input name="client_role" defaultValue={item?.client_role ?? ""} placeholder="المسمى الوظيفي" style={inputS} />
      </div>
      <textarea name="text" defaultValue={item?.text} placeholder="نص الشهادة *" required rows={3} style={{ ...inputS, resize: "vertical" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <select name="rating" defaultValue={item?.rating ?? ""} style={{ ...inputS, width: 120 }}>
          <option value="">التقييم</option>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} نجوم</option>)}
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={onCancel} style={{ fontSize: 12, color: "var(--muted)" }}>إلغاء</button>
          <button type="submit" style={{ fontSize: 12, color: "#fff", background: "var(--primary)", padding: "5px 12px", borderRadius: 6 }}>حفظ</button>
        </div>
      </div>
    </form>
  );
}

const card: React.CSSProperties = { background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 18 };
const btnSm: React.CSSProperties = { fontSize: 12, color: "var(--ink-soft)", padding: "3px 8px", border: "1px solid var(--border-strong)", borderRadius: 6 };
const btnPrimary: React.CSSProperties = { display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500 };
const inputS: React.CSSProperties = { background: "var(--bg-alt)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "8px 10px", fontSize: 13, width: "100%" };
