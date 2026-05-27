import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: t } = await supabase.from("tenants").select("*").eq("slug", params.slug).eq("is_active", true).single();
  return { title: t ? `مشاريع ${t.name_ar}` : "المشاريع" };
}

export default async function ProjectsPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants").select("*").eq("slug", params.slug).eq("is_active", true).single();
  if (!tenant) notFound();

  const { data: projects } = await supabase
    .from("projects").select("*").eq("tenant_id", tenant.id).is("deleted_at", null).order("display_order");

  const wa = (tenant.whatsapp ?? "").replace(/\D/g, "");

  return (
    <div style={{ background: "#fff", color: "#14201a", fontFamily: "'IBM Plex Sans Arabic',sans-serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ padding: "20px 40px", borderBottom: "1px solid #eee", position: "sticky", top: 0, background: "rgba(255,255,255,.93)", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 18, fontWeight: 600, color: "#14201a", display: "flex", alignItems: "center", gap: 10 }}>
            {tenant.logo_url && <img src={tenant.logo_url} alt="" style={{ height: 26, objectFit: "contain" }} />}
            {tenant.name_ar}
          </a>
          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <a href="/" style={{ color: "#6e7770" }}>الرئيسية</a>
            <a href="/projects" style={{ color: "#14201a", fontWeight: 500, borderBottom: "2px solid #0e3b2e", paddingBottom: 2 }}>المشاريع</a>
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: "8px 16px", background: "#0e3b2e", color: "#fff", borderRadius: 6, fontSize: 13 }}>
              تواصل
            </a>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 40px" }}>
        <h1 style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 600, marginBottom: 48, letterSpacing: "-0.02em" }}>
          كل المشاريع
        </h1>

        {(projects ?? []).length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6e7770", fontSize: 16 }}>لا توجد مشاريع منشورة بعد</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }} className="proj-grid">
            {(projects ?? []).map((p) => (
              <a key={p.id} href={`/projects/${p.id}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <div style={{ overflow: "hidden", borderRadius: 8, height: 260, marginBottom: 16, background: "#f0f0f0", position: "relative" }}>
                  {p.cover_url
                    ? <img src={p.cover_url} alt={p.title_ar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0e3b2e,#1a6b50)" }} />}
                  {p.category && (
                    <span style={{ position: "absolute", top: 12, insetInlineStart: 12, padding: "3px 10px", background: "rgba(255,255,255,.9)", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{p.category}</span>
                  )}
                  {p.is_featured && (
                    <span style={{ position: "absolute", top: 12, insetInlineEnd: 12, padding: "3px 10px", background: "#b08a3e", color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 600 }}>مميز</span>
                  )}
                </div>
                <h2 style={{ margin: "0 0 6px", fontFamily: "'Reem Kufi',sans-serif", fontSize: 19, fontWeight: 600 }}>{p.title_ar}</h2>
                <div style={{ fontSize: 13, color: "#6e7770", display: "flex", gap: 10 }}>
                  {p.location && <span>{p.location}</span>}
                  {p.year && <><span>·</span><span>{p.year}</span></>}
                  {p.area_sqm && <><span>·</span><span>{p.area_sqm} م²</span></>}
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #eee", padding: "32px 40px", textAlign: "center", fontSize: 13, color: "#9a9a9a", marginTop: 80 }}>
        © {new Date().getFullYear()} {tenant.name_ar} · مدعوم بواسطة وجود
      </footer>

      <style>{`
        a { text-decoration: none; }
        @media (max-width: 900px) { .proj-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .proj-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
