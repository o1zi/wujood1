"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ContentBlock } from "@/lib/types";
import { createContentBlock, updateContentBlock, deleteContentBlock } from "@/app/actions/content";
import { useRouter } from "next/navigation";

const ICONS = ["cube", "shield", "bar", "palette", "globe", "star", "users", "clock", "bolt", "layers", "briefcase", "image"];

export default function ServicesClient({ blocks, tenantId }: { blocks: ContentBlock[]; tenantId: string }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState<"service" | "feature" | null>(null);

  const services = blocks.filter((b) => b.type === "service");
  const features = blocks.filter((b) => b.type === "feature");

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا العنصر؟")) return;
    const res = await deleteContentBlock(id);
    if (res.error) toast.error(res.error);
    else { toast.success("تم الحذف"); router.refresh(); }
  }

  async function handleSave(id: string | null, type: "service" | "feature", formData: FormData) {
    formData.append("type", type);
    const res = id ? await updateContentBlock(id, formData) : await createContentBlock(formData);
    if (res.error) { toast.error(res.error); return; }
    toast.success(id ? "تم الحفظ" : "تمت الإضافة");
    setEditingId(null);
    setAdding(null);
    router.refresh();
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>الخدمات والمميزات</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted)" }}>تظهر في الصفحة الرئيسية لموقعك</p>

      <BlockSection
        title="الخدمات"
        blocks={services}
        type="service"
        onAdd={() => setAdding("service")}
        onEdit={setEditingId}
        onDelete={handleDelete}
        editingId={editingId}
        adding={adding === "service"}
        onSave={handleSave}
        onCancelAdd={() => setAdding(null)}
        onCancelEdit={() => setEditingId(null)}
      />

      <BlockSection
        title="المميزات"
        blocks={features}
        type="feature"
        onAdd={() => setAdding("feature")}
        onEdit={setEditingId}
        onDelete={handleDelete}
        editingId={editingId}
        adding={adding === "feature"}
        onSave={handleSave}
        onCancelAdd={() => setAdding(null)}
        onCancelEdit={() => setEditingId(null)}
      />
    </div>
  );
}

function BlockSection({
  title, blocks, type, onAdd, onEdit, onDelete,
  editingId, adding, onSave, onCancelAdd, onCancelEdit,
}: {
  title: string; blocks: ContentBlock[]; type: "service" | "feature";
  onAdd: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void;
  editingId: string | null; adding: boolean;
  onSave: (id: string | null, type: "service" | "feature", fd: FormData) => void;
  onCancelAdd: () => void; onCancelEdit: () => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{title}</h2>
        <button onClick={onAdd} style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 32, padding: "0 12px", background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500 }}>
          + إضافة
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {blocks.map((block) => (
          editingId === block.id ? (
            <BlockForm key={block.id} block={block} type={type} onSave={(fd) => onSave(block.id, type, fd)} onCancel={onCancelEdit} />
          ) : (
            <BlockCard key={block.id} block={block} onEdit={() => onEdit(block.id)} onDelete={() => onDelete(block.id)} />
          )
        ))}
        {adding && <BlockForm type={type} onSave={(fd) => onSave(null, type, fd)} onCancel={onCancelAdd} />}
      </div>

      {blocks.length === 0 && !adding && (
        <div style={{ padding: "24px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px dashed var(--border-strong)", textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
          لا توجد {title} بعد — اضغط "+ إضافة"
        </div>
      )}
    </div>
  );
}

function BlockCard({ block, onEdit, onDelete }: { block: ContentBlock; onEdit: () => void; onDelete: () => void }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: "14px 16px", display: "flex", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{block.title}</div>
        {block.description && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{block.description}</div>}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onEdit} style={{ fontSize: 12, color: "var(--primary)", padding: "3px 8px", border: "1px solid var(--border-strong)", borderRadius: 6 }}>تعديل</button>
        <button onClick={onDelete} style={{ fontSize: 12, color: "var(--danger)", padding: "3px 8px", border: "1px solid var(--border-strong)", borderRadius: 6 }}>حذف</button>
      </div>
    </div>
  );
}

function BlockForm({ block, type, onSave, onCancel }: { block?: ContentBlock; type: "service" | "feature"; onSave: (fd: FormData) => void; onCancel: () => void }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave(new FormData(e.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "2px solid var(--primary)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <input type="text" name="title" defaultValue={block?.title} placeholder="العنوان *" required style={inputS} />
      <textarea name="description" defaultValue={block?.description ?? ""} placeholder="الوصف (اختياري)" rows={2} style={{ ...inputS, resize: "vertical" }} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ fontSize: 13, color: "var(--muted)", padding: "5px 10px" }}>إلغاء</button>
        <button type="submit" style={{ fontSize: 13, color: "#fff", background: "var(--primary)", padding: "5px 12px", borderRadius: 6 }}>حفظ</button>
      </div>
    </form>
  );
}

const inputS: React.CSSProperties = { background: "var(--bg-alt)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", padding: "8px 10px", fontSize: 13, color: "var(--ink)", width: "100%" };
