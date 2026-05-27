"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function I({ size = 16, d }: { size?: number; d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
function GridIcon()    { return <I d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />; }
function UsersIcon()   { return <I d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z" />; }
function PlusIcon()    { return <I d="M12 5v14M5 12h14" />; }
function LogoutIcon()  { return <I d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />; }
function MenuIcon()    { return <I size={18} d="M3 12h18M3 6h18M3 18h18" />; }
function CloseIcon()   { return <I size={18} d="M18 6L6 18M6 6l12 12" />; }
function ShieldIcon()  { return <I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />; }

const NAV = [
  { href: "/admin",          label: "الرئيسية",  icon: GridIcon  },
  { href: "/admin/tenants",  label: "المكاتب",   icon: UsersIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen] = useState(false);

  const current = NAV.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)));

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", direction: "rtl" }}>

      {/* Overlay mobile */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 99 }}
          onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        borderInlineStart: "1px solid var(--border)",
        background: "var(--surface)", padding: "16px 12px",
        display: "flex", flexDirection: "column", gap: 8,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        zIndex: 100,
      }} className={open ? "adm-sidebar open" : "adm-sidebar"}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "var(--primary)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="rgba(255,255,255,.9)" />
                <path d="M12 7L16 9.5V14.5L12 17L8 14.5V9.5L12 7Z" fill="var(--primary)" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>وجود</span>
          </div>
          <button onClick={() => setOpen(false)} className="adm-close-btn"
            style={{ display: "none", width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
            <CloseIcon />
          </button>
        </div>

        {/* Admin badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
          background: "var(--primary-soft)", borderRadius: "var(--r-md)", marginBottom: 4,
        }}>
          <ShieldIcon />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>لوحة الأدمن</span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon   = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: "var(--r-md)",
                  fontSize: 13.5, fontWeight: active ? 600 : 400,
                  color: active ? "var(--primary)" : "var(--ink-soft)",
                  background: active ? "var(--primary-soft)" : "transparent",
                  transition: "all .1s",
                }}>
                <Icon />
                {item.label}
              </Link>
            );
          })}

          {/* Quick create */}
          <Link href="/admin/tenants/new" onClick={() => setOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: "var(--r-md)",
              fontSize: 13.5, fontWeight: 400,
              color: "var(--accent)", transition: "all .1s", marginTop: 4,
            }}>
            <PlusIcon />
            إنشاء مكتب جديد
          </Link>
        </nav>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", fontSize: 13, color: "var(--muted)" }}>
            <GridIcon />
            داشبورد المكتب
          </Link>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--r-md)", fontSize: 13.5, color: "var(--danger)", width: "100%" }}>
            <LogoutIcon />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0 }}>
        <header style={{
          height: 56, background: "var(--surface)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 14, padding: "0 24px",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <button onClick={() => setOpen(true)} className="adm-menu-btn"
            style={{ display: "none", width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <MenuIcon />
          </button>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>
            {current?.label ?? "لوحة الأدمن"}
          </h1>
        </header>

        <div style={{ padding: "24px 28px 60px", maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .adm-sidebar {
            position: fixed !important;
            insetInlineStart: 0; top: 0; bottom: 0;
            transform: translateX(100%); transition: transform .2s;
          }
          .adm-sidebar.open { transform: translateX(0) !important; }
          .adm-menu-btn  { display: inline-flex !important; }
          .adm-close-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}
