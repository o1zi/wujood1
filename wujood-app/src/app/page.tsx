import Link from "next/link";
import { SECTORS, PLANS, TEMPLATES, WHATSAPP_SUPPORT } from "@/lib/constants";

export default function LandingPage() {
  const waLink = `https://wa.me/${WHATSAPP_SUPPORT.replace(/\D/g, "")}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,248,243,0.88)",
        backdropFilter: "saturate(180%) blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <WujoodLogo />
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[
              { label: "الميزات", href: "#features" },
              { label: "القوالب", href: "#templates" },
              { label: "الباقات", href: "#pricing" },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{
                padding: "8px 14px", fontSize: 14,
                color: "var(--ink-soft)", borderRadius: 8,
              }}>
                {item.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px",
              fontSize: 13, fontWeight: 500, borderRadius: "var(--r-md)",
              color: "var(--ink-soft)", border: "1px solid var(--border-strong)",
            }}>
              تسجيل الدخول
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px",
              fontSize: 13, fontWeight: 500, borderRadius: "var(--r-md)",
              background: "var(--primary)", color: "#fff",
            }}>
              اطلب حسابك
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "76px 28px 84px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 10px",
              background: "var(--accent-soft)", borderRadius: "var(--r-pill)",
              fontSize: 12, color: "var(--accent)", fontWeight: 500, marginBottom: 20,
            }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>v1.0</span>
              <span style={{ width: 1, height: 12, background: "currentColor", opacity: 0.25 }} />
              منصة سعودية للمكاتب المهنية
            </div>

            <h1 style={{
              margin: "0 0 18px",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 64px)",
              fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em",
            }}>
              وجودك الرقمي
              <br />
              <span style={{ color: "var(--primary)" }}>يبدأ من هنا.</span>
            </h1>

            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 520, margin: "0 0 28px" }}>
              منصة متكاملة لإطلاق موقع احترافي لمكتبك خلال يوم واحد. اختر قالباً، أدخل بياناتك، وانطلق — بدون أكواد، بدون مصممين.
            </p>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 24px",
                background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)",
                fontSize: 15, fontWeight: 500,
              }}>
                اطلب حسابك عبر واتساب
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            <div style={{ marginTop: 36, display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { v: "6", l: "قوالب احترافية" },
                { v: "RTL", l: "دعم عربي كامل" },
                { v: "يوم", l: "تفعيل سريع" },
                { v: "99.9%", l: "استقرار عالي" },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--primary)", fontWeight: 600 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "var(--surface)", borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)", boxShadow: "var(--sh-xl)",
            overflow: "hidden",
          }}>
            <div style={{ background: "var(--primary)", padding: "24px 28px 20px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#fff", fontWeight: 600 }}>موقعك الاحترافي</div>
              <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13, marginTop: 4 }}>بأقل من 24 ساعة</div>
            </div>
            <div style={{ padding: "20px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { v: "جاهز", l: "خلال يوم" },
                  { v: "RTL", l: "دعم كامل" },
                  { v: "SEO", l: "مُحسَّن" },
                  { v: "آمن", l: "تشفير كامل" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "var(--bg-alt)", borderRadius: "var(--r-md)", padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--primary)", fontWeight: 600 }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors strip */}
      <section style={{ padding: "24px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", justifyContent: "space-between" }}>
          <span style={{ color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-mono)" }}>قطاعات نخدمها</span>
          {Object.values(SECTORS).slice(0, 7).map((s) => (
            <span key={s.label} style={{ fontSize: 14, color: "var(--ink-soft)" }}>{s.label}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "100px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase" }}>المنصة</span>
            <h2 style={{ margin: "12px 0 14px", fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>
              كل ما يحتاجه مكتبك. <span style={{ color: "var(--muted)" }}>ولا شيء غير ذلك.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {[
              { icon: "🎨", t: "قوالب احترافية", d: `${TEMPLATES.length} قوالب جاهزة + تخصيص كامل. كل قالب يحترم هوية القطاع ويدعم التحكم بالألوان والخطوط.` },
              { icon: "🌐", t: "دومين خاص", d: "subdomain.wujood.sa مجاناً، أو دومين مستقل في باقة Premium." },
              { icon: "📁", t: "إدارة محتوى ذكية", d: "ارفع المشاريع والصور، رتّب بالسحب والإفلات، وانشر بضغطة. لا أكواد ولا تعقيد." },
              { icon: "🔒", t: "أمان متعدد المستويات", d: "كل بيانات مكتبك معزولة تماماً عن باقي المكاتب. لا أحد يصلها غيرك." },
              { icon: "⚡", t: "سرعة عالية", d: "صفحات تُحمَّل في أقل من ثانية، مُحسَّنة لمحركات البحث وقابلة للمشاركة." },
              { icon: "📊", t: "تحليلات نظيفة", d: "تعرف من زار، من أين، وكم بقي. بدون cookies شخصية، مع احترام كامل للخصوصية." },
            ].map((f) => (
              <div key={f.t} style={{
                background: "var(--surface)", borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)", padding: "24px",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{f.t}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" style={{ padding: "80px 28px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase" }}>القوالب</span>
            <h2 style={{ margin: "12px 0 6px", fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>{TEMPLATES.length} قوالب أساسية، آلاف الاحتمالات</h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>كل قالب قابل للتخصيص الكامل — ألوان، خطوط، تخطيطات.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${TEMPLATES.length}, 1fr)`, gap: 14 }}>
            {TEMPLATES.map((t) => (
              <div key={t.id} style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ height: 90, display: "flex" }}>
                  <div style={{ flex: 1, background: "var(--primary)" }} />
                  <div style={{ flex: 1, background: "var(--accent)" }} />
                  <div style={{ flex: 1, background: "var(--surface)" }} />
                </div>
                <div style={{ padding: "10px 12px", background: "var(--bg)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{t.nameAr}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{t.nameEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "100px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase" }}>الباقات</span>
            <h2 style={{ margin: "12px 0 14px", fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>تسعير واضح. بدون مفاجآت.</h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>تجديد سنوي، دفع عبر التحويل البنكي. لا اشتراكات تلقائية.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {Object.entries(PLANS).map(([key, plan]) => {
              const isPro = key === "pro";
              return (
                <div key={key} style={{
                  background: isPro ? "var(--primary)" : "var(--surface)",
                  borderRadius: "var(--r-lg)",
                  border: isPro ? "none" : "1px solid var(--border)",
                  padding: "28px 24px",
                  position: "relative",
                }}>
                  {isPro && (
                    <div style={{
                      position: "absolute", top: -10, insetInlineStart: "50%", transform: "translateX(50%)",
                      background: "var(--accent)", color: "#fff",
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: "var(--r-pill)",
                    }}>الأكثر طلباً</div>
                  )}
                  <div style={{ fontSize: 12, color: isPro ? "rgba(255,255,255,.6)" : "var(--muted)", marginBottom: 6 }}>{plan.labelAr}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, color: isPro ? "#fff" : "var(--ink)", marginBottom: 4 }}>
                    {plan.priceYearly.toLocaleString("en-US")}
                    <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}> ر.س / سنة</span>
                  </div>
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      `${plan.projects === Infinity ? "غير محدود" : plan.projects} مشروع`,
                      `${plan.storage_mb >= 1000 ? plan.storage_mb / 1000 + " جيجا" : plan.storage_mb + " ميجا"} تخزين`,
                      plan.customDomain ? "دومين مخصص مجاني" : "subdomain مجاني",
                    ].map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: isPro ? "rgba(255,255,255,.8)" : "var(--ink-soft)" }}>
                        <span style={{ color: isPro ? "var(--accent)" : "var(--success)" }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 24, height: 40, borderRadius: "var(--r-md)", fontSize: 14, fontWeight: 500,
                    background: isPro ? "var(--accent)" : "var(--primary)",
                    color: "#fff",
                  }}>
                    اطلب الآن
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto",
          background: "var(--primary)", color: "#f4ecd8",
          borderRadius: "var(--r-xl)", padding: "64px 56px",
          display: "grid", gridTemplateColumns: "1.4fr .6fr", gap: 40, alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15 }}>
              جاهز لإطلاق وجودك الرقمي؟
            </h2>
            <p style={{ margin: "14px 0 0", color: "rgba(255,255,255,.75)", fontSize: 16, maxWidth: 540 }}>
              راسلنا على واتساب وأرسل تفاصيل مكتبك. نُفعّل الحساب خلال 24 ساعة بعد التحويل.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 24px",
              background: "var(--accent)", color: "#fff", borderRadius: "var(--r-md)",
              fontSize: 15, fontWeight: 500,
            }}>
              اطلب حسابك الآن
            </a>
            <Link href="/login" style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>
              عندي حساب — دخول
            </Link>
          </div>
          <div style={{ position: "absolute", insetInlineStart: -120, top: -60, width: 360, height: 360, borderRadius: "50%", background: "rgba(176,138,62,.18)", filter: "blur(40px)", pointerEvents: "none" }} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 28px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <WujoodLogo />
            <span style={{ color: "var(--muted)", fontSize: 13 }}>© 2026 — جميع الحقوق محفوظة</span>
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13 }}>
            {["الشروط", "الخصوصية", "اتصل بنا"].map((x) => (
              <a key={x} href="#" style={{ color: "var(--muted)" }}>{x}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function WujoodLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 28, height: 28, background: "var(--primary)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="rgba(255,255,255,.9)" />
          <path d="M12 7L16 9.5V14.5L12 17L8 14.5V9.5L12 7Z" fill="var(--primary)" />
        </svg>
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>وجود</span>
    </div>
  );
}
