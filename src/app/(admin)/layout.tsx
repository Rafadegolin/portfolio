import type { Metadata } from "next";
import { RootHtml } from "@/components/layout/RootHtml";

export const metadata: Metadata = {
  title: "Admin · Portfolio",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="pt-BR">{children}</RootHtml>;
}
