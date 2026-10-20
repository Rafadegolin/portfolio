import type { Metadata } from "next";
import { getContent, isPending, t, type Locale } from "@/content";
import { htmlLang } from "@/content/dictionary";

/** Metadata com canonical + hreflang para uma página que existe nos dois idiomas. */
export function buildMetadata({
  locale,
  paths,
  title,
  description,
}: {
  locale: Locale;
  paths: Record<Locale, string>;
  title?: string;
  description?: string;
}): Metadata {
  const { seo, profile } = getContent();
  const finalTitle = title ?? t(seo.title, locale);
  const finalDescription = description ?? t(seo.description, locale);

  return {
    metadataBase: new URL(seo.siteUrl),
    title: finalTitle,
    description: finalDescription,
    authors: [{ name: profile.name }],
    alternates: {
      canonical: paths[locale],
      languages: { "pt-BR": paths.pt, en: paths.en, "x-default": paths.pt },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: paths[locale],
      siteName: profile.shortName,
      locale: htmlLang[locale].replace("-", "_"),
      type: "website",
    },
    twitter: { card: "summary_large_image", title: finalTitle, description: finalDescription },
  };
}

export function PersonJsonLd({ locale }: { locale: Locale }) {
  const { profile, seo } = getContent();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: t(profile.role, locale),
    url: seo.siteUrl,
    ...(isPending(profile.email) ? {} : { email: `mailto:${profile.email}` }),
    sameAs: [profile.links.github, profile.links.linkedin].filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
