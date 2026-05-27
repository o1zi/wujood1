import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: t } = await supabase.from("tenants").select("*").eq("slug", params.slug).eq("is_active", true).single();
  return { title: t ? `تواصل مع ${t.name_ar}` : "تواصل معنا" };
}

export default async function ContactPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants").select("*").eq("slug", params.slug).eq("is_active", true).single();
  if (!tenant) notFound();

  const wa = (tenant.whatsapp ?? "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(tenant.whatsapp_note ?? `أود الاستفسار عن خدمات ${tenant.name_ar}`);

  return (
    <div style={{ background: "#fff", color: "#14201a", fontFamily: "'IBM Plex Sans Arabic',sans-serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ padding: "20px 40px", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 17, fontWeight: 600, color: "#14201a", display: "flex", alignItems: "center", gap: 8 }}>
            {tenant.logo_url && <img src={tenant.logo_url} alt="" style={{ height: 24, objectFit: "contain" }} />}
            {tenant.name_ar}
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>تواصل معنا</span>
          <h1 style={{ margin: "12px 0 16px", fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            نسعد بالتحدث إليك.
          </h1>
          {tenant.about_ar && (
            <p style={{ fontSize: 17, color: "#6e7770", lineHeight: 1.8, maxWidth: 580 }}>{tenant.about_ar.slice(0, 200)}</p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }} className="contact-grid">
          {wa && (
            <ContactCard
              icon={<WaIcon />}
              label="واتساب"
              value={tenant.whatsapp!}
              href={`https://wa.me/${wa}?text=${waMsg}`}
              primary
            />
          )}
          {tenant.phone && (
            <ContactCard icon="📞" label="هاتف" value={tenant.phone} href={`tel:${tenant.phone.replace(/\s/g, "")}`} />
          )}
          {tenant.email && (
            <ContactCard icon="✉️" label="بريد إلكتروني" value={tenant.email} href={`mailto:${tenant.email}`} />
          )}
          {tenant.address_ar && (
            <ContactCard icon="📍" label="العنوان" value={tenant.address_ar} href={tenant.maps_url ?? "#"} />
          )}
        </div>

        {/* Social links */}
        {tenant.social && Object.keys(tenant.social).length > 0 && (
          <div style={{ paddingTop: 32, borderTop: "1px solid #eee" }}>
            <h3 style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 18 }}>تابعنا على</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {Object.entries(tenant.social).map(([k, v]) => v ? (
                <a key={k} href={v as string} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", border: "1px solid #eee", borderRadius: 8, fontSize: 13, color: "#14201a", fontWeight: 500 }}>
                  {k === "instagram" ? "📷" : k === "twitter" ? "🐦" : k === "linkedin" ? "💼" : k === "youtube" ? "▶" : k === "snapchat" ? "👻" : "🔗"}
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </a>
              ) : null)}
            </div>
          </div>
        )}

        {wa && (
          <div style={{ marginTop: 56, padding: "40px", background: "linear-gradient(135deg,#0e3b2e,#1a5c40)", borderRadius: 16, textAlign: "center", color: "#fff" }}>
            <h2 style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 28, fontWeight: 600, margin: "0 0 12px" }}>ابدأ محادثة الآن</h2>
            <p style={{ fontSize: 15, opacity: .8, marginBottom: 28 }}>
              {tenant.whatsapp_note ?? "راسلنا على واتساب وسنرد عليك في أقرب وقت"}
            </p>
            <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "#25D366", color: "#fff", borderRadius: 8, fontSize: 15, fontWeight: 600 }}>
              <WaIcon />
              راسلنا على واتساب
            </a>
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #eee", padding: "28px 40px", textAlign: "center", fontSize: 13, color: "#9a9a9a", marginTop: 60 }}>
        © {new Date().getFullYear()} {tenant.name_ar} · مدعوم بواسطة وجود
      </footer>

      <style>{`
        a { text-decoration: none; }
        @media (max-width: 640px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function ContactCard({ icon, label, value, href, primary }: { icon: React.ReactNode; label: string; value: string; href: string; primary?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 24, border: `1px solid ${primary ? "#0e3b2e" : "#eee"}`, borderRadius: 12, background: primary ? "#f0f7f4" : "#fff", color: "#14201a", transition: "all .15s" }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, color: "#6e7770", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
      </div>
    </a>
  );
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
