"use client";

import { useState } from "react";
import { CoverImage } from "./CoverImage";
import type { TemplateProps } from "./types";

export default function ClassicTemplate({ tenant: t, projects, services, stats, testimonials, faqs }: TemplateProps) {
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);

  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const wa = (t.whatsapp ?? "").replace(/\D/g, "");
  const initial = t.name_ar?.[0] ?? "م";

  return (
    <div style={{ background: "#f6efe3", color: "#3a2618", fontFamily: "'Markazi Text','Amiri',serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Markazi+Text:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <header style={{ padding: "24px 40px", borderBottom: "1px solid #d8c89e", background: "#f6efe3" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {t.logo_url
              ? <img src={t.logo_url} alt="" style={{ height: 38, objectFit: "contain" }} />
              : <span style={{ width: 38, height: 38, border: "2px solid #a37c2c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#a37c2c" }}>{initial}</span>}
            <div>
              <div style={{ fontFamily: "'Markazi Text',serif", fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{t.name_ar}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, color: "#a37c2c", letterSpacing: ".15em", textTransform: "uppercase", marginTop: 2 }}>EST. MMXI</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 32, fontSize: 16, fontFamily: "'Markazi Text',serif" }} className="cls-nav">
            {["الرئيسية", "من نحن", "مشاريعنا", "خدماتنا", "تواصل"].map((x) => (
              <a key={x} href="#" style={{ color: "#3a2618", fontWeight: 500, paddingBottom: 4 }}>{x}</a>
            ))}
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: "10px 22px", border: "1.5px solid #3a2618", color: "#3a2618", fontFamily: "'Markazi Text',serif", fontSize: 14, fontWeight: 500 }}>
              تواصل معنا
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "80px 40px 100px", background: "#f6efe3" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "7fr 5fr", gap: 70, alignItems: "center" }} className="cls-hero">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <span style={{ width: 60, height: 1, background: "#a37c2c" }}></span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: ".25em", textTransform: "uppercase", color: "#a37c2c" }}>مكتب استشارات هندسية</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: "'Markazi Text',serif", fontSize: "clamp(48px,6.5vw,88px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              {t.name_ar}
              <br />
              <em style={{ fontStyle: "italic", color: "#a37c2c", fontFamily: "'Cormorant Garamond',serif", fontWeight: 500 }}>يحترم المكان.</em>
            </h1>
            {t.about_ar && (
              <p style={{ marginTop: 26, fontSize: 19, lineHeight: 1.85, color: "#5a4128", maxWidth: 540, fontWeight: 400 }}>
                {t.about_ar.slice(0, 200)}
              </p>
            )}
            <div style={{ marginTop: 36, display: "flex", gap: 16, alignItems: "center" }}>
              <a href="#projects" style={{ padding: "14px 32px", background: "#3a2618", color: "#f6efe3", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>استعرض الأعمال</a>
              {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontFamily: "'Markazi Text',serif", color: "#3a2618", borderBottom: "1px solid #a37c2c", paddingBottom: 4, fontWeight: 500 }}>تواصل مباشر</a>}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -14, border: "1px solid #a37c2c", zIndex: 0 }}></div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <CoverImage src={t.cover_url} seed={t.id} height={460} radius={0} />
            </div>
            {stats.length > 0 && (
              <div style={{ position: "absolute", bottom: -28, insetInlineEnd: -28, background: "#3a2618", color: "#f6efe3", padding: "18px 24px", textAlign: "center", zIndex: 2 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 600, lineHeight: 1, color: "#d4a85a" }}>{stats[0].value}{stats[0].suffix}</div>
                <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", marginTop: 4 }}>{stats[0].label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats.length > 0 && (
        <section style={{ background: "#3a2618", color: "#f6efe3", padding: "50px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: 40 }} className="cls-stats">
            {stats.slice(0, 4).map((s, i) => (
              <div key={s.id} style={{ textAlign: "center", borderInlineStart: i > 0 ? "1px solid rgba(212,168,90,.3)" : "none", paddingInlineStart: i > 0 ? 30 : 0 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, color: "#d4a85a", fontWeight: 600, lineHeight: 1 }}>{s.prefix}{s.value}{s.suffix}</div>
                <div style={{ marginTop: 8, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(246,239,227,.7)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {t.about_ar && (
        <section style={{ padding: "110px 40px", background: "#f6efe3" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: ".25em", textTransform: "uppercase", color: "#a37c2c" }}>— من نحن —</span>
            <h2 style={{ margin: "20px 0 24px", fontFamily: "'Markazi Text',serif", fontSize: "clamp(34px,4vw,54px)", fontWeight: 600, lineHeight: 1.15 }}>من فلسفتنا إلى مشروعك.</h2>
            <div style={{ width: 80, height: 1, background: "#a37c2c", margin: "0 auto 28px" }}></div>
            <p style={{ fontSize: 19, lineHeight: 1.95, color: "#5a4128", fontWeight: 400 }}>{t.about_ar}</p>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section style={{ padding: "90px 40px", background: "#efe5d2", borderTop: "1px solid #d8c89e", borderBottom: "1px solid #d8c89e" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: ".25em", textTransform: "uppercase", color: "#a37c2c" }}>— الخدمات —</span>
              <h2 style={{ margin: "14px 0 0", fontFamily: "'Markazi Text',serif", fontSize: "clamp(34px,4vw,54px)", fontWeight: 600 }}>ما نقدمه.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(services.length, 4)},1fr)`, gap: 0 }} className="cls-srv">
              {services.map((s, i) => (
                <div key={s.id} style={{ padding: "38px 28px", background: "#f6efe3", borderInlineStart: i > 0 ? "1px solid #d8c89e" : "none", position: "relative" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, color: "#d4a85a", fontWeight: 500, lineHeight: 1, marginBottom: 18, opacity: .35 }}>
                    {["I", "II", "III", "IV"][i] ?? i + 1}
                  </div>
                  <h3 style={{ margin: "0 0 12px", fontFamily: "'Markazi Text',serif", fontSize: 22, fontWeight: 600 }}>{s.title}</h3>
                  <div style={{ width: 28, height: 1, background: "#a37c2c", marginBottom: 14 }}></div>
                  {s.description && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "#5a4128" }}>{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "110px 40px", background: "#f6efe3" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: ".25em", textTransform: "uppercase", color: "#a37c2c" }}>— المشاريع —</span>
                <h2 style={{ margin: "14px 0 0", fontFamily: "'Markazi Text',serif", fontSize: "clamp(34px,4vw,54px)", fontWeight: 600 }}>مختارات من أعمالنا.</h2>
              </div>
              {cats.length > 1 && (
                <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #d8c89e" }}>
                  {cats.map((c) => (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ padding: "10px 18px", fontSize: 15, fontFamily: "'Markazi Text',serif", color: filter === c ? "#3a2618" : "#8c6e44", borderBottom: filter === c ? "2px solid #a37c2c" : "2px solid transparent", marginBottom: -1, fontWeight: 500, cursor: "pointer", background: "none", border: "none", borderBottom: filter === c ? "2px solid #a37c2c" : "2px solid transparent" }}>
                      {c === "all" ? "الكل" : c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="cls-proj">
              {filtered.map((p) => (
                <a key={p.id} href={`/projects/${p.id}`} style={{ textAlign: "right", background: "transparent", cursor: "pointer", textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ padding: 6, background: "#fff", border: "1px solid #d8c89e" }}>
                    <CoverImage src={p.cover_url} seed={p.id} height={280} radius={0} />
                  </div>
                  <div style={{ paddingTop: 18 }}>
                    {(p.category || p.year) && (
                      <div style={{ fontSize: 12, color: "#a37c2c", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Cormorant Garamond',serif" }}>
                        {p.category}{p.category && p.year ? " — " : ""}{p.year}
                      </div>
                    )}
                    <h3 style={{ margin: "0 0 4px", fontFamily: "'Markazi Text',serif", fontSize: 22, fontWeight: 600 }}>{p.title_ar}</h3>
                    {p.location && <div style={{ fontSize: 14, color: "#7a5d3b" }}>{p.location}</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section style={{ padding: "100px 40px", background: "#3a2618", color: "#f6efe3", textAlign: "center" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 80, color: "#d4a85a", lineHeight: .5, marginBottom: 24 }}>"</div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(22px,2.5vw,32px)", lineHeight: 1.6, fontWeight: 400 }}>
              {testimonials[0].text}
            </p>
            <div style={{ width: 60, height: 1, background: "#d4a85a", margin: "32px auto" }}></div>
            <div style={{ fontFamily: "'Markazi Text',serif", fontSize: 18, fontWeight: 600 }}>— {testimonials[0].client_name}</div>
            {testimonials[0].client_role && <div style={{ fontSize: 13, color: "rgba(246,239,227,.6)", marginTop: 4, letterSpacing: ".08em" }}>{testimonials[0].client_role}</div>}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: "80px 40px", background: "#f6efe3" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: ".25em", textTransform: "uppercase", color: "#a37c2c" }}>— أسئلة —</span>
              <h2 style={{ margin: "14px 0 0", fontFamily: "'Markazi Text',serif", fontSize: "clamp(34px,4vw,54px)", fontWeight: 600 }}>الأسئلة الشائعة.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faqs.map((q) => (
                <div key={q.id} style={{ border: "1px solid #d8c89e", background: "#fff" }}>
                  <button onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
                    style={{ width: "100%", textAlign: "right", padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Markazi Text',serif", fontSize: 18, fontWeight: 500, cursor: "pointer", background: "none", border: "none" }}>
                    <span style={{ flex: 1 }}>{q.question}</span>
                    <span style={{ transform: openFaq === q.id ? "rotate(180deg)" : "none", transition: "transform .2s", color: "#a37c2c" }}>▾</span>
                  </button>
                  {openFaq === q.id && (
                    <div style={{ padding: "0 22px 18px", color: "#5a4128", fontSize: 15, lineHeight: 1.75, fontFamily: "'Markazi Text',serif" }}>{q.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" style={{ padding: "110px 40px", background: "#f6efe3", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: ".25em", textTransform: "uppercase", color: "#a37c2c" }}>— تواصل —</span>
          <h2 style={{ margin: "16px 0 22px", fontFamily: "'Markazi Text',serif", fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 600, lineHeight: 1.1 }}>هل ترغب بالتشاور؟</h2>
          <p style={{ fontSize: 18, color: "#5a4128", lineHeight: 1.85, marginBottom: 36 }}>أول استشارة مجانية. تواصل معنا لمناقشة مشروعك.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 30px", background: "#3a2618", color: "#f6efe3", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>عبر واتساب</a>}
            {t.phone && <a href={`tel:${t.phone.replace(/\s/g, "")}`} style={{ padding: "14px 30px", border: "1.5px solid #3a2618", color: "#3a2618", fontFamily: "'Markazi Text',serif", fontSize: 15, fontWeight: 500 }}>اتصال هاتفي</a>}
          </div>
          {t.address_ar && <div style={{ marginTop: 56, fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "#a37c2c", letterSpacing: ".18em", textTransform: "uppercase" }}>{t.address_ar}</div>}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #d8c89e", background: "#efe5d2", padding: "36px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 13, color: "#7a5d3b", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <span>© {new Date().getFullYear()} · {t.name_ar}</span>
          <span style={{ display: "inline-flex", gap: 14, alignItems: "center" }}>
            {t.phone && <span>{t.phone}</span>}
            {t.phone && t.email && <span>·</span>}
            {t.email && <span>{t.email}</span>}
          </span>
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
          .cls-nav { display: none !important; }
          .cls-hero, .cls-stats { grid-template-columns: 1fr !important; }
          .cls-srv, .cls-proj { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 620px) {
          .cls-proj { grid-template-columns: 1fr !important; }
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
