import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { projectPath, tldrPath } from "@/content/dictionary";

export default function sitemap(): MetadataRoute.Sitemap {
  const { seo, projects } = getContent();
  const url = (path: string) => new URL(path, seo.siteUrl).toString();
  const entry = (pt: string, en: string) => ({
    url: url(pt),
    alternates: { languages: { "pt-BR": url(pt), en: url(en) } },
  });

  return [
    entry("/", "/en"),
    entry(tldrPath("pt"), tldrPath("en")),
    ...projects.map((p) => entry(projectPath("pt", p.slug), projectPath("en", p.slug))),
  ];
}
