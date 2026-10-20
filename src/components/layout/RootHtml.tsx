import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** <html>/<body> compartilhado pelos root layouts (pt, en, admin). */
export function RootHtml({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-bg antialiased">{children}</body>
    </html>
  );
}
