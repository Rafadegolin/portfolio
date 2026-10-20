import { getContent, t, type Locale } from "@/content";
import { formatDay, getDictionary } from "@/content/dictionary";
import type { GithubStats } from "@/lib/github";
import { Panel } from "@/components/ui/primitives";
import { SECTION_IDS } from "@/components/layout/Nav";

export type Entry =
  | { kind: "shipped"; date: string; title: string; detail: string; tags: string[] }
  | { kind: "commit"; date: string; title: string; repo: string; url: string };

const LIMIT = 10;

/** Entregas do admin + commits recentes do GitHub, mais recentes primeiro. */
export function recentEvents(locale: Locale, github: GithubStats | null, limit = LIMIT): Entry[] {
  const { workLog } = getContent();
  return [
    ...workLog
      .filter((e) => t(e.title, locale))
      .map((e) => ({
        kind: "shipped" as const,
        date: e.date,
        title: t(e.title, locale),
        detail: t(e.description, locale),
        tags: e.tags,
      })),
    ...(github?.recent ?? []).map((c) => ({
      kind: "commit" as const,
      date: c.date.slice(0, 10),
      title: c.message,
      repo: c.repo,
      url: c.url,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function DeployLog({ locale, index, github }: { locale: Locale; index: string; github: GithubStats | null }) {
  const d = getDictionary(locale);
  const entries = recentEvents(locale, github);
  if (entries.length === 0) return null;

  return (
    <Panel id={SECTION_IDS.log} index={index} title={d.log.title} meta={d.log.meta} bodyClassName="">
      <ol className="font-mono text-[13px]" data-motion>
        {entries.map((entry, i) => (
          <li
            key={i}
            className="reveal grid grid-cols-[4.5rem_1fr] gap-x-3 border-b border-line/70 px-4 py-3 last:border-b-0 sm:grid-cols-[5rem_6.5rem_1fr] sm:px-6"
          >
            <time dateTime={entry.date} className="tabular text-subtle">
              {formatDay(entry.date, locale)}
            </time>
            <span
              className={`hidden sm:inline ${entry.kind === "shipped" ? "text-accent" : "text-flow"}`}
            >
              {entry.kind === "shipped" ? `✓ ${d.log.shipped}` : `● ${d.log.commit}`}
            </span>
            <div className="min-w-0">
              {entry.kind === "shipped" ? (
                <>
                  <p className="text-fg">{entry.title}</p>
                  {entry.detail && <p className="mt-1 font-sans text-sm leading-relaxed text-muted">{entry.detail}</p>}
                  {entry.tags.length > 0 && (
                    <p className="mt-1.5 text-[11px] text-subtle">{entry.tags.map((tag) => `#${tag}`).join(" ")}</p>
                  )}
                </>
              ) : (
                <p className="truncate">
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-flow">
                    {entry.repo}
                  </a>
                  <span className="text-subtle"> · </span>
                  <span className="text-fg">{entry.title}</span>
                </p>
              )}
            </div>
          </li>
        ))}
        <li className="px-4 py-3 text-subtle sm:px-6">
          <span className="caret inline-block h-3.5 w-2 translate-y-0.5 bg-subtle" aria-hidden />
        </li>
      </ol>
    </Panel>
  );
}
