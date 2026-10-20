import Link from "next/link";
import { getContent, t, type Locale } from "@/content";
import { getDictionary, homePath, tldrPath } from "@/content/dictionary";
import { Container } from "@/components/ui/primitives";
import { Clock } from "@/components/ui/Clock";
import { MobileMenu } from "./MobileMenu";

export const SECTION_IDS = {
  activity: "activity",
  systems: "systems",
  stack: "stack",
  career: "career",
  runbook: "runbook",
  about: "about",
  contact: "contact",
} as const;

/** Barra superior fixa. @param altHref mesma página no outro idioma. */
export function Nav({ locale, altHref }: { locale: Locale; altHref: string }) {
  const d = getDictionary(locale);
  const { profile } = getContent();
  const home = homePath(locale);

  const items = (
    [
      ["systems", d.nav.systems],
      ["stack", d.nav.stack],
      ["career", d.nav.career],
      ["contact", d.nav.contact],
    ] as const
  ).map(([key, label]) => ({ href: `${home}#${SECTION_IDS[key]}`, label }));

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        {d.nav.skip}
      </a>
      <Container className="flex h-14 items-center gap-6">
        <Link href={home} className="flex items-baseline gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.16em]">
          <span className="text-fg">{profile.shortName}</span>
          <span className="hidden text-subtle 2xl:inline">▸ {t(profile.role, locale)}</span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <span className="hidden xl:inline">
            <Clock />
          </span>
          <Link
            href={tldrPath(locale)}
            className="hidden whitespace-nowrap border border-accent/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent transition-colors hover:bg-accent hover:text-bg sm:inline-block"
          >
            {d.nav.recruiter} · {d.nav.recruiterShort}
          </Link>
          <Link
            href={altHref}
            hrefLang={locale === "pt" ? "en" : "pt-BR"}
            aria-label={d.nav.switchLangLabel}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg"
          >
            {locale === "pt" ? "EN" : "PT"}
          </Link>
          <MobileMenu
            items={[...items, { href: tldrPath(locale), label: `${d.nav.recruiter} · ${d.nav.recruiterShort}` }]}
            openLabel={d.nav.menu}
            closeLabel={d.nav.close}
          />
        </div>
      </Container>
    </header>
  );
}
