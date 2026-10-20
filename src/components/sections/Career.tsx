import { getContent, t, tList, type Locale } from "@/content";
import { formatMonth, getDictionary } from "@/content/dictionary";
import { Panel, TagList } from "@/components/ui/primitives";
import { SECTION_IDS } from "@/components/layout/Nav";

export function Career({ locale, index }: { locale: Locale; index: string }) {
  const d = getDictionary(locale);
  const { experiences } = getContent();
  const total = experiences.length;

  return (
    <Panel id={SECTION_IDS.career} index={index} title={d.career.title} meta={d.career.meta} bodyClassName="">
      <p className="max-w-3xl border-b border-line px-4 py-4 text-sm leading-relaxed text-muted sm:px-6">
        {d.career.intro}
      </p>
      <ol>
        {experiences.map((job, i) => {
          const version = `v${total - i}.0`;
          const current = i === 0;
          return (
            <li
              key={i}
              className="reveal grid grid-cols-1 gap-4 border-b border-line px-4 py-7 last:border-b-0 sm:px-6 md:grid-cols-[200px_1fr] md:gap-10"
            >
              <div className="font-mono text-xs">
                <span
                  className={`inline-block border px-2 py-0.5 ${current ? "border-accent text-accent" : "border-line-strong text-muted"}`}
                >
                  {version}
                  {current && " · latest"}
                </span>
                <p className="mt-3 text-subtle">
                  {formatMonth(job.start, locale)} → {t(job.end, locale)}
                </p>
                <p className="mt-1 text-sm text-fg">{job.company}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{t(job.role, locale)}</h3>
                {t(job.summary, locale) && (
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted text-pretty">{t(job.summary, locale)}</p>
                )}
                <ul className="mt-4 max-w-2xl space-y-2">
                  {tList(job.achievements, locale).map((item, j) => (
                    <li key={j} className="grid grid-cols-[1.25rem_1fr] leading-relaxed">
                      <span className="font-mono text-accent" aria-hidden>
                        +
                      </span>
                      <span className="text-pretty">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <TagList items={job.stack} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
