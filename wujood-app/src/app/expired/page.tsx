import Link from "next/link";
import { WHATSAPP_SUPPORT } from "@/lib/constants";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--warn-soft)" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          انتهى اشتراك هذا المكتب
        </h1>
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          الموقع غير متاح حالياً بسبب انتهاء صلاحية الاشتراك. للتواصل مع المكتب مباشرةً أو للاستفسار، تواصل معهم عبر قنواتهم المعتادة.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_SUPPORT.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-white font-medium transition-all"
            style={{ background: "var(--success)", fontSize: "14px" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            تواصل مع المنصة
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md font-medium transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--ink-soft)", fontSize: "14px" }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
