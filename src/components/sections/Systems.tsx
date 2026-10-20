import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { getContent, t, visibleMetrics, type Locale, type Project } from "@/content";
import { getDictionary, projectPath } from "@/content/dictionary";
import { Panel, Pipeline, Readout, StatusBadge, TagList } from "@/components/ui/primitives";
import { ArchitectureDiagram } from "@/components/diagram/ArchitectureDiagram";
import { SECTION_IDS } from "@/components/layout/Nav";

function Featured({ project, locale, n }: { project: Project; locale: Locale; n: number }) {
  const d = getDictionary(locale);
  const metrics = visibleMetrics(project.metrics, locale);
  const href = projectPath(locale, project.slug);

  return (
    <article className="reveal border-b border-line last:border-b-0">
      <div className="grid grid-cols-1 gap-8 p-4 sm:p-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            <span className="text-muted">{String(n).padStart(2, "0")}</span>
            <StatusBadge status={project.status} label={d.systems.status[project.status]} />
            <span>{t(project.category, locale)}</span>
            {project.confidential && (
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" aria-hidden />
                {d.systems.confidential}
              </span>
            )}
          </div>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Link href={href} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-xl leading-relaxed text-muted text-pretty">{t(project.tagline, locale)}</p>
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-accent hover:underline"
          >
            {d.systems.openCase}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:items-end lg:text-right">
          {metrics.length > 0 && (
            <dl className="flex flex-wrap gap-x-10 gap-y-5 lg:justify-end">
              {metrics.map((m, i) => (
                <Readout key={m.value + i} value={m.value} label={t(m.label, locale)} accent={i === 0} />
              ))}
            </dl>
          )}
          <TagList items={project.stack} className="lg:justify-end" />
        </div>
      </div>

      {project.architecture.nodes.length > 0 && (
        // Diagrama na largura toda; no celular rola na horizontal em vez de encolher.
        <div className="overflow-x-auto border-t border-line bg-bg/60 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto min-w-[720px] max-w-5xl">
            <ArchitectureDiagram
              architecture={project.architecture}
              title={`${project.title} — ${t(project.category, locale)}`}
              idPrefix={`sys-${project.slug}`}
              className="mx-auto"
            />
          </div>
        </div>
      )}
    </article>
  );
}

function Row({ project, locale }: { project: Project; locale: Locale }) {
  const d = getDictionary(locale);
  const metric = visibleMetrics(project.metrics, locale)[0];
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={projectPath(locale, project.slug)}
        className="group grid grid-cols-1 gap-2 px-4 py-5 transition-colors hover:bg-raised sm:px-6 md:grid-cols-[110px_1fr_auto_auto] md:items-center md:gap-6"
      >
        <StatusBadge status={project.status} label={d.systems.status[project.status]} />
        <span>
          <span className="font-medium group-hover:text-accent">{project.title}</span>
          <span className="mt-0.5 block text-sm text-muted">{t(project.tagline, locale)}</span>
        </span>
        <span className="hidden lg:block">
          <Pipeline items={project.stack} max={3} />
        </span>
        <span className="flex items-center gap-4 font-mono text-xs">
          {metric && (
            <span className="text-fg">
              {metric.value} <span className="text-subtle">{t(metric.label, locale)}</span>
            </span>
          )}
          <ArrowUpRight className="size-4 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

export function Systems({ locale, index }: { locale: Locale; index: string }) {
  const d = getDictionary(locale);
  const { projects } = getContent();
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <Panel
      id={SECTION_IDS.systems}
      index={index}
      title={d.systems.title}
      meta={d.systems.meta(projects.length)}
      bodyClassName=""
    >
      <p className="max-w-3xl border-b border-line px-4 py-4 text-sm leading-relaxed text-muted sm:px-6">
        {d.systems.intro}
      </p>
      {featured.map((project, i) => (
        <Featured key={project.slug} project={project} locale={locale} n={i + 1} />
      ))}
      {others.length > 0 && (
        <ul className="border-t border-line">
          {others.map((project) => (
            <Row key={project.slug} project={project} locale={locale} />
          ))}
        </ul>
      )}
    </Panel>
  );
}
