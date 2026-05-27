"use client";

import { useState } from "react";
import { CoverImage } from "./CoverImage";
import type { TemplateProps } from "./types";

const STAR_SVG = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><g fill='none' stroke='#b85c3d' stroke-width='.6' opacity='.18'><path d='M30 4l6 14 14 2-10 10 3 14L30 38l-13 6 3-14-10-10 14-2z'/><circle cx='30' cy='30' r='28'/></g></svg>`);
const PATTERN = `url("data:image/svg+xml,${STAR_SVG}")`;

export default function HeritageTemplate({ tenant: t, projects, services, stats, testimonials, faqs }: TemplateProps) {
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);

  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const wa = (t.whatsapp ?? "").replace(/\D/g, "");
  const initial = t.name_ar?.[0] ?? "م";

  return (
    <div style={{ background: "#f4e9d4", color: "#3a2a1c", fontFamily: "'Markazi Text','Amiri',serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Markazi+Text:wght@400;500;600;700&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <header style={{ background: "#f4e9d4", borderBottom: "1px solid #d4c19a" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {t.logo_url
              ? <img src={t.logo_url} alt="" style={{ height: 46, objectFit: "contain" }} />
              : <span style={{ width: 46, height: 46, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#b85c3d", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#f4e9d4", fontFamily: "'Amiri',serif", fontSize: 24, fontWeight: 700 }}>{initial}</span>}
            <div>
              <div style={{ fontFamily: "'Amiri',serif", fontSize: 24, fontWeight: 700, lineHeight: 1, color: "#3a2a1c" }}>{t.name_ar}</div>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 10, color: "#b85c3d", letterSpacing: ".18em", textTransform: "uppercase", marginTop: 4 }}>للاستشارات الهندسية</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 30, fontSize: 16, fontFamily: "'Markazi Text',serif", fontWeight: 500 }} className="hrt-nav">
            {["الرئيسية", "من نحن", "أعمالنا", "خدماتنا", "تواصل"].map((x) => (
              <a key={x} href="#" style={{ color: "#3a2a1c", paddingBottom: 4 }}>{x}</a>
            ))}
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: "11px 24px", borderRadius: "999px", background: "#b85c3d", color: "#f4e9d4", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>
              تواصل معنا
            </a>
          )}
        </div>
        <div style={{ height: 8, background: PATTERN, backgroundSize: "40px 40px", borderTop: "1px solid #d4c19a" }}></div>
      </header>

      {/* Hero */}
      <section style={{ padding: "70px 36px 90px", background: "#f4e9d4", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: PATTERN, backgroundSize: "120px 120px", opacity: .4, pointerEvents: "none" }}></div>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }} className="hrt-hero">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
              <span style={{ width: 8, height: 8, background: "#b85c3d", transform: "rotate(45deg)" }}></span>
              <span style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".25em", textTransform: "uppercase", color: "#b85c3d", fontWeight: 600 }}>عمارة سعودية · حِسٌّ محلي</span>
              <span style={{ flex: 1, height: 1, background: "#d4c19a" }}></span>
            </div>
            <h1 style={{ margin: 0, fontFamily: "'Amiri',serif", fontSize: "clamp(48px,7vw,96px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.015em", color: "#3a2a1c" }}>
              {t.name_ar}
              <br />
              <span style={{ color: "#b85c3d" }}>يبني بعناية.</span>
            </h1>
            {t.about_ar && (
              <p style={{ marginTop: 26, fontSize: 19, lineHeight: 1.85, color: "#5c4830", fontFamily: "'Markazi Text',serif", maxWidth: 520 }}>
                {t.about_ar.slice(0, 200)}
              </p>
            )}
            <div style={{ marginTop: 36, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#projects" style={{ padding: "14px 28px", borderRadius: 999, background: "#3a2a1c", color: "#f4e9d4", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>استعرض أعمالنا</a>
              {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontFamily: "'Markazi Text',serif", color: "#3a2a1c", borderBottom: "1.5px solid #b85c3d", paddingBottom: 6, fontWeight: 500 }}>تواصل مباشر ←</a>}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: "50% 50% 8px 8px / 35% 35% 8px 8px", overflow: "hidden", border: "1px solid #d4c19a", boxShadow: "0 30px 60px -20px rgba(58,42,28,.3)" }}>
              <CoverImage src={t.cover_url} seed={t.id} height={540} radius={0} />
            </div>
            {stats.length > 0 && (
              <div style={{ position: "absolute", bottom: 28, insetInlineStart: -20, background: "#f4e9d4", border: "1px solid #b85c3d", padding: "14px 22px", borderRadius: 12, textAlign: "center", boxShadow: "0 8px 20px rgba(58,42,28,.12)" }}>
                <div style={{ fontFamily: "'Amiri',serif", fontSize: 36, color: "#b85c3d", fontWeight: 700, lineHeight: 1 }}>{stats[0].value}{stats[0].suffix}</div>
                <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 10, color: "#5c4830", letterSpacing: ".12em", textTransform: "uppercase", marginTop: 4 }}>{stats[0].label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section style={{ background: "#3a2a1c", color: "#f4e9d4", padding: "54px 36px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: PATTERN, backgroundSize: "60px 60px", opacity: .25, filter: "invert(1)" }}></div>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: 36, position: "relative" }} className="hrt-stats">
            {stats.slice(0, 4).map((s, i) => (
              <div key={s.id} style={{ textAlign: "center", borderInlineStart: i > 0 ? "1px dashed rgba(244,233,212,.25)" : "none" }}>
                <div style={{ fontFamily: "'Amiri',serif", fontSize: 60, color: "#e8a878", fontWeight: 700, lineHeight: 1 }}>{s.prefix}{s.value}<span style={{ fontSize: 30 }}>{s.suffix}</span></div>
                <div style={{ marginTop: 10, fontSize: 13, fontFamily: "'Reem Kufi',sans-serif", letterSpacing: ".1em", color: "rgba(244,233,212,.7)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {t.about_ar && (
        <section style={{ padding: "110px 36px", background: "#f4e9d4", position: "relative" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 22 }}>
              <span style={{ height: 1, width: 50, background: "#b85c3d" }}></span>
              <span style={{ width: 8, height: 8, background: "#b85c3d", transform: "rotate(45deg)" }}></span>
              <span style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".25em", textTransform: "uppercase", color: "#b85c3d", fontWeight: 600 }}>قصتنا</span>
              <span style={{ width: 8, height: 8, background: "#b85c3d", transform: "rotate(45deg)" }}></span>
              <span style={{ height: 1, width: 50, background: "#b85c3d" }}></span>
            </div>
            <h2 style={{ margin: "0 0 28px", fontFamily: "'Amiri',serif", fontSize: "clamp(34px,4.5vw,56px)", fontWeight: 700, lineHeight: 1.15, color: "#3a2a1c" }}>
              {t.name_ar}<br /><span style={{ color: "#b85c3d" }}>وتحترم الناس.</span>
            </h2>
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.95, color: "#5c4830", fontFamily: "'Markazi Text',serif" }}>{t.about_ar}</p>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section style={{ padding: "90px 36px", background: "#e3d3b5", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: PATTERN, backgroundSize: "100px 100px", opacity: .35, pointerEvents: "none" }}></div>
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".25em", textTransform: "uppercase", color: "#b85c3d", fontWeight: 600, marginBottom: 12 }}>خدماتنا</div>
              <h2 style={{ margin: 0, fontFamily: "'Amiri',serif", fontSize: "clamp(34px,4.5vw,56px)", fontWeight: 700 }}>ما نقدمه لك.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(services.length, 4)},1fr)`, gap: 18 }} className="hrt-srv">
              {services.map((s) => (
                <div key={s.id} style={{ background: "#f4e9d4", padding: "34px 26px 28px", borderRadius: "12px 12px 50% 50% / 12px 12px 8% 8%", border: "1px solid #d4c19a", textAlign: "center", position: "relative" }}>
                  <div style={{ width: 60, height: 60, background: "#3a2a1c", color: "#f4e9d4", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: "2px solid #b85c3d", fontSize: 20 }}>
                    {s.icon || "◆"}
                  </div>
                  <h3 style={{ margin: "0 0 10px", fontFamily: "'Amiri',serif", fontSize: 22, fontWeight: 700 }}>{s.title}</h3>
                  <div style={{ width: 30, height: 1, background: "#b85c3d", margin: "0 auto 12px" }}></div>
                  {s.description && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#5c4830", fontFamily: "'Markazi Text',serif" }}>{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "110px 36px", background: "#f4e9d4" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".25em", textTransform: "uppercase", color: "#b85c3d", fontWeight: 600, marginBottom: 12 }}>أعمالنا</div>
                <h2 style={{ margin: 0, fontFamily: "'Amiri',serif", fontSize: "clamp(34px,4.5vw,56px)", fontWeight: 700 }}>مختاراتٌ من بناءاتنا.</h2>
              </div>
              {cats.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {cats.slice(0, 5).map((c) => (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ padding: "8px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, background: filter === c ? "#3a2a1c" : "transparent", color: filter === c ? "#f4e9d4" : "#3a2a1c", border: `1px solid ${filter === c ? "#3a2a1c" : "#d4c19a"}`, fontFamily: "'Markazi Text',serif", cursor: "pointer" }}>
                      {c === "all" ? "الكل" : c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="hrt-proj">
              {filtered.slice(0, 6).map((p) => (
                <a key={p.id} href={`/projects/${p.id}`} style={{ background: "#fff", border: "1px solid #d4c19a", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px -8px rgba(58,42,28,.2)", textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ position: "relative" }}>
                    <CoverImage src={p.cover_url} seed={p.id} height={240} radius={0} />
                    {p.category && <span style={{ position: "absolute", top: 14, insetInlineStart: 14, padding: "4px 12px", background: "rgba(58,42,28,.92)", color: "#f4e9d4", borderRadius: 999, fontSize: 11, fontFamily: "'Reem Kufi',sans-serif", letterSpacing: ".08em" }}>{p.category}</span>}
                  </div>
                  <div style={{ padding: "18px 20px 22px" }}>
                    <h3 style={{ margin: "0 0 6px", fontFamily: "'Amiri',serif", fontSize: 20, fontWeight: 700 }}>{p.title_ar}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7a6240", fontFamily: "'Markazi Text',serif" }}>
                      {p.location && <span>{p.location}</span>}
                      {p.year && <span style={{ color: "#b85c3d" }}>{p.year}</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonials.length > 0 && (
        <section style={{ padding: "90px 36px", background: "#b85c3d", color: "#f4e9d4", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: PATTERN, backgroundSize: "80px 80px", opacity: .15, filter: "invert(.7)" }}></div>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <div style={{ fontFamily: "'Amiri',serif", fontSize: 72, lineHeight: .5, marginBottom: 22, opacity: .6 }}>"</div>
            <p style={{ margin: 0, fontFamily: "'Amiri',serif", fontSize: "clamp(22px,2.8vw,32px)", lineHeight: 1.65, fontWeight: 400 }}>{testimonials[0].text}</p>
            <div style={{ width: 50, height: 1, background: "#f4e9d4", margin: "32px auto", opacity: .5 }}></div>
            <div style={{ fontFamily: "'Amiri',serif", fontSize: 18, fontWeight: 700 }}>— {testimonials[0].client_name}</div>
            {testimonials[0].client_role && <div style={{ fontSize: 13, opacity: .8, marginTop: 4, fontFamily: "'Reem Kufi',sans-serif" }}>{testimonials[0].client_role}</div>}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: "80px 36px", background: "#f4e9d4" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".25em", textTransform: "uppercase", color: "#b85c3d", fontWeight: 600, marginBottom: 12 }}>أسئلة</div>
              <h2 style={{ margin: 0, fontFamily: "'Amiri',serif", fontSize: "clamp(34px,4.5vw,56px)", fontWeight: 700 }}>الأسئلة الشائعة.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faqs.map((q) => (
                <div key={q.id} style={{ border: "1px solid #d4c19a", borderRadius: 8, background: "#fff" }}>
                  <button onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
                    style={{ width: "100%", textAlign: "right", padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Amiri',serif", fontSize: 18, fontWeight: 700, cursor: "pointer", background: "none", border: "none" }}>
                    <span style={{ flex: 1 }}>{q.question}</span>
                    <span style={{ transform: openFaq === q.id ? "rotate(180deg)" : "none", transition: "transform .2s", color: "#b85c3d" }}>▾</span>
                  </button>
                  {openFaq === q.id && (
                    <div style={{ padding: "0 22px 18px", color: "#5c4830", fontSize: 15, lineHeight: 1.75, fontFamily: "'Markazi Text',serif" }}>{q.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 36px", background: "#f4e9d4", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ width: 70, height: 70, background: "#3a2a1c", color: "#f4e9d4", borderRadius: "50% 50% 8px 8px / 35% 35% 8px 8px", margin: "0 auto 22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            <WaIcon size={28} />
          </div>
          <h2 style={{ margin: "0 0 18px", fontFamily: "'Amiri',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, lineHeight: 1.1 }}>
            بيتُك القادم<br /><span style={{ color: "#b85c3d" }}>على بُعدِ رسالة.</span>
          </h2>
          <p style={{ fontSize: 18, color: "#5c4830", fontFamily: "'Markazi Text',serif", lineHeight: 1.85, marginBottom: 30 }}>أول استشارة مجانية. تواصل معنا لنناقش رؤيتك.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 30px", borderRadius: 999, background: "#3a2a1c", color: "#f4e9d4", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>عبر واتساب</a>}
            {t.phone && <a href={`tel:${t.phone.replace(/\s/g, "")}`} style={{ padding: "14px 30px", borderRadius: 999, background: "transparent", border: "1.5px solid #3a2a1c", color: "#3a2a1c", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>{t.phone}</a>}
          </div>
          {t.address_ar && <div style={{ marginTop: 36, fontSize: 14, color: "#7a6240", fontFamily: "'Markazi Text',serif" }}>{t.address_ar}</div>}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#3a2a1c", color: "#f4e9d4", padding: "40px 36px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontSize: 13, fontFamily: "'Markazi Text',serif" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Amiri',serif", fontSize: 22, fontWeight: 700, color: "#f4e9d4" }}>{t.name_ar}</span>
            <span style={{ opacity: .5 }}>·</span>
            <span style={{ opacity: .7 }}>مدعوم بواسطة وجود</span>
          </div>
          <span style={{ opacity: .7 }}>© {new Date().getFullYear()} — جميع الحقوق محفوظة</span>
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
          .hrt-nav { display: none !important; }
          .hrt-hero, .hrt-stats { grid-template-columns: 1fr !important; }
          .hrt-srv, .hrt-proj { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 620px) {
          .hrt-srv, .hrt-proj { grid-template-columns: 1fr !important; }
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
