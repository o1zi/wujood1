"use client";

import { useState } from "react";
import { CoverImage } from "./CoverImage";
import type { TemplateProps } from "./types";

export default function LuxuryTemplate({ tenant: t, projects, services, stats, testimonials, faqs }: TemplateProps) {
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);

  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[]];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const wa = (t.whatsapp ?? "").replace(/\D/g, "");

  return (
    <div style={{ background: "#0a0a0a", color: "#f4ecd8", fontFamily: "'Cormorant Garamond','Markazi Text',serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Markazi+Text:wght@400;500;600;700&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Nav */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,.4)", backdropFilter: "blur(20px) saturate(180%)", borderBottom: "1px solid rgba(212,168,90,.15)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 1, height: 24, background: "#d4a85a" }}></span>
            {t.logo_url
              ? <img src={t.logo_url} alt="" style={{ height: 32, objectFit: "contain" }} />
              : <div>
                  <div style={{ fontFamily: "'Markazi Text',serif", fontSize: 22, fontWeight: 600, lineHeight: 1, color: "#f4ecd8" }}>{t.name_ar}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, color: "#d4a85a", letterSpacing: ".3em", textTransform: "uppercase", marginTop: 4 }}>EST. MMXI</div>
                </div>}
          </div>
          <nav style={{ display: "flex", gap: 36, fontSize: 14, fontFamily: "'Montserrat',sans-serif", fontWeight: 400, letterSpacing: ".12em", textTransform: "uppercase" }} className="lx-nav">
            {["Home", "Story", "Works", "Contact"].map((x) => (
              <a key={x} href="#" style={{ color: "rgba(244,236,216,.7)", fontSize: 11 }}>{x}</a>
            ))}
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: "11px 22px", border: "1px solid #d4a85a", color: "#d4a85a", fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase" }}>
              Inquire
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,10,10,.3) 0%,rgba(10,10,10,.65) 60%,#0a0a0a 100%)" }}>
          {t.cover_url && <img src={t.cover_url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .35 }} />}
        </div>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .15, pointerEvents: "none" }}>
          <defs>
            <pattern id="lx-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#d4a85a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lx-dots)" />
        </svg>
        <div style={{ position: "relative", maxWidth: 1340, margin: "0 auto", padding: "0 40px 120px", width: "100%" }}>
          <div style={{ maxWidth: 880 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
              <span style={{ width: 50, height: 1, background: "#d4a85a" }}></span>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: "#d4a85a" }}>Bespoke Architecture</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: "'Markazi Text',serif", fontSize: "clamp(60px,9vw,140px)", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.025em", color: "#f4ecd8" }}>
              {t.name_ar}
              <br />
              <em style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: "#d4a85a", fontWeight: 400 }}>يدوم.</em>
            </h1>
            {t.about_ar && (
              <p style={{ marginTop: 32, maxWidth: 540, fontSize: 19, lineHeight: 1.85, color: "rgba(244,236,216,.7)", fontFamily: "'Markazi Text',serif" }}>
                {t.about_ar.slice(0, 180)}
              </p>
            )}
            <div style={{ marginTop: 48, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#projects" style={{ padding: "15px 32px", background: "#d4a85a", color: "#0a0a0a", fontFamily: "'Montserrat',sans-serif", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 500 }}>View Portfolio</a>
              <a href="#contact" style={{ fontSize: 12, color: "rgba(244,236,216,.85)", fontFamily: "'Montserrat',sans-serif", letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid #d4a85a", paddingBottom: 6 }}>Begin Inquiry →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section style={{ padding: "0 40px", marginTop: -60, position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", background: "rgba(20,16,8,.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(212,168,90,.2)", padding: "50px 40px", display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: 30 }} className="lx-stats">
            {stats.slice(0, 4).map((s, i) => (
              <div key={s.id} style={{ textAlign: "center", borderInlineStart: i > 0 ? "1px solid rgba(212,168,90,.15)" : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 68, color: "#d4a85a", fontWeight: 400, lineHeight: 1 }}>
                  {s.prefix}{s.value}<span style={{ fontSize: 32, fontStyle: "italic" }}>{s.suffix}</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(244,236,216,.55)", fontFamily: "'Montserrat',sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {t.about_ar && (
        <section style={{ padding: "160px 40px 120px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "center" }} className="lx-about">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", insetInlineStart: -16, top: -16, right: 30, bottom: 30, border: "1px solid #d4a85a" }}></div>
              <div style={{ position: "relative" }}><CoverImage src={t.cover_url} seed={t.id} height={500} radius={0} /></div>
            </div>
            <div>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: "#d4a85a" }}>— The Studio</span>
              <h2 style={{ margin: "20px 0 28px", fontFamily: "'Markazi Text',serif", fontSize: "clamp(36px,4.5vw,64px)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.015em" }}>
                <em style={{ color: "#d4a85a", fontFamily: "'Cormorant Garamond',serif" }}>الفخامة</em><br />في تفاصيلها.
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.95, color: "rgba(244,236,216,.7)", fontFamily: "'Markazi Text',serif", margin: 0 }}>{t.about_ar}</p>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section style={{ padding: "120px 40px", background: "#0e0c08", borderTop: "1px solid rgba(212,168,90,.1)", borderBottom: "1px solid rgba(212,168,90,.1)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: "#d4a85a" }}>— Services</span>
              <h2 style={{ margin: "20px 0 0", fontFamily: "'Markazi Text',serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 500, letterSpacing: "-0.015em" }}>عمارة بِحرفية.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 30 }} className="lx-srv">
              {services.map((s, i) => (
                <div key={s.id} style={{ padding: 40, background: "rgba(244,236,216,.03)", border: "1px solid rgba(212,168,90,.15)", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 22 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 38, color: "#d4a85a" }}>
                      {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"][i] ?? i + 1}
                    </span>
                    <span style={{ flex: 1, height: 1, background: "rgba(212,168,90,.2)" }}></span>
                  </div>
                  <h3 style={{ margin: "0 0 14px", fontFamily: "'Markazi Text',serif", fontSize: 26, fontWeight: 600 }}>{s.title}</h3>
                  {s.description && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.8, color: "rgba(244,236,216,.65)", fontFamily: "'Markazi Text',serif" }}>{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "160px 40px 120px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
              <div>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: "#d4a85a" }}>— Portfolio</span>
                <h2 style={{ margin: "20px 0 0", fontFamily: "'Markazi Text',serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 500, letterSpacing: "-0.015em" }}>
                  <em style={{ color: "#d4a85a", fontFamily: "'Cormorant Garamond',serif" }}>Sélection</em> {new Date().getFullYear()}.
                </h2>
              </div>
              {cats.length > 1 && (
                <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                  {cats.slice(0, 4).map((c) => (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: filter === c ? "#d4a85a" : "rgba(244,236,216,.5)", paddingBottom: 4, borderBottom: filter === c ? "1px solid #d4a85a" : "none", cursor: "pointer", background: "none", border: "none" }}>
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filtered[0] && (
              <a href={`/projects/${filtered[0].id}`} style={{ marginBottom: 40, position: "relative", display: "block", textDecoration: "none" }}>
                <CoverImage src={filtered[0].cover_url} seed={filtered[0].id} height={520} radius={0} />
                <div style={{ position: "absolute", bottom: 30, insetInlineStart: 30, background: "rgba(10,10,10,.85)", backdropFilter: "blur(12px)", padding: "24px 30px", border: "1px solid rgba(212,168,90,.3)", maxWidth: 460 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: "#d4a85a", marginBottom: 10 }}>Featured · {filtered[0].year}</div>
                  <h3 style={{ margin: 0, fontFamily: "'Markazi Text',serif", fontSize: 28, fontWeight: 600, color: "#f4ecd8" }}>{filtered[0].title_ar}</h3>
                  {filtered[0].location && <div style={{ marginTop: 8, fontSize: 14, color: "rgba(244,236,216,.7)", fontFamily: "'Markazi Text',serif" }}>{filtered[0].location}</div>}
                </div>
              </a>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="lx-proj-grid">
              {filtered.slice(1, 7).map((p) => (
                <a key={p.id} href={`/projects/${p.id}`} style={{ position: "relative", cursor: "pointer", textDecoration: "none", color: "inherit", display: "block" }}>
                  <CoverImage src={p.cover_url} seed={p.id} height={260} radius={0} />
                  <div style={{ padding: "16px 0" }}>
                    {(p.category || p.year) && (
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: "#d4a85a" }}>
                        {p.category}{p.category && p.year ? " — " : ""}{p.year}
                      </div>
                    )}
                    <h3 style={{ margin: "6px 0 0", fontFamily: "'Markazi Text',serif", fontSize: 19, fontWeight: 600 }}>{p.title_ar}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonials.length > 0 && (
        <section style={{ padding: "120px 40px", background: "linear-gradient(180deg,transparent,rgba(212,168,90,.04),transparent)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 80, color: "#d4a85a", lineHeight: .5, marginBottom: 24 }}>"</div>
            <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(22px,2.8vw,32px)", lineHeight: 1.55, color: "rgba(244,236,216,.9)" }}>
              {testimonials[0].text}
            </p>
            <div style={{ marginTop: 40, fontFamily: "'Montserrat',sans-serif", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#d4a85a" }}>— {testimonials[0].client_name}</div>
            {testimonials[0].client_role && <div style={{ fontFamily: "'Markazi Text',serif", fontSize: 14, color: "rgba(244,236,216,.5)", marginTop: 6 }}>{testimonials[0].client_role}</div>}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: "80px 40px", background: "#0e0c08" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ marginBottom: 50, textAlign: "center" }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: "#d4a85a" }}>— FAQ</span>
              <h2 style={{ margin: "18px 0 0", fontFamily: "'Markazi Text',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 500 }}>أسئلة شائعة.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faqs.map((q) => (
                <div key={q.id} style={{ borderTop: "1px solid rgba(212,168,90,.15)" }}>
                  <button onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
                    style={{ width: "100%", textAlign: "right", padding: "22px 0", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Markazi Text',serif", fontSize: 18, fontWeight: 500, cursor: "pointer", background: "none", border: "none", color: "#f4ecd8" }}>
                    <span style={{ flex: 1 }}>{q.question}</span>
                    <span style={{ transform: openFaq === q.id ? "rotate(180deg)" : "none", transition: "transform .2s", color: "#d4a85a" }}>▾</span>
                  </button>
                  {openFaq === q.id && <div style={{ paddingBottom: 22, fontSize: 15, color: "rgba(244,236,216,.7)", lineHeight: 1.8, fontFamily: "'Markazi Text',serif" }}>{q.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" style={{ padding: "120px 40px 160px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", padding: "80px 60px", border: "1px solid rgba(212,168,90,.25)", position: "relative" }}>
          <div style={{ position: "absolute", insetInlineStart: 14, insetInlineEnd: 14, top: 14, bottom: 14, border: "1px solid rgba(212,168,90,.15)", pointerEvents: "none" }}></div>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: "#d4a85a" }}>— Begin</span>
          <h2 style={{ margin: "24px 0 28px", fontFamily: "'Markazi Text',serif", fontSize: "clamp(36px,4.5vw,64px)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.1 }}>
            مشروعك التالي،<br /><em style={{ fontFamily: "'Cormorant Garamond',serif", color: "#d4a85a" }}>يستحق الأناقة.</em>
          </h2>
          <div style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                style={{ padding: "14px 32px", background: "#d4a85a", color: "#0a0a0a", fontFamily: "'Montserrat',sans-serif", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600 }}>
                WhatsApp Inquiry
              </a>
            )}
            {t.phone && (
              <a href={`tel:${t.phone.replace(/\s/g, "")}`}
                style={{ padding: "14px 32px", border: "1px solid rgba(212,168,90,.4)", color: "#f4ecd8", fontFamily: "'Montserrat',sans-serif", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>
                {t.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "50px 40px", borderTop: "1px solid rgba(212,168,90,.1)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Markazi Text',serif", fontSize: 28, fontWeight: 600, color: "#f4ecd8" }}>{t.name_ar}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, color: "#d4a85a", letterSpacing: ".4em", textTransform: "uppercase", marginTop: 6 }}>EST. MMXI · MAINTAINED BY HAND</div>
          <div style={{ marginTop: 24, fontSize: 12, color: "rgba(244,236,216,.4)", letterSpacing: ".05em" }}>© {new Date().getFullYear()} {t.name_ar}</div>
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
          .lx-nav { display: none !important; }
          .lx-stats, .lx-about, .lx-srv { grid-template-columns: 1fr !important; }
          .lx-proj-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 620px) {
          .lx-proj-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function WaIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
