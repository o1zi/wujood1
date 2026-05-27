"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Tenant } from "@/lib/types";
import { PLANS } from "@/lib/constants";
import { daysUntil } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",              label: "الرئيسية",            icon: HomeIcon },
  { href: "/dashboard/info",         label: "المعلومات الأساسية",  icon: BuildingIcon },
  { href: "/dashboard/projects",     label: "المشاريع والأعمال",   icon: BriefcaseIcon },
  { href: "/dashboard/services",     label: "الخدمات والمميزات",   icon: LayersIcon },
  { href: "/dashboard/stats",        label: "الإحصاءات",           icon: BarIcon },
  { href: "/dashboard/testimonials", label: "شهادات العملاء",      icon: StarIcon },
  { href: "/dashboard/faqs",         label: "الأسئلة الشائعة",     icon: FaqIcon },
  { href: "/dashboard/theme",        label: "القالب",               icon: PaletteIcon },
  { href: "/dashboard/domain",       label: "الدومين",              icon: GlobeIcon },
  { href: "/dashboard/subscription", label: "الاشتراك",            icon: CardIcon },
  { href: "/dashboard/analytics",    label: "التحليلات",            icon: TrendIcon },
];

export default function DashboardShell({ tenant, children }: { tenant: Tenant; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = NAV.find((n) => pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href)));

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const days = tenant.ends_at ? daysUntil(tenant.ends_at) : 0;
  const planLabel = PLANS[tenant.plan].labelAr;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        borderInlineStart: "1px solid var(--border)",
        background: "var(--surface)",
        padding: 16,
        display: "flex", flexDirection: "column", gap: 14,
        position: "sticky", top: 0, height: "100vh",
        overflowY: "auto",
        zIndex: 100,
      }}
        className={mobileOpen ? "sidebar-open" : "sidebar"}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit" }}>
            <WujoodMark />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="sidebar-close-btn" style={{ display: "none", width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
            <CloseIcon />
          </button>
        </div>

        {/* Tenant card */}
        <div style={{ padding: 12, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tenant.logo_url ? (
              <img src={tenant.logo_url} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--primary)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600,
              }}>
                {tenant.name_ar[0]}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {tenant.name_ar}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {tenant.slug}.wujood.sa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", height: 20, padding: "0 8px",
              background: "var(--accent-soft)", color: "var(--accent)",
              borderRadius: "var(--r-pill)", fontSize: 11, fontWeight: 600,
            }}>
              {planLabel}
            </span>
            <a
              href={`//${tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "wujood.sa"}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3 }}
            >
              زيارة الموقع <ExternalIcon />
            </a>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto", margin: "0 -4px", padding: "0 4px" }}>
          {NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: "var(--r-md)",
                  fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--primary)" : "var(--ink-soft)",
                  background: isActive ? "var(--primary-soft)" : "transparent",
                  transition: "all .1s",
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: "var(--r-md)",
              fontSize: 13.5, color: "var(--danger)", width: "100%",
            }}
          >
            <LogoutIcon size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 60, background: "var(--surface)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 14, padding: "0 26px",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-menu-btn"
            style={{ display: "none", width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}
          >
            <MenuIcon />
          </button>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, color: "var(--ink)" }}>
            {currentPage?.label ?? "الداشبورد"}
          </h2>
          <div style={{ flex: 1 }} />
          {days > 0 && days <= 30 && (
            <span style={{
              fontSize: 12, color: "var(--warn)", background: "var(--warn-soft)",
              padding: "3px 10px", borderRadius: "var(--r-pill)", fontWeight: 500,
            }}>
              {days} يوم متبقي
            </span>
          )}
        </header>

        <div style={{ padding: "26px 28px 60px", maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 980px) {
          .sidebar {
            position: fixed !important;
            insetInlineStart: 0; top: 0; bottom: 0;
            transform: translateX(100%);
            transition: transform .2s ease;
          }
          .sidebar-open {
            position: fixed !important;
            insetInlineStart: 0; top: 0; bottom: 0;
            transform: translateX(0) !important;
          }
          .mobile-menu-btn { display: inline-flex !important; }
          .sidebar-close-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}

// ── Icon components ────────────────────────────────────────────────────────

function WujoodMark() {
  return (
    <div style={{ width: 28, height: 28, background: "var(--primary)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="rgba(255,255,255,.9)" />
        <path d="M12 7L16 9.5V14.5L12 17L8 14.5V9.5L12 7Z" fill="var(--primary)" />
      </svg>
    </div>
  );
}

function I({ size = 16, d }: { size?: number; d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const HomeIcon = ({ size = 16 }) => <I size={size} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />;
const BuildingIcon = ({ size = 16 }) => <I size={size} d="M3 21h18M9 21V9m6 12V9M3 9l9-7 9 7M9 9h6" />;
const BriefcaseIcon = ({ size = 16 }) => <I size={size} d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />;
const LayersIcon = ({ size = 16 }) => <I size={size} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
const BarIcon = ({ size = 16 }) => <I size={size} d="M12 20V10M18 20V4M6 20v-6" />;
const StarIcon = ({ size = 16 }) => <I size={size} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const FaqIcon = ({ size = 16 }) => <I size={size} d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01M21 12A9 9 0 103 12a9 9 0 0018 0z" />;
const PaletteIcon = ({ size = 16 }) => <I size={size} d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4 10 10c0 1.1-.9 2-2 2h-1.5c-.8 0-1.5.7-1.5 1.5 0 .4.2.8.4 1.1.3.4.5.8.5 1.4 0 1.1-.9 2-2 2H12z" />;
const GlobeIcon = ({ size = 16 }) => <I size={size} d="M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />;
const CardIcon = ({ size = 16 }) => <I size={size} d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22" />;
const TrendIcon = ({ size = 16 }) => <I size={size} d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" />;
const LogoutIcon = ({ size = 16 }) => <I size={size} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />;
const MenuIcon = () => <I size={18} d="M3 12h18M3 6h18M3 18h18" />;
const CloseIcon = () => <I size={18} d="M18 6L6 18M6 6l12 12" />;
const ExternalIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);
