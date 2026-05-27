import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "wujood.sa";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createMiddlewareClient(request, response);

  // Refresh session on every request
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") ?? "";

  // Strip port for local dev
  const host = hostname.replace(/:.*$/, "");

  const isRootDomain =
    host === ROOT_DOMAIN ||
    host === `www.${ROOT_DOMAIN}` ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app");   // Vercel preview / staging deployments

  // ── Admin protection ─────────────────────────────────────────
  if (isRootDomain && url.pathname.startsWith("/admin")) {
    if (!user) {
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Verify admin via DB
    const { data } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!data) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // ── Dashboard protection ──────────────────────────────────────
  if (isRootDomain && url.pathname.startsWith("/dashboard")) {
    if (!user) {
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── Root domain — pass through ────────────────────────────────
  if (isRootDomain) {
    return response;
  }

  // ── Tenant routing ────────────────────────────────────────────
  let slug: string | null = null;
  let lookupField: "slug" | "custom_domain" = "slug";

  // Check subdomain: <slug>.wujood.sa
  const subdomain = host.replace(`.${ROOT_DOMAIN}`, "");
  if (host.endsWith(`.${ROOT_DOMAIN}`) && subdomain !== host) {
    slug = subdomain;
    lookupField = "slug";
  } else {
    // Custom domain lookup
    lookupField = "custom_domain";
    slug = host;
  }

  if (!slug) {
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  // Look up tenant
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, slug, is_active, ends_at, plan")
    .eq(lookupField, slug)
    .single();

  if (!tenant) {
    url.hostname = ROOT_DOMAIN;
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  // Suspended → 404
  if (!tenant.is_active) {
    url.hostname = ROOT_DOMAIN;
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  // Expired subscription → show expired page
  if (tenant.ends_at && new Date(tenant.ends_at) < new Date()) {
    const expiredUrl = url.clone();
    expiredUrl.hostname = ROOT_DOMAIN;
    expiredUrl.pathname = "/expired";
    expiredUrl.searchParams.set("slug", tenant.slug);
    return NextResponse.redirect(expiredUrl);
  }

  // Track visitor event (fire-and-forget, non-blocking)
  const userAgentHash = await hashUA(
    request.headers.get("user-agent") ?? "",
    request.headers.get("x-forwarded-for") ?? "",
  );
  const deviceType = detectDevice(request.headers.get("user-agent") ?? "");

  supabase.from("visitor_events").insert({
    tenant_id: tenant.id,
    path: url.pathname,
    referrer_host: getReferrerHost(request.headers.get("referer")),
    device_type: deviceType,
    user_agent_hash: userAgentHash,
  }).then(() => {});

  // Rewrite to /_site/[slug]/...
  const rewriteUrl = url.clone();
  rewriteUrl.pathname = `/_site/${tenant.slug}${url.pathname}`;

  const rewriteResponse = NextResponse.rewrite(rewriteUrl);
  rewriteResponse.headers.set("x-tenant-id", tenant.id);
  rewriteResponse.headers.set("x-tenant-slug", tenant.slug);

  return rewriteResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// ── Helpers ──────────────────────────────────────────────────

async function hashUA(ua: string, ip: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const raw = `${ua}|${ip}|${today}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function detectDevice(ua: string): "mobile" | "desktop" | "tablet" {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return "mobile";
  return "desktop";
}

function getReferrerHost(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).hostname;
  } catch {
    return null;
  }
}
