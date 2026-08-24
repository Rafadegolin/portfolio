import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// font-mono so aparece em labels e blocos de codigo: um peso basta.
// Inter fica sem restricao de peso — o site usa 300/400/500/700/800/900.
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rafael Degolin - Full Stack Developer",
  description:
    "Desenvolvedor Full Stack & Engenheiro da Computação. Criando ecossistemas digitais completos.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Automation",
  ],
  authors: [{ name: "Rafael Degolin da Silva" }],
  openGraph: {
    title: "Rafael Degolin - Full Stack Developer",
    description: "Desenvolvedor Full Stack & Engenheiro da Computação",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased bg-[#050505] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
