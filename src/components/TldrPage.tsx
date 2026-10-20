import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { getContent, isPending, t, tList, visibleMetrics, type Locale } from "@/content";
import { formatMonth, getDictionary, homePath, projectPath, tldrPath } from "@/content/dictionary";
import { getGithubStats } from "@/lib/github";
import { Container, Led, buttonPrimary, buttonSecondary } from "@/components/ui/primitives";
import { PrintButton } from "@/components/ui/PrintButton";
import { buildMetadata } from "@/components/seo";

export function tldrMetadata(locale: Locale) {
  const { profile, seo } = getContent();
  return buildMetadata({
    locale,
    paths: { pt: tldrPath("pt"), en: tldrPath("en") },
    title: `${getDictionary(locale).tldr.title} · ${profile.shortName}`,
    description: t(seo.description, locale),
  });
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent print:text-black">{children}</h2>
  );
}

/** Uma página, 30 segundos de leitura, pronta para imprimir. */
export async function TldrPage({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const { profile, projects, experiences, skillGroups, education } = getContent();
  const github = await getGithubStats(profile.links.github);
  const email = isPending(profile.email) ? "" : profile.email;
  const cv = isPending(profile.cv[locale]) ? "" : profile.cv[locale];
  const format = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US");

  const highlights = projects
    .filter((p) => p.featured)
    .slice(0, 3)
    .map((p) => ({
      project: p,
      metric: visibleMetrics(p.metrics, locale)[0],
      result: tList(p.results, locale)[0] || t(p.tagline, locale),
    }));
  const stack = skillGroups.flatMap((g) => g.items.map((i) => i.name)).slice(0, 14);
  const contacts = [
    email && { label: email, href: `mailto:${email}` },
    profile.links.linkedin && { label: profile.links.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: profile.links.linkedin },
    profile.links.github && { label: profile.links.github.replace(/^https?:\/\//, ""), href: profile.links.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="min-h-dvh py-8 sm:py-14 print:bg-white print:py-0 print:text-black">
      <Container className="max-w-4xl">
        <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={homePath(locale)}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {d.tldr.full}
          </Link>
          <div className="flex gap-2">
            {cv && (
              <a href={cv} download className={buttonPrimary}>
                <Download className="size-3.5" aria-hidden />
                {d.hero.downloadCv}
              </a>
            )}
            <PrintButton label={d.tldr.print} className={buttonSecondary} />
          </div>
        </div>

        <article className="panel p-6 sm:p-10 print:border-0 print:p-0 print:before:hidden print:after:hidden">
          <header className="border-b border-line pb-6 print:border-black/20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">// {d.tldr.title}</p>
            <div className="mt-3 flex items-center gap-5">
              {profile.photo.src && (
                <Image
                  src={profile.photo.src}
                  alt={t(profile.photo.alt, locale) || profile.name}
                  width={88}
                  height={110}
                  className="h-[110px] w-[88px] border border-line object-cover print:border-black/20"
                />
              )}
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm text-muted print:text-black/70">
              <span className="text-fg print:text-black">{t(profile.role, locale)}</span>
              {t(profile.availability, locale) && (
                <span className="inline-flex items-center gap-2 text-accent print:text-black">
                  <Led live={false} />
                  {t(profile.availability, locale)}
                </span>
              )}
              {t(profile.location, locale) && <span>{t(profile.location, locale)}</span>}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
              {contacts.map((c) => (
                <li key={c.href}>
                  <a href={c.href} className="text-muted hover:text-accent print:text-black">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <p className="mt-6 text-lg leading-relaxed text-pretty">{t(profile.subheadline, locale)}</p>

          <section className="mt-8">
            <Label>{d.tldr.results}</Label>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map(({ project, metric, result }) => (
                <li key={project.slug} className="border border-line p-4 print:border-black/20">
                  {metric && (
                    <p className="tabular font-mono text-3xl font-medium text-accent print:text-black">
                      {metric.value}
                      <span className="ml-2 align-middle text-[11px] font-normal text-subtle">{t(metric.label, locale)}</span>
                    </p>
                  )}
                  <Link href={projectPath(locale, project.slug)} className="mt-2 block font-medium hover:text-accent">
                    {project.title}
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-muted print:text-black/70">{result}</p>
                </li>
              ))}
            </ul>
            {github && (
              <p className="mt-4 font-mono text-xs text-muted print:text-black/70">
                GitHub: <span className="text-fg print:text-black">{format.format(github.total)}</span> {d.github.total} ·{" "}
                <span className="text-fg print:text-black">{github.activeDays}</span> {d.github.activeDays} (12m)
              </p>
            )}
          </section>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-[1.4fr_1fr]">
            <section>
              <Label>{d.tldr.experience}</Label>
              <ul className="mt-4 space-y-3">
                {experiences.map((job, i) => (
                  <li key={i}>
                    <p className="font-medium">
                      {t(job.role, locale)} <span className="text-muted">· {job.company}</span>
                    </p>
                    <p className="font-mono text-xs text-subtle">
                      {formatMonth(job.start, locale)} → {t(job.end, locale)}
                    </p>
                  </li>
                ))}
                {education
                  .filter((e) => t(e.course, locale))
                  .map((e, i) => (
                    <li key={`e${i}`}>
                      <p className="font-medium">{t(e.course, locale)}</p>
                      <p className="font-mono text-xs text-subtle">
                        {[e.institution, e.period].filter((v) => v && !v.startsWith("TODO")).join(" · ")}
                      </p>
                    </li>
                  ))}
              </ul>
            </section>
            <section>
              <Label>{d.tldr.stack}</Label>
              <p className="mt-4 font-mono text-sm leading-7 text-muted print:text-black">{stack.join(" · ")}</p>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
}
