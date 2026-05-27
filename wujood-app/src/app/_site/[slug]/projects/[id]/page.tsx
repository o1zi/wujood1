import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string; id: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: p } = await supabase.from("projects").select("*").eq("id", params.id).single();
  return p ? { title: p.title_ar, description: p.description_ar ?? undefined, openGraph: { images: p.cover_url ? [p.cover_url] : [] } } : {};
}

export default async function ProjectDetailPage({ params }: { params: { slug: string; id: string } }) {
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants").select("*").eq("slug", params.slug).eq("is_active", true).single();
  if (!tenant) notFound();

  const { data: project } = await supabase
    .from("projects").select("*, images:project_images(*)").eq("id", params.id).eq("tenant_id", tenant.id).is("deleted_at", null).single();
  if (!project) notFound();

  const wa = (tenant.whatsapp ?? "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(`أود الاستفسار عن المشروع: ${project.title_ar}`);

  return (
    <div style={{ background: "#fff", color: "#14201a", fontFamily: "'IBM Plex Sans Arabic',sans-serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ padding: "20px 40px", borderBottom: "1px solid #eee", position: "sticky", top: 0, background: "rgba(255,255,255,.93)", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/projects" style={{ fontSize: 13, color: "#6e7770", display: "inline-flex", alignItems: "center", gap: 6 }}>← العودة للمشاريع</a>
          <span style={{ color: "#ddd" }}>|</span>
          <a href="/" style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 16, fontWeight: 600, color: "#14201a", display: "flex", alignItems: "center", gap: 8 }}>
            {tenant.logo_url && <img src={tenant.logo_url} alt="" style={{ height: 22, objectFit: "contain" }} />}
            {tenant.name_ar}
          </a>
        </div>
      </header>

      <main>
        {/* Cover */}
        <div style={{ height: "50vh", minHeight: 320, overflow: "hidden", background: "#f0f0f0", position: "relative" }}>
          {project.cover_url
            ? <img src={project.cover_url} alt={project.title_ar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0e3b2e,#1a6b50)" }} />}
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px" }}>
          {/* Title + badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {project.category && <span style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{project.category}</span>}
            {project.location && <span style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: 999, fontSize: 12 }}>{project.location}</span>}
            {project.year && <span style={{ padding: "4px 12px", background: "#fff8e8", color: "#b08a3e", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{project.year}</span>}
            {project.status && <span style={{ padding: "4px 12px", background: "#e8f5f0", color: "#0e3b2e", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{project.status}</span>}
          </div>
          <h1 style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, margin: "0 0 28px", letterSpacing: "-0.02em" }}>{project.title_ar}</h1>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60, marginBottom: 60 }} className="pd-grid">
            <div>
              {project.description_ar && (
                <p style={{ fontSize: 17, lineHeight: 1.85, color: "#3a3a3a", margin: "0 0 24px" }}>{project.description_ar}</p>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "#25D366", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  استفسر عن المشروع
                </a>
              )}
            </div>

            {/* Specs */}
            <div style={{ background: "#f9f9f7", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ margin: "0 0 8px", fontFamily: "'Reem Kufi',sans-serif", fontSize: 16, fontWeight: 600 }}>تفاصيل المشروع</h3>
              {[
                { label: "الموقع", value: project.location },
                { label: "السنة", value: project.year?.toString() },
                { label: "المساحة", value: project.area_sqm ? `${project.area_sqm} م²` : null },
                { label: "الحالة", value: project.status },
                { label: "الغرف", value: project.rooms?.toString() },
                { label: "الحمامات", value: project.bathrooms?.toString() },
                { label: "السعر", value: project.price ? `${project.price.toLocaleString("ar-SA")} ر.س` : null },
              ].filter((x) => x.value).map((x) => (
                <div key={x.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
                  <span style={{ color: "#6e7770" }}>{x.label}</span>
                  <span style={{ fontWeight: 500 }}>{x.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {(project.images ?? []).length > 0 && (
            <>
              <h2 style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 20 }}>معرض الصور</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="gallery-grid">
                {(project.images ?? []).map((img: { id: string; url: string }) => (
                  <div key={img.id} style={{ overflow: "hidden", borderRadius: 6, height: 200, background: "#f0f0f0" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #eee", padding: "32px 40px", textAlign: "center", fontSize: 13, color: "#9a9a9a" }}>
        © {new Date().getFullYear()} {tenant.name_ar} · مدعوم بواسطة وجود
      </footer>

      <style>{`
        a { text-decoration: none; }
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
