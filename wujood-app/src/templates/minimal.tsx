"use client";

import { useState } from "react";
import { CoverImage } from "./CoverImage";
import type { TemplateProps } from "./types";

export default function MinimalTemplate({ tenant: t, projects, services, stats, testimonials, faqs }: TemplateProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);
  const wa = (t.whatsapp ?? "").replace(/\D/g, "");

  return (
    <div style={{ background: "#fcfcfc", color: "#1a1a1a", fontFamily: "'Tajawal','IBM Plex Sans Arabic',sans-serif", minHeight: "100vh", direction: "rtl", fontWeight: 300 }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <header style={{ padding: "36px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ fontSize: 16, fontWeight: 500, letterSpacing: ".02em", color: "#1a1a1a", display: "flex", alignItems: "center", gap: 10 }}>
            {t.logo_url && <img src={t.logo_url} alt="" style={{ height: 28, objectFit: "contain" }} />}
            {t.name_ar}
          </a>
          <nav style={{ display: "flex", gap: 36, fontSize: 13.5, fontWeight: 400 }} className="min-nav">
            {["أعمال", "خدمات", "تواصل"].map((x) => <a key={x} href="#" style={{ color: "#1a1a1a" }}>{x}</a>)}
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13.5, color: "#1a1a1a", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a1a1a" }}></span>
              متاحون للعمل
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "160px 60px 200px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 880 }}>
            <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 32, letterSpacing: ".04em" }}>① {t.name_ar} — {t.address_ar || "المملكة العربية السعودية"}</div>
            <h1 style={{ margin: 0, fontSize: "clamp(38px,5vw,76px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
              {t.about_ar ? t.about_ar.split("،")[0] + "،" : t.name_ar}
              <br />
              <span style={{ color: "#9a9a9a" }}>بدقة واحترافية.</span>
            </h1>
          </div>
          <div style={{ marginTop: 100, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 80, alignItems: "end" }} className="min-hero-foot">
            {t.about_ar && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8, color: "#5a5a5a", fontWeight: 300, maxWidth: 540 }}>{t.about_ar.slice(0, 200)}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <a href="#projects" style={{ fontSize: 14, color: "#1a1a1a", paddingBottom: 8, borderBottom: "1px solid #1a1a1a", display: "inline-block", width: "fit-content" }}>استعرض الأعمال →</a>
              <a href="#contact" style={{ fontSize: 14, color: "#9a9a9a", paddingBottom: 8, borderBottom: "1px solid #d4d4d4", display: "inline-block", width: "fit-content" }}>تواصل →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section style={{ padding: "0 60px 160px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <CoverImage src={t.cover_url ?? (projects[0]?.cover_url ?? null)} seed={t.id} height={620} radius={0} />
          {projects[0] && (
            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 13, color: "#9a9a9a" }}>
              <div>
                <div style={{ color: "#1a1a1a", fontSize: 14, marginBottom: 2, fontWeight: 400 }}>{projects[0].title_ar}</div>
                <div>{projects[0].location}{projects[0].location && projects[0].year ? " · " : ""}{projects[0].year}</div>
              </div>
              <div style={{ fontSize: 12 }}>01 / مختارة</div>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section style={{ padding: "120px 60px", borderTop: "1px solid #ececec" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 }} className="min-srv-wrap">
            <div>
              <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 18, letterSpacing: ".04em" }}>② ما نقدمه</div>
              <h2 style={{ margin: 0, fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.02em" }}>خدماتنا،<br />تركيز واحد.</h2>
            </div>
            <div>
              {services.map((s, i) => (
                <div key={s.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr", padding: "32px 0", borderTop: "1px solid #ececec", gap: 30, alignItems: "start" }}>
                  <span style={{ fontSize: 13, color: "#9a9a9a", paddingTop: 4 }}>0{i + 1}</span>
                  <div>
                    <h3 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em" }}>{s.title}</h3>
                    {s.description && <p style={{ margin: 0, fontSize: 15, color: "#5a5a5a", lineHeight: 1.8, maxWidth: 540 }}>{s.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "160px 60px", background: "#f7f6f3" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ marginBottom: 80, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 18, letterSpacing: ".04em" }}>③ مختارات</div>
                <h2 style={{ margin: 0, fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.02em" }}>أعمال نختار أن نُريك إيّاها.</h2>
              </div>
              <a href="/projects" style={{ fontSize: 14, paddingBottom: 6, borderBottom: "1px solid #1a1a1a", color: "#1a1a1a" }}>كل الأعمال ({projects.length}) →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="min-proj">
              {projects.slice(0, 4).map((p, i) => (
                <a key={p.id} href={`/projects/${p.id}`} style={{ textAlign: "right", background: "transparent", cursor: "pointer", marginTop: i % 2 === 1 ? 100 : 0, textDecoration: "none", color: "inherit", display: "block" }} className="min-pcard">
                  <CoverImage src={p.cover_url} seed={p.id} height={i % 2 === 0 ? 460 : 380} radius={0} />
                  <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 400 }}>{p.title_ar}</h3>
                      {p.location && <div style={{ fontSize: 13, color: "#9a9a9a" }}>{p.location}</div>}
                    </div>
                    {p.year && <div style={{ fontSize: 13, color: "#9a9a9a" }}>{p.year}</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <section style={{ padding: "120px 60px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 50, letterSpacing: ".04em" }}>④ أرقام نتحدث بها</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: 0 }} className="min-stats">
              {stats.slice(0, 4).map((s) => (
                <div key={s.id} style={{ padding: "24px 0", borderTop: "1px solid #ececec", paddingInlineEnd: 30 }}>
                  <div style={{ fontSize: 56, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.02em" }}>
                    {s.prefix}{s.value}<span style={{ fontSize: 30, color: "#9a9a9a" }}>{s.suffix}</span>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 13, color: "#9a9a9a" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonials.length > 0 && (
        <section style={{ padding: "160px 60px", borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 36, letterSpacing: ".04em" }}>⑤ شهادة</div>
            <p style={{ margin: 0, fontSize: "clamp(22px,2.5vw,32px)", lineHeight: 1.55, fontWeight: 300, letterSpacing: "-0.01em" }}>"{testimonials[0].text}"</p>
            <div style={{ marginTop: 36, fontSize: 14 }}>
              <span style={{ color: "#1a1a1a" }}>{testimonials[0].client_name}</span>
              {testimonials[0].client_role && <span style={{ color: "#9a9a9a", marginInlineStart: 8 }}>— {testimonials[0].client_role}</span>}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: "120px 60px", borderBottom: "1px solid #ececec" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 36, letterSpacing: ".04em" }}>⑥ أسئلة شائعة</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faqs.map((q) => (
                <div key={q.id} style={{ borderTop: "1px solid #ececec" }}>
                  <button onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
                    style={{ width: "100%", textAlign: "right", padding: "22px 0", display: "flex", alignItems: "center", gap: 12, fontSize: 17, fontWeight: 300, cursor: "pointer", background: "none", border: "none" }}>
                    <span style={{ flex: 1 }}>{q.question}</span>
                    <span style={{ transform: openFaq === q.id ? "rotate(45deg)" : "none", transition: "transform .2s", fontSize: 20, color: "#9a9a9a" }}>+</span>
                  </button>
                  {openFaq === q.id && <div style={{ paddingBottom: 22, fontSize: 15, color: "#5a5a5a", lineHeight: 1.8 }}>{q.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" style={{ padding: "160px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 36, letterSpacing: ".04em" }}>⑦ تواصل</div>
          <h2 style={{ margin: 0, fontSize: "clamp(40px,5vw,76px)", fontWeight: 200, lineHeight: 1.1, letterSpacing: "-0.025em", maxWidth: 880 }}>
            <span style={{ color: "#9a9a9a" }}>هل لديك مشروع؟</span><br />دعنا نتحدث.
          </h2>
          <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40, maxWidth: 720 }} className="min-contact">
            {wa && <ContactLine label="واتساب" value={t.whatsapp!} href={`https://wa.me/${wa}`} />}
            {t.phone && <ContactLine label="هاتف" value={t.phone} href={`tel:${t.phone.replace(/\s/g, "")}`} />}
            {t.email && <ContactLine label="بريد" value={t.email} href={`mailto:${t.email}`} />}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 60px", borderTop: "1px solid #ececec" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#9a9a9a" }}>
          <span>© {new Date().getFullYear()} {t.name_ar}</span>
          {t.address_ar && <span>{t.address_ar}</span>}
        </div>
      </footer>

      {wa && (
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
          style={{ position: "fixed", bottom: 28, insetInlineStart: 24, width: 56, height: 56, borderRadius: "50%", background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(37,211,102,.4)", zIndex: 40 }}>
          <WaIcon size={26} />
        </a>
      )}

      <style>{`
        a { text-decoration: none; }
        @media (max-width: 980px) {
          .min-nav { display: none !important; }
          .min-hero-foot, .min-srv-wrap, .min-proj, .min-stats, .min-contact { grid-template-columns: 1fr !important; gap: 40px !important; }
          .min-pcard { margin-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "#1a1a1a" }}>
      <div style={{ fontSize: 11, color: "#9a9a9a", marginBottom: 8, letterSpacing: ".04em" }}>{label}</div>
      <div style={{ fontSize: 16, paddingBottom: 8, borderBottom: "1px solid #1a1a1a", fontWeight: 400 }}>{value}</div>
    </a>
  );
}

function WaIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
