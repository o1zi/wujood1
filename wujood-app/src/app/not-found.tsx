import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="text-center max-w-md">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 80, fontWeight: 700, color: "var(--border-strong)", lineHeight: 1 }}>
          404
        </div>
        <h1 className="text-2xl font-bold mb-3 mt-4" style={{ color: "var(--ink)" }}>
          الصفحة غير موجودة
        </h1>
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          الرابط الذي تبحث عنه غير موجود أو تم نقله.
        </p>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", height: 40, padding: "0 20px",
          background: "var(--primary)", color: "#fff", borderRadius: "var(--r-md)",
          fontSize: 14, fontWeight: 500,
        }}>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
