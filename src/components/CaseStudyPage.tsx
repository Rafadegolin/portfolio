import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { getContent, t, tList, visibleMetrics, type Locale } from "@/content";
import { formatMonth, getDictionary, homePath, projectPath } from "@/content/dictionary";
import { Nav, SECTION_IDS } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Container, Panel, Readout, StatusBadge, TagList, buttonPrimary, buttonSecondary } from "@/components/ui/primitives";
import { Gallery } from "@/components/ui/Gallery";
import { InViewPauser } from "@/components/ui/InViewPauser";
import { ArchitectureDiagram } from "@/components/diagram/ArchitectureDiagram";
import { ProjectJsonLd, buildMetadata } from "@/components/seo";

export function getProject(slug: string) {
  return getContent().projects.find((p) => p.slug === slug);
}

export function caseStudyParams() {
  return getContent().projects.map((p) => ({ slug: p.slug }));
}

export function caseStudyMetadata(locale: Locale, slug: string) {
  const project = getProject(slug);
  if (!project) return {};
  const { profile } = getContent();
  return buildMetadata({
    locale,
    paths: { pt: projectPath("pt", slug), en: projectPath("en", slug) },
    title: `${project.title} · ${profile.shortName}`,
    description: t(project.tagline, locale),
  });
}

function ReportRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="reveal grid grid-cols-1 gap-3 border-b border-line px-4 py-6 last:border-b-0 sm:px-6 md:grid-cols-[180px_1fr] md:gap-10">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent md:pt-1">{label}</h2>
      <div className="max-w-3xl text-lg leading-relaxed text-pretty">{children}</div>
    </div>
  );
}

export function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProject(slug);
  if (!project) notFound();

  const d = getDictionary(locale);
  const { projects } = getContent();
  const metrics = visibleMetrics(project.metrics, locale);
  const results = tList(project.results, locale);
  const links = project.links.filter((l) => l.url && t(l.label, locale));
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  const otherLocale: Locale = locale === "pt" ? "en" : "pt";
  const year = project.year.startsWith("TODO") ? "" : project.year;
  const context = t(project.context, locale);
  const decisions = tList(project.decisions, locale);
  const highlights = project.highlights.filter((h) => t(h.title, locale));
  const timeline = project.timeline.filter((m) => m.date && t(m.label, locale));
  const images = project.images
    .filter((img) => img.src)
    .map((img) => ({ src: img.src, alt: t(img.alt, locale), caption: img.caption ? t(img.caption, locale) : "" }));
  // Numeração dos painéis acompanha só os que aparecem.
  let panel = 0;
  const nextIndex = () => String(++panel).padStart(2, "0");

  return (
    <>
      <Nav locale={locale} altHref={projectPath(otherLocale, slug)} />
      <main id="main" className="pt-14">
        <section className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <Container className="relative py-12 sm:py-16">
            <Link
              href={`${homePath(locale)}#${SECTION_IDS.systems}`}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-accent"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              {d.caseStudy.back}
            </Link>

            <div className="boot mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              <span>// {d.caseStudy.report}</span>
              <StatusBadge status={project.status} label={d.systems.status[project.status]} />
              <span>{t(project.category, locale)}</span>
              {year && <span>{year}</span>}
              {project.confidential && (
                <span className="inline-flex items-center gap-1">
                  <Lock className="size-3" aria-hidden />
                  {d.systems.confidential}
                </span>
              )}
            </div>
            <h1
              className="boot mt-5 text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {project.title}
            </h1>
            <p
              className="boot mt-6 max-w-2xl text-xl leading-relaxed text-muted text-pretty"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {t(project.tagline, locale)}
            </p>
            {context && (
              <p
                className="boot mt-4 max-w-2xl font-mono text-xs leading-relaxed text-subtle"
                style={{ "--i": 2 } as React.CSSProperties}
              >
                <span className="text-accent">{d.caseStudy.context} ·</span> {context}
              </p>
            )}
            {links.length > 0 && (
              <ul className="boot mt-8 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
                {links.map((l, i) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={i === 0 ? buttonPrimary : buttonSecondary}
                    >
                      {t(l.label, locale)}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {metrics.length > 0 && (
              <dl className="boot mt-10 flex flex-wrap gap-x-12 gap-y-6" style={{ "--i": 3 } as React.CSSProperties}>
                {metrics.map((m, i) => (
                  <Readout key={m.value + i} value={m.value} label={t(m.label, locale)} accent={i === 0} size="lg" />
                ))}
              </dl>
            )}
          </Container>
        </section>

        <Container className="flex flex-col gap-6 py-10 sm:gap-8 sm:py-14">
          {project.architecture.nodes.length > 0 && (
            <Panel title={d.caseStudy.architecture} index={nextIndex()}bodyClassName="flex justify-center overflow-x-auto bg-bg/60 p-4 sm:p-8">
              <div className="min-w-[560px] max-w-5xl flex-1">
                <ArchitectureDiagram
                  architecture={project.architecture}
                  title={`${project.title} — ${d.caseStudy.architecture}`}
                  idPrefix={`case-${project.slug}`}
                  className="mx-auto"
                />
              </div>
            </Panel>
          )}

          {highlights.length > 0 && (
            <Panel
              title={d.caseStudy.highlights}
              index={nextIndex()}
              bodyClassName="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-3"
            >
              {highlights.map((h, i) => (
                <article key={i} className="reveal bg-panel p-5 sm:p-6">
                  <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-pretty">{t(h.title, locale)}</h3>
                  <p className="mt-2 leading-relaxed text-muted text-pretty">{t(h.description, locale)}</p>
                </article>
              ))}
            </Panel>
          )}

          <Panel title={d.caseStudy.report} index={nextIndex()} bodyClassName="">
            {t(project.problem, locale) && <ReportRow label={d.caseStudy.problem}>{t(project.problem, locale)}</ReportRow>}
            {t(project.solution, locale) && (
              <ReportRow label={d.caseStudy.solution}>{t(project.solution, locale)}</ReportRow>
            )}
            {decisions.length > 0 && (
              <ReportRow label={d.caseStudy.decisions}>
                <ul className="space-y-2.5">
                  {decisions.map((r, i) => (
                    <li key={i} className="grid grid-cols-[1.5rem_1fr]">
                      <span className="font-mono text-accent" aria-hidden>
                        →
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </ReportRow>
            )}
            {t(project.role, locale) && <ReportRow label={d.caseStudy.role}>{t(project.role, locale)}</ReportRow>}
            {results.length > 0 && (
              <ReportRow label={d.caseStudy.results}>
                <ul className="space-y-2.5">
                  {results.map((r, i) => (
                    <li key={i} className="grid grid-cols-[1.5rem_1fr]">
                      <span className="font-mono text-accent" aria-hidden>
                        +
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </ReportRow>
            )}
            <ReportRow label={d.caseStudy.stack}>
              <TagList items={project.stack} />
            </ReportRow>
            {timeline.length > 0 && (
              <ReportRow label={d.caseStudy.timeline}>
                <ol className="space-y-2.5">
                  {timeline.map((m, i) => (
                    <li key={i} className="grid grid-cols-[6.5rem_1fr] gap-3">
                      <span className="tabular pt-0.5 font-mono text-sm text-subtle">{formatMonth(m.date, locale)}</span>
                      {t(m.label, locale)}
                    </li>
                  ))}
                </ol>
              </ReportRow>
            )}
            {links.length > 0 && (
              <ReportRow label={d.caseStudy.links}>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
                  {links.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-fg hover:text-accent"
                      >
                        {t(l.label, locale)}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </ReportRow>
            )}
          </Panel>

          {images.length > 0 && (
            <Panel title={d.caseStudy.gallery} index={nextIndex()} meta={String(images.length)} bodyClassName="">
              <Gallery
                images={images}
                labels={{
                  open: d.caseStudy.openImage,
                  close: d.caseStudy.closeImage,
                  prev: d.caseStudy.prevImage,
                  next: d.caseStudy.nextImage,
                }}
              />
            </Panel>
          )}

          <section className="panel reveal flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{d.caseStudy.ctaTitle}</h2>
              <p className="mt-3 leading-relaxed text-muted text-pretty">{d.caseStudy.ctaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`${homePath(locale)}#${SECTION_IDS.contact}`} className={buttonPrimary}>
                {d.caseStudy.ctaButton}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
              <Link href={`${homePath(locale)}#${SECTION_IDS.systems}`} className={buttonSecondary}>
                {d.caseStudy.ctaSecondary}
              </Link>
            </div>
          </section>

          {nextProject && nextProject !== project && (
            <Link
              href={projectPath(locale, nextProject.slug)}
              className="panel group flex items-end justify-between gap-6 p-6 transition-colors hover:border-accent sm:p-8"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{d.caseStudy.next}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight group-hover:text-accent sm:text-6xl">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight
                className="mb-2 size-8 shrink-0 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent"
                aria-hidden
              />
            </Link>
          )}
        </Container>
      </main>
      <Footer locale={locale} />
      <InViewPauser />
      <ProjectJsonLd project={project} locale={locale} />
    </>
  );
}
