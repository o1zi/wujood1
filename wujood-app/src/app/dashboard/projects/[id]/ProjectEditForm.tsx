"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Tenant, Project } from "@/lib/types";
import { createProject, updateProject, deleteProject } from "@/app/actions/projects";
import { uploadFile } from "@/app/actions/upload";
import { addProjectImage, deleteProjectImage } from "@/app/actions/projects";

interface Props {
  tenant: Tenant;
  project: Project | null;
  images: { id: string; url: string; display_order: number }[];
}

export default function ProjectEditForm({ tenant, project, images: initImages }: Props) {
  const router = useRouter();
  const isNew = !project;
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [coverUrl, setCoverUrl] = useState(project?.cover_url ?? "");
  const [images, setImages] = useState(initImages);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const isRealEstate = tenant.sector === "realestate";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    let res;
    if (isNew) {
      res = await createProject(fd);
      if (res?.id) {
        if (coverUrl) {
          // Cover was already uploaded, just navigate to new project
        }
        toast.success("تم إنشاء المشروع");
        router.push(`/dashboard/projects/${res.id}`);
        return;
      }
    } else {
      res = await updateProject(project!.id, fd);
      if (!res?.error) toast.success("تم حفظ المشروع");
    }

    setLoading(false);
    if (res?.error) toast.error(res.error);
  }

  async function handleDelete() {
    if (!project) return;
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    setDeleting(true);
    const res = await deleteProject(project.id);
    if (res.error) { toast.error(res.error); setDeleting(false); return; }
    toast.success("تم حذف المشروع");
    router.push("/dashboard/projects");
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !project) return;
    const res = await uploadFile(file, "projectCover", project.id);
    if (res.error) { toast.error(res.error); return; }
    if (res.url) setCoverUrl(res.url);
    toast.success("تم رفع صورة الغلاف");
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!project) return;
    for (const file of files) {
      const res = await uploadFile(file, "projectImage", project.id);
      if (res.error) { toast.error(res.error); continue; }
      if (res.url) {
        const addRes = await addProjectImage(project.id, res.url);
        if (addRes.error) { toast.error(addRes.error); continue; }
      }
    }
    // Refresh images
    router.refresh();
    toast.success("تم رفع الصور");
  }

  async function handleDeleteImage(imageId: string) {
    const res = await deleteProjectImage(imageId);
    if (res.error) { toast.error(res.error); return; }
    setImages((prev) => prev.filter((i) => i.id !== imageId));
    toast.success("تم حذف الصورة");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button type="button" onClick={() => router.push("/dashboard/projects")} style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4, display: "block" }}>
            ← المشاريع
          </button>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
            {isNew ? "مشروع جديد" : "تعديل المشروع"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!isNew && (
            <button type="button" onClick={handleDelete} disabled={deleting} style={{ ...btnOutline, color: "var(--danger)", borderColor: "var(--danger)" }}>
              {deleting ? "جاري الحذف..." : "حذف"}
            </button>
          )}
          <button type="submit" disabled={loading} style={btnPrimary}>
            {loading ? "جاري الحفظ..." : isNew ? "إنشاء المشروع" : "حفظ"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
        {/* Main fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>البيانات الأساسية</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="عنوان المشروع (عربي) *" name="title_ar" defaultValue={project?.title_ar} required />
              <Field label="عنوان المشروع (إنجليزي)" name="title_en" defaultValue={project?.title_en ?? ""} dir="ltr" />
              <TextareaField label="وصف المشروع" name="description_ar" defaultValue={project?.description_ar ?? ""} rows={4} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Field label="الفئة" name="category" defaultValue={project?.category ?? ""} />
                <Field label="الموقع" name="location" defaultValue={project?.location ?? ""} />
                <Field label="السنة" name="year" type="number" defaultValue={String(project?.year ?? "")} />
              </div>
            </div>
          </Card>

          {isRealEstate && (
            <Card>
              <h3 style={sectionTitle}>بيانات العقار</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="السعر (ر.س)" name="price" type="number" defaultValue={String(project?.price ?? "")} />
                <Field label="المساحة (م²)" name="area_sqm" type="number" defaultValue={String(project?.area_sqm ?? "")} />
                <Field label="غرف النوم" name="rooms" type="number" defaultValue={String(project?.rooms ?? "")} />
                <Field label="دورات المياه" name="bathrooms" type="number" defaultValue={String(project?.bathrooms ?? "")} />
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>الحالة</label>
                  <select name="status" defaultValue={project?.status ?? ""} style={inputStyle}>
                    <option value="">—</option>
                    {["تحت الإنشاء", "مكتمل", "للبيع", "مباع"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          )}

          {!isNew && (
            <Card>
              <h3 style={sectionTitle}>معرض الصور ({images.length}/20)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                {images.map((img) => (
                  <div key={img.id} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      style={{
                        position: "absolute", top: 4, insetInlineEnd: 4,
                        background: "rgba(179,57,44,.9)", color: "#fff",
                        borderRadius: "50%", width: 22, height: 22,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {images.length < 20 && (
                <button type="button" onClick={() => galleryRef.current?.click()} style={{ ...btnOutline, fontSize: 13 }}>
                  + رفع صور
                </button>
              )}
              <input ref={galleryRef} type="file" accept="image/jpeg,image/webp" multiple style={{ display: "none" }} onChange={handleGalleryUpload} />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Cover */}
          <Card>
            <h3 style={sectionTitle}>صورة الغلاف</h3>
            <div
              onClick={() => !isNew && coverRef.current?.click()}
              style={{
                aspectRatio: "16/9", borderRadius: "var(--r-md)", overflow: "hidden",
                background: "var(--bg-alt)", cursor: isNew ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px dashed var(--border-strong)",
              }}
            >
              {coverUrl ? (
                <img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  {isNew ? "احفظ المشروع أولاً" : "انقر لرفع الغلاف"}
                </span>
              )}
            </div>
            {!isNew && <input ref={coverRef} type="file" accept="image/jpeg,image/webp" style={{ display: "none" }} onChange={handleCoverUpload} />}
          </Card>

          {/* Options */}
          <Card>
            <h3 style={sectionTitle}>الخيارات</h3>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" name="is_featured" value="true" defaultChecked={project?.is_featured} />
              تمييز هذا المشروع
            </label>
          </Card>
        </div>
      </div>
    </form>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 18 }}>{children}</div>;
}

function Field({ label, name, required, defaultValue, type = "text", dir }: {
  label: string; name: string; required?: boolean; defaultValue?: string; type?: string; dir?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} name={name} defaultValue={defaultValue} required={required} dir={dir} style={inputStyle} />
    </div>
  );
}

function TextareaField({ label, name, required, defaultValue, rows = 3 }: {
  label: string; name: string; required?: boolean; defaultValue?: string; rows?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}</label>
      <textarea name={name} defaultValue={defaultValue} required={required} rows={rows} style={{ ...inputStyle, resize: "vertical" }} />
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" };
const inputStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", padding: "9px 12px", fontSize: 14, color: "var(--ink)", width: "100%" };
const sectionTitle: React.CSSProperties = { margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "var(--ink)", borderBottom: "1px solid var(--border-soft)", paddingBottom: 8 };
const btnPrimary: React.CSSProperties = { display: "inline-flex", alignItems: "center", height: 38, padding: "0 16px", background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500, cursor: "pointer" };
const btnOutline: React.CSSProperties = { display: "inline-flex", alignItems: "center", height: 38, padding: "0 16px", background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--ink-soft)", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500, cursor: "pointer" };
