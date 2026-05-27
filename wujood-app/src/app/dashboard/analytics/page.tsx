import { getTenantOrRedirect } from "@/lib/tenant-guard";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "التحليلات" };

export default async function AnalyticsPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = await createClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const rpcPromise = supabase.rpc("visitor_by_device", { p_tenant_id: tenant.id, p_since: thirtyDaysAgo }).then(
    (result) => result,
    () => ({ data: null, error: null }),
  );

  const [
    { count: total30d },
    { data: byDevice },
    { data: topPaths },
  ] = await Promise.all([
    supabase.from("visitor_events").select("id", { count: "exact", head: true }).eq("tenant_id", tenant.id).gte("created_at", thirtyDaysAgo),
    rpcPromise,
    supabase.from("visitor_events").select("path").eq("tenant_id", tenant.id).gte("created_at", thirtyDaysAgo).limit(500),
  ]);

  // Aggregate top paths manually (RPC might not exist yet)
  const pathCounts: Record<string, number> = {};
  (topPaths ?? []).forEach((e) => {
    pathCounts[e.path] = (pathCounts[e.path] ?? 0) + 1;
  });
  const sortedPaths = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>التحليلات</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted)" }}>إحصاءات زوار موقعك خلال آخر 30 يوماً</p>

      {/* Total */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        <StatBox label="إجمالي الزيارات (30 يوم)" value={String(total30d ?? 0)} />
        <StatBox label="الصفحة الأكثر زيارة" value={sortedPaths[0]?.[0] ?? "-"} small />
        <StatBox label="صفحات مختلفة" value={String(sortedPaths.length)} />
      </div>

      {/* Top pages */}
      <div style={card}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>أكثر الصفحات زيارةً</h3>
        {sortedPaths.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sortedPaths.map(([path, count]) => {
              const pct = Math.round((count / (total30d ?? 1)) * 100);
              return (
                <div key={path} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-soft)" }}>{path || "/"}</div>
                  <div style={{ width: 120, height: 6, background: "var(--bg-alt)", borderRadius: "var(--r-pill)", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "var(--primary)", borderRadius: "var(--r-pill)", width: `${pct}%` }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", width: 40, textAlign: "left", direction: "ltr" }}>{count}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 24, fontSize: 14, color: "var(--muted)" }}>
            لا توجد بيانات كافية بعد
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--bg-alt)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--muted)" }}>
        📊 التحليلات تحترم خصوصية الزوار — لا cookies، لا تتبع شخصي.
      </div>
    </div>
  );
}

function StatBox({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 18 }}>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: small ? 16 : 28, fontWeight: 600, color: "var(--primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20 };
