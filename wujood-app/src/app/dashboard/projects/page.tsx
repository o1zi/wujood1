import Link from "next/link";
import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants";
import type { Project } from "@/lib/types";

export const metadata = { title: "المشاريع والأعمال" };

export default async function ProjectsPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("tenant_id", tenant.id)
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  const plan = PLANS[tenant.plan];
  const projectCount = projects?.length ?? 0;
  const atLimit = plan.projects !== Infinity && projectCount >= plan.projects;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>المشاريع والأعمال</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted)" }}>
            {projectCount} / {plan.projects === Infinity ? "∞" : plan.projects} مشروع
          </p>
        </div>
        {atLimit ? (
          <Link href="/dashboard/subscription" style={{
            display: "inline-flex", alignItems: "center", height: 38, padding: "0 16px",
            background: "var(--accent)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500,
          }}>
            ترقية الباقة
          </Link>
        ) : (
          <Link href="/dashboard/projects/new" style={{
            display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 16px",
            background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 500,
          }}>
            + إضافة مشروع
          </Link>
        )}
      </div>

      {atLimit && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: "var(--warn-soft)", borderRadius: "var(--r-md)", border: "1px solid var(--warn)", fontSize: 14, color: "var(--warn)", fontWeight: 500 }}>
          وصلت للحد الأقصى ({plan.projects} مشاريع) في الباقة الحالية.{" "}
          <Link href="/dashboard/subscription" style={{ color: "var(--accent)", textDecoration: "underline" }}>ترقية الباقة</Link>
        </div>
      )}

      {projects && projects.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {(projects as Project[]).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>لا توجد مشاريع بعد</h3>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--muted)" }}>ابدأ بإضافة مشاريعك ليراها زوار موقعك</p>
          <Link href="/dashboard/projects/new" style={{
            display: "inline-flex", alignItems: "center", height: 38, padding: "0 18px",
            background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)", fontSize: 14, fontWeight: 500,
          }}>
            + إضافة أول مشروع
          </Link>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ height: 140, background: "var(--bg-alt)", position: "relative" }}>
        {project.cover_url ? (
          <img src={project.cover_url} alt={project.title_ar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🏗</div>
        )}
        {project.is_featured && (
          <span style={{
            position: "absolute", top: 8, insetInlineEnd: 8,
            background: "var(--accent)", color: "#fff",
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--r-pill)",
          }}>
            مميز
          </span>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {project.title_ar}
        </h3>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {[project.category, project.location, project.year].filter(Boolean).join(" · ")}
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
          <Link href={`/dashboard/projects/${project.id}`} style={{
            display: "inline-flex", alignItems: "center", height: 30, padding: "0 12px",
            border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
            fontSize: 12, fontWeight: 500, color: "var(--ink-soft)",
          }}>
            تعديل
          </Link>
        </div>
      </div>
    </div>
  );
}
