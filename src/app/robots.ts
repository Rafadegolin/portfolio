import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export default function robots(): MetadataRoute.Robots {
  const { seo } = getContent();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: new URL("/sitemap.xml", seo.siteUrl).toString(),
  };
}
