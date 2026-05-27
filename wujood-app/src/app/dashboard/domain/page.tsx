import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { ROOT_DOMAIN } from "@/lib/constants";

export const metadata = { title: "الدومين" };

export default async function DomainPage() {
  const { tenant } = await getTenantOrRedirect();
  const isPremium = tenant.plan === "premium";

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>الدومين</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted)" }}>روابط موقعك العام</p>

      {/* Subdomain */}
      <div style={card}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Subdomain المجاني</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg-alt)", borderRadius: "var(--r-md)" }}>
          <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 14 }}>{tenant.slug}.{ROOT_DOMAIN}</div>
          <span style={{ fontSize: 11, background: "var(--primary-soft)", color: "var(--primary)", padding: "2px 8px", borderRadius: "var(--r-pill)", fontWeight: 600 }}>نشط</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>هذا الرابط دائم ولا يمكن تغييره. يعمل فوراً بدون أي إعداد.</p>
      </div>

      {/* Custom domain */}
      <div style={{ ...card, marginTop: 16, opacity: isPremium ? 1 : 0.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>دومين مخصص</h3>
          {!isPremium && (
            <span style={{ fontSize: 11, background: "var(--accent-soft)", color: "var(--accent)", padding: "2px 8px", borderRadius: "var(--r-pill)", fontWeight: 600 }}>Premium فقط</span>
          )}
        </div>

        {isPremium ? (
          tenant.custom_domain ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg-alt)", borderRadius: "var(--r-md)" }}>
                <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 14 }}>{tenant.custom_domain}</div>
                <span style={{ fontSize: 11, background: "var(--primary-soft)", color: "var(--primary)", padding: "2px 8px", borderRadius: "var(--r-pill)", fontWeight: 600 }}>متحقق</span>
              </div>
              <div style={{ marginTop: 14, padding: 14, background: "var(--bg-alt)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--muted)" }}>
                <strong style={{ color: "var(--ink)" }}>إعداد DNS:</strong> أضف سجل CNAME يشير إلى{" "}
                <code style={{ background: "var(--border-soft)", padding: "1px 6px", borderRadius: 4, fontFamily: "var(--font-mono)" }}>cname.wujood.sa</code>
              </div>
            </div>
          ) : (
            <div style={{ padding: 16, background: "var(--bg-alt)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--muted)", textAlign: "center" }}>
              تواصل مع الأدمن عبر واتساب لإعداد الدومين المخصص
            </div>
          )
        ) : (
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            يمكنك ربط دومين خاص مثل <span style={{ fontFamily: "var(--font-mono)" }}>maktabi.com</span> بموقعك في باقة Premium.
          </div>
        )}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20 };
