"use client";

import { useState } from "react";
import { CoverImage } from "./CoverImage";
import type { TemplateProps } from "./types";

export default function StudioTemplate({ tenant: t, projects, services, stats, testimonials, faqs }: TemplateProps) {
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);

  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const wa = (t.whatsapp ?? "").replace(/\D/g, "");
  const initial = t.name_ar?.[0] ?? "م";

  return (
    <div style={{ background: "#fafaf6", color: "#1a1a1c", fontFamily: "'IBM Plex Sans Arabic',sans-serif", minHeight: "100vh", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,246,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(26,26,28,.08)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {t.logo_url
              ? <img src={t.logo_url} alt="" style={{ height: 36, objectFit: "contain" }} />
              : <>
                  <span style={{ width: 36, height: 36, background: "#1a1a1c", color: "#fafaf6", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Reem Kufi',sans-serif", fontWeight: 700, fontSize: 16 }}>{initial}</span>
                  <div>
                    <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 17, fontWeight: 600, lineHeight: 1 }}>{t.name_ar}</div>
                    <div style={{ fontSize: 10, color: "#7a8c6f", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, marginTop: 3 }}>Architecture Studio</div>
                  </div>
                </>}
          </a>
          <nav style={{ display: "flex", gap: 28, fontSize: 14, fontWeight: 500 }} className="std-nav">
            {[["أعمال", "01"], ["خدمات", "02"], ["عن المكتب", "03"], ["تواصل", "04"]].map(([ar, num]) => (
              <a key={num} href="#" style={{ display: "inline-flex", alignItems: "baseline", gap: 6, color: "#1a1a1c" }}>
                <span style={{ fontSize: 10, color: "#7a8c6f", fontFamily: "'Reem Kufi',sans-serif" }}>{num}</span>
                {ar}
              </a>
            ))}
          </nav>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: "10px 22px", background: "#1a1a1c", color: "#fafaf6", fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7a8c6f" }}></span>
              متاحون
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "40px 40px 80px", minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 50, flex: 1, alignItems: "stretch" }} className="std-hero">
          <div style={{ position: "relative", minHeight: 540 }}>
            <CoverImage src={t.cover_url ?? (projects[0]?.cover_url ?? null)} seed={t.id} height="100%" radius={2} />
            {projects[0] && (
              <div style={{ position: "absolute", bottom: 24, insetInlineStart: 24, background: "rgba(26,26,28,.85)", backdropFilter: "blur(8px)", padding: "14px 18px", color: "#fafaf6", maxWidth: 280 }}>
                <div style={{ fontSize: 10, color: "#bccdaf", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Featured · {projects[0].year}</div>
                <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 16, fontWeight: 600 }}>{projects[0].title_ar}</div>
                {projects[0].location && <div style={{ fontSize: 12, color: "rgba(250,250,246,.6)", marginTop: 4 }}>{projects[0].location}</div>}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 30 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 30 }}>
                <span style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#7a8c6f", fontWeight: 600 }}>Studio</span>
                <span style={{ flex: 1, height: 1, background: "#d6d8d2" }}></span>
              </div>
              <h1 style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(48px,7vw,108px)", fontWeight: 600, lineHeight: .95, letterSpacing: "-0.035em", color: "#1a1a1c" }}>
                {t.name_ar}
                <br />
                <span style={{ color: "#7a8c6f" }}>يبدع.</span>
              </h1>
              {t.about_ar && (
                <p style={{ marginTop: 26, fontSize: 16, lineHeight: 1.75, color: "#4a4a4c", maxWidth: 440 }}>
                  {t.about_ar.slice(0, 180)}
                </p>
              )}
            </div>
            <div style={{ marginTop: 30, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#projects"
                style={{ padding: "14px 28px", background: "#1a1a1c", color: "#fafaf6", fontSize: 13.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 }}>
                {projects.length} مشروع · استعرض الكل ←
              </a>
              <a href="#contact" style={{ fontSize: 13.5, color: "#1a1a1c", borderBottom: "1px solid #1a1a1c", paddingBottom: 4, fontWeight: 500 }}>محادثة سريعة ←</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section style={{ padding: "40px 40px", borderTop: "1px solid rgba(26,26,28,.08)", borderBottom: "1px solid rgba(26,26,28,.08)" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: 30 }} className="std-stats">
            {stats.slice(0, 4).map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: 14, borderInlineStart: i > 0 ? "1px solid rgba(26,26,28,.08)" : "none", paddingInlineStart: i > 0 ? 20 : 0 }}>
                <span style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 56, fontWeight: 600, color: "#1a1a1c", lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {s.prefix}{s.value}<span style={{ color: "#7a8c6f", fontSize: 28 }}>{s.suffix}</span>
                </span>
                <span style={{ fontSize: 12, color: "#6a6a6c", letterSpacing: ".02em", flex: 1, lineHeight: 1.4 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section style={{ padding: "120px 40px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, marginBottom: 50 }} className="std-srv-head">
              <div>
                <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#7a8c6f", fontWeight: 600, marginBottom: 16 }}>02 · ما نقدمه</div>
                <h2 style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.05 }}>خدماتنا.</h2>
              </div>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8, color: "#4a4a4c", alignSelf: "end" }}>
                من الفكرة الأولى إلى آخر تفصيلة في الموقع. نُدير المشروع نقطة بنقطة.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {services.map((s, i) => (
                <div key={s.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr", gap: 30, padding: "32px 0", borderTop: "1px solid rgba(26,26,28,.12)", alignItems: "center" }} className="std-srv-row">
                  <span style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 22, fontWeight: 500, color: "#7a8c6f" }}>0{i + 1}</span>
                  <h3 style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "-0.015em" }}>{s.title}</h3>
                  {s.description && <p style={{ margin: 0, fontSize: 15, color: "#4a4a4c", lineHeight: 1.7 }}>{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "40px 0 120px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 50, flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#7a8c6f", fontWeight: 600, marginBottom: 14 }}>03 · أعمال مختارة</div>
                <h2 style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 600, letterSpacing: "-0.025em" }}>المشاريع.</h2>
              </div>
              {cats.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {cats.slice(0, 5).map((c) => (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ padding: "7px 14px", fontSize: 13, fontWeight: 500, background: filter === c ? "#1a1a1c" : "transparent", color: filter === c ? "#fafaf6" : "#1a1a1c", border: `1px solid ${filter === c ? "#1a1a1c" : "rgba(26,26,28,.15)"}`, cursor: "pointer" }}>
                      {c === "all" ? "الكل" : c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {filtered.slice(0, 4).map((p, i) => {
              const reversed = i % 2 === 1;
              return (
                <a key={p.id} href={`/projects/${p.id}`} style={{
                  display: "grid",
                  gridTemplateColumns: reversed ? "1fr 1.6fr" : "1.6fr 1fr",
                  gap: 40, alignItems: "center",
                  maxWidth: 1280, margin: "0 auto", width: "100%",
                  paddingInline: 40,
                  textDecoration: "none", color: "inherit",
                }} className="std-proj-row">
                  <div style={{ order: reversed ? 2 : 1 }}>
                    <CoverImage src={p.cover_url} seed={p.id} height={520} radius={2} />
                  </div>
                  <div style={{ order: reversed ? 1 : 2, padding: reversed ? "0 20px 0 0" : "0 0 0 20px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
                      <span style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 13, color: "#7a8c6f", fontWeight: 600 }}>{String(i + 1).padStart(2, "0")} —</span>
                      {(p.category || p.year) && (
                        <span style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#7a8c6f", fontWeight: 600 }}>
                          {p.category}{p.category && p.year ? " · " : ""}{p.year}
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: "0 0 14px", fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                      {p.title_ar}
                    </h3>
                    {p.location && (
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "#4a4a4c", maxWidth: 420 }}>
                        {p.location}. {p.description_ar?.slice(0, 80) ?? "مشروع يجمع بين الجمال الوظيفي والاستدامة."}
                      </p>
                    )}
                    <span style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#1a1a1c", borderBottom: "1px solid #1a1a1c", paddingBottom: 4 }}>
                      اقرأ المزيد →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonials.length > 0 && (
        <section style={{ padding: "120px 40px", background: "#1a1a1c", color: "#fafaf6" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 50, alignItems: "center" }} className="std-testi">
            <div>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#bccdaf", fontWeight: 600, marginBottom: 14 }}>04 · شهادة</div>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 80, fontWeight: 600, color: "#7a8c6f", lineHeight: .9 }}>"</div>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(22px,3vw,36px)", lineHeight: 1.4, fontWeight: 400, letterSpacing: "-0.015em" }}>
                {testimonials[0].text}
              </p>
              <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ width: 30, height: 1, background: "#7a8c6f" }}></span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{testimonials[0].client_name}</div>
                  {testimonials[0].client_role && <div style={{ fontSize: 13, color: "rgba(250,250,246,.55)", marginTop: 2 }}>{testimonials[0].client_role}</div>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: "80px 40px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#7a8c6f", fontWeight: 600, marginBottom: 14 }}>05 · أسئلة</div>
              <h2 style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 600, letterSpacing: "-0.025em" }}>أسئلة شائعة.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {faqs.map((q) => (
                <div key={q.id} style={{ borderTop: "1px solid rgba(26,26,28,.12)" }}>
                  <button onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
                    style={{ width: "100%", textAlign: "right", padding: "22px 0", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Reem Kufi',sans-serif", fontSize: 18, fontWeight: 500, cursor: "pointer", background: "none", border: "none", color: "#1a1a1c" }}>
                    <span style={{ flex: 1 }}>{q.question}</span>
                    <span style={{ transform: openFaq === q.id ? "rotate(180deg)" : "none", transition: "transform .2s", color: "#7a8c6f" }}>▾</span>
                  </button>
                  {openFaq === q.id && <div style={{ paddingBottom: 22, fontSize: 15, color: "#4a4a4c", lineHeight: 1.8 }}>{q.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60 }} className="std-cta">
            <div>
              <div style={{ fontFamily: "'Reem Kufi',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#7a8c6f", fontWeight: 600, marginBottom: 14 }}>06 · تواصل</div>
              <h2 style={{ margin: 0, fontFamily: "'Reem Kufi',sans-serif", fontSize: "clamp(44px,7vw,96px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: .95 }}>
                لنبدأ<br /><span style={{ color: "#7a8c6f" }}>المحادثة.</span>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 0 }}>
              {wa && <ContactRow label="واتساب" value={t.whatsapp!} href={`https://wa.me/${wa}`} />}
              {t.phone && <ContactRow label="هاتف" value={t.phone} href={`tel:${t.phone.replace(/\s/g, "")}`} />}
              {t.email && <ContactRow label="بريد" value={t.email} href={`mailto:${t.email}`} />}
              {t.address_ar && <ContactRow label="موقع" value={t.address_ar} href={t.maps_url ?? "#"} />}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px", borderTop: "1px solid rgba(26,26,28,.08)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#6a6a6c" }}>
          <span>© {new Date().getFullYear()} {t.name_ar} — استوديو هندسة معمارية</span>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7a8c6f" }}></span>
            مدعوم بواسطة وجود
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
          .std-nav { display: none !important; }
          .std-hero, .std-stats, .std-srv-head, .std-proj-row, .std-testi, .std-cta { grid-template-columns: 1fr !important; }
          .std-srv-row { grid-template-columns: 40px 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "grid", gridTemplateColumns: "80px 1fr 20px", gap: 14, padding: "14px 0", borderTop: "1px solid rgba(26,26,28,.12)", alignItems: "center", textDecoration: "none", color: "#1a1a1c" }}>
      <span style={{ fontSize: 11, color: "#7a8c6f", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 500 }}>{value}</span>
      <span>←</span>
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
