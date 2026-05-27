"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WHATSAPP_SUPPORT } from "@/lib/constants";
import { toast } from "sonner";

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "بيانات الدخول غير صحيحة" : error.message);
      setLoading(false);
      return;
    }

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push(adminRow ? "/admin" : "/dashboard");
    }
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Form side */}
      <div style={{ display: "flex", flexDirection: "column", padding: "32px 40px", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "inline-flex" }}>
          <WujoodLogo />
        </Link>

        <div style={{ maxWidth: 380, margin: "0 auto", width: "100%" }}>
          <h1 style={{ margin: "0 0 8px", fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            أهلاً بعودتك.
          </h1>
          <p style={{ margin: "0 0 28px", color: "var(--muted)", fontSize: 15 }}>
            سجّل الدخول للوصول إلى داشبورد مكتبك.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}>البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                style={{
                  width: "100%", background: "var(--surface)", border: "1px solid var(--border-strong)",
                  borderRadius: "var(--r-md)", padding: "10px 14px", fontSize: 14, color: "var(--ink)",
                  textAlign: "left",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}>كلمة المرور</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border-strong)",
                    borderRadius: "var(--r-md)", padding: "10px 14px", fontSize: 14, color: "var(--ink)",
                    textAlign: "left", paddingInlineEnd: 40,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", insetInlineEnd: 8, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", padding: 6 }}
                >
                  <EyeIcon />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                height: 48, borderRadius: "var(--r-md)", fontSize: 15, fontWeight: 500,
                background: loading ? "var(--muted-soft)" : "var(--primary)", color: "#fff",
                cursor: loading ? "not-allowed" : "pointer", transition: "background .15s",
                marginTop: 4,
              }}
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div style={{ marginTop: 22, padding: 14, background: "var(--accent-soft)", borderRadius: 10, fontSize: 13, color: "#7d5a17", display: "flex", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <strong>لا يوجد تسجيل ذاتي —</strong> الحسابات تُنشأ يدوياً من الأدمن بعد التحويل البنكي.{" "}
              <a href={`https://wa.me/${WHATSAPP_SUPPORT.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                اطلب حسابك عبر واتساب
              </a>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", margin: 0 }}>
          باستخدامك للمنصة فأنت توافق على{" "}
          <a href="#" style={{ color: "var(--primary)" }}>الشروط</a> و
          <a href="#" style={{ color: "var(--primary)" }}>الخصوصية</a>.
        </p>
      </div>

      {/* Visual side */}
      <div style={{
        background: "var(--primary)", color: "#f4ecd8",
        padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, insetInlineEnd: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(176,138,62,.18)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff" }}>
            مكتبك يستحق
            <br />
            <span style={{ color: "var(--accent)" }}>وجوداً يليق به.</span>
          </h2>
          <p style={{ marginTop: 18, maxWidth: 380, color: "rgba(255,255,255,.7)", fontSize: 15, lineHeight: 1.7 }}>
            منصة سعودية متكاملة لإطلاق موقعك الاحترافي. بدون أكواد، بدون مصممين.
          </p>
          </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          form ~ div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
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

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
