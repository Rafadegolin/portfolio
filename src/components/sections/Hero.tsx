import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Download } from "lucide-react";
import { getContent, isPending, t, visibleMetrics, type Locale } from "@/content";
import { formatDay, getDictionary, tldrPath } from "@/content/dictionary";
import type { GithubStats } from "@/lib/github";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Container, Led, PanelHeader, Readout, buttonPrimary, buttonSecondary } from "@/components/ui/primitives";
import { recentEvents } from "@/components/sections/DeployLog";
import { SystemMap } from "@/components/diagram/SystemMap";
import { SECTION_IDS } from "@/components/layout/Nav";

const nf = (locale: Locale) => new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US");

export function Hero({ locale, github }: { locale: Locale; github: GithubStats | null }) {
  const d = getDictionary(locale);
  const { profile, projects } = getContent();
  const events = recentEvents(locale, github, 6);
  const availability = t(profile.availability, locale);
  const location = t(profile.location, locale);
  const cv = isPending(profile.cv[locale]) ? "" : profile.cv[locale];
  const email = isPending(profile.email) ? "" : profile.email;
  const format = nf(locale);

  // Só números reais: os do admin que estão preenchidos + os do GitHub.
  const readouts = [
    ...(github
      ? [
          { value: format.format(github.total), label: `${d.github.total} / 12m`, accent: true },
          { value: format.format(github.activeDays), label: d.github.activeDays, accent: false },
        ]
      : []),
    ...visibleMetrics(profile.stats, locale).map((m) => ({
      value: m.value,
      label: t(m.label, locale),
      accent: false,
    })),
  ].slice(0, 4);

  return (
    <section className="relative overflow-hidden border-b border-line pt-14">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div>
            <p className="boot flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted" style={{ "--i": 0 } as React.CSSProperties}>
              {profile.photo.src && (
                <Image
                  src={profile.photo.src}
                  alt=""
                  width={36}
                  height={36}
                  priority
                  className="size-9 rounded-full border border-line-strong object-cover object-top"
                />
              )}
              <span className="text-subtle">// {d.hero.overline}</span>
              {availability && (
                <span className="inline-flex items-center gap-2 text-accent" data-motion>
                  <Led />
                  {availability}
                </span>
              )}
              {location && <span>{location}</span>}
            </p>

            <h1
              className="boot mt-7 text-[clamp(2.5rem,5.2vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-balance"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {t(profile.headline, locale)}
              <span aria-hidden className="caret ml-2 inline-block h-[0.8em] w-[0.42em] translate-y-[0.06em] bg-accent" data-motion />
            </h1>

            <p
              className="boot mt-7 max-w-xl text-lg leading-relaxed text-muted text-pretty"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {t(profile.subheadline, locale)}
            </p>

            <div className="boot mt-9 flex flex-wrap gap-2.5" style={{ "--i": 3 } as React.CSSProperties}>
              <a href={`#${SECTION_IDS.systems}`} className={buttonPrimary}>
                {d.hero.seeWork}
                <ArrowDown className="size-3.5" aria-hidden />
              </a>
              {cv && (
                <a href={cv} download className={buttonSecondary}>
                  <Download className="size-3.5" aria-hidden />
                  {d.hero.downloadCv}
                </a>
              )}
              {email && (
                <CopyEmail email={email} label={d.hero.copyEmail} copiedLabel={d.hero.copied} className={buttonSecondary} />
              )}
            </div>

            <Link
              href={tldrPath(locale)}
              className="boot mt-6 inline-block font-mono text-xs text-subtle underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              {d.hero.tldr} →
            </Link>
          </div>

          <div className="boot panel mx-auto w-full max-w-[680px]" style={{ "--i": 2 } as React.CSSProperties}>
            <PanelHeader
              title={d.hero.mapTitle}
              meta={
                <span className="inline-flex items-center gap-2" data-motion>
                  <Led />
                  {d.hero.mapMeta(
                    projects.filter((p) => p.status === "production").length,
                    projects.filter((p) => p.status === "side").length,
                  )}
                </span>
              }
            />
            <div className="p-2 sm:p-3">
              <SystemMap locale={locale} />
            </div>
            {events.length > 0 && (
              // Ticker de eventos reais: troca de linha a cada ~3s, só CSS.
              <div className="flex items-center gap-3 border-t border-line px-4 py-2.5 font-mono text-[11px]" data-motion>
                <span className="shrink-0 uppercase tracking-[0.14em] text-subtle">{d.hero.events}</span>
                <div className="h-4 min-w-0 flex-1 overflow-hidden">
                  <ul className="ticker" style={{ "--n": events.length } as React.CSSProperties}>
                    {events.map((e, i) => (
                      <li key={i} className="flex h-4 items-center gap-2 truncate leading-4">
                        <span className={e.kind === "shipped" ? "text-accent" : "text-flow"}>
                          {e.kind === "shipped" ? "✓" : "●"}
                        </span>
                        <span className="tabular text-subtle">{formatDay(e.date, locale)}</span>
                        {e.kind === "commit" && <span className="text-muted">{e.repo}</span>}
                        <span className="truncate text-fg">{e.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {readouts.length > 0 && (
          <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
            {readouts.map((r, i) => (
              <div key={r.label} className={`py-6 ${i > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${i % 2 === 1 ? "border-l border-line pl-4 sm:pl-6" : ""}`}>
                <Readout value={r.value} label={r.label} accent={r.accent} size="lg" />
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
