import { PLANS } from "@/lib/constants";
import type { Plan } from "@/lib/types";

export function PlanBadge({ plan }: { plan: Plan }) {
  const colors: Record<Plan, { bg: string; text: string }> = {
    basic:   { bg: "var(--border-soft)",  text: "var(--muted)"   },
    pro:     { bg: "var(--primary-soft)", text: "var(--primary)" },
    premium: { bg: "var(--accent-soft)",  text: "var(--accent)"  },
  };
  const c = colors[plan];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: "var(--r-pill)",
      fontSize: 11, fontWeight: 600, background: c.bg, color: c.text,
    }}>
      {PLANS[plan].labelAr}
    </span>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: "var(--r-pill)",
      fontSize: 11, fontWeight: 600,
      background: active ? "#e8f5ee" : "var(--danger-soft)",
      color: active ? "var(--success)" : "var(--danger)",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
      {active ? "نشط" : "معطّل"}
    </span>
  );
}
