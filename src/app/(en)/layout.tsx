import type { Metadata } from "next";
import { RootHtml } from "@/components/layout/RootHtml";
import { buildMetadata } from "@/components/seo";

export const metadata: Metadata = buildMetadata({ locale: "en", paths: { pt: "/", en: "/en" } });

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
