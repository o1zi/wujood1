import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "وجود — منصة المكاتب المهنية", template: "%s | وجود" },
  description: "منصة SaaS لإنشاء مواقع المكاتب المهنية وإدارتها",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
