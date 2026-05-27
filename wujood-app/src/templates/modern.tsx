"use client";

import { useState, useEffect } from "react";
import { CoverImage } from "./CoverImage";
import type { TemplateProps } from "./types";

export default function ModernTemplate({ tenant: t, projects, services, features, stats, testimonials, faqs }: TemplateProps) {
  const [filter, setFilter] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[]];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const wa = (t.whatsapp ?? "").replace(/\D/g, "");
  const initial = t.name_ar?.[0] ?? "م";
  const hasSocial = t.social && Object.keys(t.social).length > 0;

  return (
    <div style={{ background: "#ffffff", color: "#14201a", fontFamily: "'IBM Plex Sans Arabic', sans-serif", minHeight: "100vh", direction: "rtl" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,.93)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #eeeae0" : "1px solid transparent",
        transition: "all .25s",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <a href="#" style={{ fontFamily: "'Reem Kufi', sans-serif", fontSize: 20, fontWeight: 600, color: scrolled ? "#14201a" : "#fff", display: "inline-flex", alignItems: "center", gap: 8 }}>
            {t.logo_url
              ? <img src={t.logo_url} alt="" style={{ height: 28, width: 28, objectFit: "contain" }} />
              : <span style={{ width: 28, height: 28, borderRadius: 6, background: "#b08a3e", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'Reem Kufi', sans-serif" }}>{initial}</span>}
            {t.name_ar}
          </a>
          <nav style={{ display: "flex", gap: 4 }} className="mod-nav">
            {["الرئيسية", "الخدمات", "المشاريع", "تواصل"].map((x) => (
              <a key={x} href={`#${x === "الرئيسية" ? "hero" : x === "الخدمات" ? "services" : x === "المشاريع" ? "projects" : "contact"}`}
                style={{ padding: "8px 14px", fontSize: 14, color: scrolled ? "#14201a" : "#fff", opacity: .85, fontWeight: 500 }}>{x}</a>
            ))}
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: "9px 18px", background: "#b08a3e", color: "#fff", borderRadius: 8, fontSize: 13.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <WaIcon size={15} /> تواصل
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="hero" style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,rgba(14,59,46,.55) 0%,rgba(14,59,46,.85) 100%),linear-gradient(135deg,#1a6b50 0%,#0e3b2e 100%)",
        color: "#fff", position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}>
        {t.cover_url && (
          <img src={t.cover_url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .35 }} />
        )}
        <svg viewBox="0 0 1240 800" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .06, pointerEvents: "none" }}>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#fff" strokeWidth=".5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px 92px", width: "100%", position: "relative" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 12px", background: "rgba(255,255,255,.12)", backdropFilter: "blur(6px)", borderRadius: 999, fontSize: 12, marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#b08a3e" }}></span>
              {t.name_ar}
            </div>
            <h1 style={{ margin: 0, fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(40px,6vw,84px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              {t.about_ar ? t.about_ar.split("،")[0] : t.name_ar}
            </h1>
            {t.about_ar && (
              <p style={{ marginTop: 22, fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,.85)", maxWidth: 560 }}>
                {t.about_ar.slice(0, 200)}
              </p>
            )}
            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#projects" style={{ padding: "14px 28px", background: "#b08a3e", color: "#fff", borderRadius: 8, fontSize: 14.5, fontWeight: 500 }}>استعرض مشاريعنا ←</a>
              <a href="#contact" style={{ padding: "14px 28px", background: "rgba(255,255,255,.12)", backdropFilter: "blur(6px)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, fontSize: 14.5, fontWeight: 500 }}>تواصل معنا</a>
            </div>
          </div>
          {stats.length > 0 && (
            <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: 24, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,.18)" }} className="mod-stats">
              {stats.slice(0, 4).map((s) => (
                <div key={s.id}>
                  <div style={{ fontFamily: "'Reem Kufi', sans-serif", fontSize: 38, fontWeight: 600, color: "#b08a3e", display: "flex", alignItems: "baseline" }}>
                    {s.prefix}{s.value}<span style={{ fontSize: 22 }}>{s.suffix}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      {t.about_ar && (
        <section id="about" style={{ padding: "120px 28px", background: "#fafaf7" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }} className="mod-about">
            <CoverImage src={t.cover_url} seed={t.id} height={420} radius={12} />
            <div>
              <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>من نحن</span>
              <h2 style={{ margin: "12px 0 18px", fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                {t.name_ar}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#6e7770" }}>{t.about_ar}</p>
              {t.address_ar && <p style={{ marginTop: 14, fontSize: 14, color: "#6e7770" }}>📍 {t.address_ar}</p>}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section id="services" style={{ padding: "120px 28px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>خدماتنا</span>
              <h2 style={{ margin: "12px 0 14px", fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, letterSpacing: "-0.02em" }}>ما نقدمه لك.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(services.length, 4)},1fr)`, gap: 14 }} className="mod-srv">
              {services.map((s, i) => (
                <div key={s.id} style={{ padding: 24, background: "#fafaf7", border: "1px solid #eeeae0", borderRadius: 8, display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 10, background: "#0e3b2e", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {s.icon || "◆"}
                  </span>
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontFamily: "'Reem Kufi', sans-serif", fontSize: 18, fontWeight: 600 }}>{s.title}</h3>
                    {s.description && <p style={{ margin: 0, color: "#6e7770", fontSize: 13.5, lineHeight: 1.65 }}>{s.description}</p>}
                  </div>
                  <span style={{ fontFamily: "'Reem Kufi', sans-serif", fontSize: 12, color: "#b08a3e", opacity: .6, position: "absolute", top: 18, insetInlineEnd: 22 }}>0{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "120px 28px", background: "#fafaf7" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 20 }}>
              <div>
                <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>المشاريع</span>
                <h2 style={{ margin: "12px 0 0", fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, letterSpacing: "-0.02em" }}>مختارات من أعمالنا.</h2>
              </div>
              {cats.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {cats.map((c) => (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ padding: "8px 14px", fontSize: 13, borderRadius: 8, background: filter === c ? "#0e3b2e" : "transparent", color: filter === c ? "#fff" : "#14201a", border: `1px solid ${filter === c ? "#0e3b2e" : "#eeeae0"}`, fontWeight: 500, transition: "all .15s", cursor: "pointer" }}>
                      {c === "all" ? "الكل" : c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="mod-proj">
              {filtered.map((p) => (
                <a key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: 8, height: 280 }}>
                    <CoverImage src={p.cover_url} seed={p.id} height={280} radius={0} />
                    {p.category && (
                      <div style={{ position: "absolute", top: 14, insetInlineStart: 14 }}>
                        <span style={{ padding: "4px 10px", background: "rgba(255,255,255,.95)", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{p.category}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: "'Reem Kufi', sans-serif", fontSize: 19, fontWeight: 600 }}>{p.title_ar}</h3>
                    <div style={{ marginTop: 4, fontSize: 13, color: "#6e7770", display: "flex", gap: 12 }}>
                      {p.location && <span>{p.location}</span>}
                      {p.year && <span style={{ color: "#b08a3e" }}>{p.year}</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section style={{ padding: "120px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>لماذا نحن</span>
              <h2 style={{ margin: "12px 0 0", fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, letterSpacing: "-0.02em" }}>ما يميّزنا.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(features.length, 4)},1fr)`, gap: 14 }} className="mod-feat">
              {features.map((f, i) => (
                <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: 14, padding: 24, borderInlineStart: i > 0 ? "1px solid #eeeae0" : "none" }} className="mod-fi">
                  <span style={{ color: "#b08a3e", fontSize: 24 }}>{f.icon || "✦"}</span>
                  <h3 style={{ margin: 0, fontFamily: "'Reem Kufi', sans-serif", fontSize: 18, fontWeight: 600 }}>{f.title}</h3>
                  {f.description && <p style={{ margin: 0, fontSize: 13.5, color: "#6e7770", lineHeight: 1.65 }}>{f.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section style={{ padding: "100px 28px", background: "#0e3b2e", color: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ marginBottom: 48 }}>
              <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>شهادات</span>
              <h2 style={{ margin: "12px 0 0", fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, letterSpacing: "-0.02em" }}>عملاؤنا يحكون عنا.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="mod-testi">
              {testimonials.map((tm) => (
                <div key={tm.id} style={{ padding: 28, background: "rgba(255,255,255,.05)", backdropFilter: "blur(6px)", borderRadius: 8, border: "1px solid rgba(255,255,255,.08)" }}>
                  {tm.rating && (
                    <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                      {Array.from({ length: tm.rating }).map((_, i) => <span key={i} style={{ color: "#b08a3e" }}>★</span>)}
                    </div>
                  )}
                  <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,.92)" }}>"{tm.text}"</p>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{tm.client_name}</div>
                    {tm.client_role && <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{tm.client_role}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: "120px 28px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ marginBottom: 40, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "#b08a3e", letterSpacing: ".15em", textTransform: "uppercase" }}>أسئلة</span>
              <h2 style={{ margin: "12px 0 0", fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, letterSpacing: "-0.02em" }}>الأسئلة الشائعة.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faqs.map((q) => (
                <div key={q.id} style={{ border: "1px solid #eeeae0", borderRadius: 8, background: "#fafaf7" }}>
                  <button onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
                    style={{ width: "100%", textAlign: "right", padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Reem Kufi', sans-serif", fontSize: 16, fontWeight: 500, cursor: "pointer", background: "none", border: "none" }}>
                    <span style={{ flex: 1 }}>{q.question}</span>
                    <span style={{ transform: openFaq === q.id ? "rotate(180deg)" : "none", transition: "transform .2s", color: "#b08a3e" }}>▾</span>
                  </button>
                  {openFaq === q.id && (
                    <div style={{ padding: "0 22px 18px", color: "#6e7770", fontSize: 14.5, lineHeight: 1.75 }}>{q.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", background: "#0e3b2e", color: "#fff", borderRadius: 16, padding: "64px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <h2 style={{ margin: 0, fontFamily: "'Reem Kufi', sans-serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            مشروعك القادم يستحق <span style={{ color: "#b08a3e" }}>الأفضل.</span>
          </h2>
          <p style={{ margin: "14px 0 28px", color: "rgba(255,255,255,.7)", fontSize: 16, maxWidth: 560, marginInline: "auto" }}>
            راسلنا للاستشارة الأولية ودعنا نناقش رؤيتك.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {wa && (
              <a href={`https://wa.me/${wa}${t.whatsapp_note ? `?text=${encodeURIComponent(t.whatsapp_note)}` : ""}`} target="_blank" rel="noopener noreferrer"
                style={{ padding: "14px 28px", background: "#b08a3e", color: "#fff", borderRadius: 8, fontSize: 14.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <WaIcon size={18} /> ابدأ محادثة واتساب
              </a>
            )}
            {t.phone && (
              <a href={`tel:${t.phone.replace(/\s/g, "")}`}
                style={{ padding: "14px 28px", background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, fontSize: 14.5, fontWeight: 500 }}>
                📞 {t.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0a0a0a", color: "rgba(255,255,255,.6)", padding: "60px 28px 30px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 40 }} className="mod-footer">
            <div>
              <div style={{ fontFamily: "'Reem Kufi', sans-serif", fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                {t.logo_url ? <img src={t.logo_url} alt="" style={{ height: 28, objectFit: "contain" }} /> : <span style={{ width: 28, height: 28, borderRadius: 4, background: "#b08a3e", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>{initial}</span>}
                {t.name_ar}
              </div>
              {t.about_ar && <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>{t.about_ar.slice(0, 120)}...</p>}
              {hasSocial && (
                <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                  {Object.entries(t.social!).map(([k, v]) => v ? (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                      style={{ width: 36, height: 36, background: "rgba(255,255,255,.05)", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13 }}>
                      {k === "instagram" ? "📷" : k === "twitter" ? "🐦" : k === "linkedin" ? "💼" : k === "youtube" ? "▶" : "🔗"}
                    </a>
                  ) : null)}
                </div>
              )}
            </div>
            <div>
              <h4 style={{ margin: "0 0 14px", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Reem Kufi', sans-serif" }}>استكشف</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                {["الرئيسية", "الخدمات", "المشاريع", "تواصل"].map((x) => (
                  <li key={x}><a href="#" style={{ color: "rgba(255,255,255,.6)" }}>{x}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ margin: "0 0 14px", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Reem Kufi', sans-serif" }}>تواصل</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                {t.phone && <li>{t.phone}</li>}
                {t.email && <li>{t.email}</li>}
                {t.address_ar && <li>{t.address_ar}</li>}
              </ul>
            </div>
          </div>
          <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontSize: 12 }}>
            <div>© {new Date().getFullYear()} {t.name_ar}. جميع الحقوق محفوظة.</div>
            <div style={{ opacity: .4 }}>مدعوم بواسطة وجود</div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      {wa && (
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
          style={{ position: "fixed", bottom: 28, insetInlineStart: 24, width: 56, height: 56, borderRadius: "50%", background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(37,211,102,.4)", zIndex: 40 }}>
          <WaIcon size={26} />
        </a>
      )}

      <style>{`
        .mod-nav a { text-decoration: none; }
        footer a { text-decoration: none; }
        @media (max-width: 980px) {
          .mod-nav { display: none !important; }
          .mod-about { grid-template-columns: 1fr !important; }
          .mod-srv, .mod-feat, .mod-testi, .mod-proj { grid-template-columns: repeat(2,1fr) !important; }
          .mod-stats { grid-template-columns: repeat(2,1fr) !important; gap: 16px !important; }
          .mod-fi { border-inline-start: none !important; }
          .mod-footer { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 620px) {
          .mod-srv, .mod-feat, .mod-testi, .mod-proj { grid-template-columns: 1fr !important; }
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
