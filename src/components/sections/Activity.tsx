import { ArrowUpRight } from "lucide-react";
import { getContent, type Locale } from "@/content";
import { getDictionary } from "@/content/dictionary";
import type { ContributionDay, GithubStats } from "@/lib/github";
import { Panel, Readout } from "@/components/ui/primitives";
import { SECTION_IDS } from "@/components/layout/Nav";

const CELL = 11;
const GAP = 3;
const LEFT = 26;
const TOP = 16;

const LEVEL_FILL = [
  "var(--color-raised)",
  "color-mix(in oklab, var(--color-accent) 28%, var(--color-panel))",
  "color-mix(in oklab, var(--color-accent) 52%, var(--color-panel))",
  "color-mix(in oklab, var(--color-accent) 78%, var(--color-panel))",
  "var(--color-accent)",
];

/** Níveis por quartis dos dias com contribuição (como o GitHub faz). */
function levels(days: ContributionDay[]) {
  const counts = days
    .map((d) => d.count)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);
  const q = (p: number) => counts[Math.floor((counts.length - 1) * p)] ?? 0;
  const cuts = [q(0.25), q(0.5), q(0.75)];
  return (count: number) => (count === 0 ? 0 : count <= cuts[0] ? 1 : count <= cuts[1] ? 2 : count <= cuts[2] ? 3 : 4);
}

function Heatmap({ github, locale }: { github: GithubStats; locale: Locale }) {
  const d = getDictionary(locale);
  const level = levels(github.weeks.flat());
  const width = LEFT + github.weeks.length * (CELL + GAP);
  const height = TOP + 7 * (CELL + GAP);

  // Rótulo de mês na primeira semana em que o mês aparece.
  const monthLabels: { x: number; label: string }[] = [];
  github.weeks.forEach((week, i) => {
    const first = week[0];
    if (!first) return;
    const month = Number(first.date.slice(5, 7)) - 1;
    const prev = github.weeks[i - 1]?.[0];
    if (!prev || Number(prev.date.slice(5, 7)) - 1 !== month) {
      monthLabels.push({ x: LEFT + i * (CELL + GAP), label: d.months[month] });
    }
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`${github.total} ${d.github.total}`}
      className="font-mono"
    >
      {monthLabels.slice(monthLabels[1] && monthLabels[1].x - monthLabels[0].x < 30 ? 1 : 0).map((m) => (
        <text key={m.x} x={m.x} y={10} fontSize={9} fill="var(--color-subtle)">
          {m.label}
        </text>
      ))}
      {[1, 3, 5].map((row) => (
        <text key={row} x={0} y={TOP + row * (CELL + GAP) + 9} fontSize={8.5} fill="var(--color-subtle)">
          {locale === "pt" ? ["", "seg", "", "qua", "", "sex"][row] : ["", "Mon", "", "Wed", "", "Fri"][row]}
        </text>
      ))}
      {github.weeks.map((week, i) =>
        week.map((day) => {
          const weekday = new Date(`${day.date}T12:00:00Z`).getUTCDay();
          return (
            <rect
              key={day.date}
              x={LEFT + i * (CELL + GAP)}
              y={TOP + weekday * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={1.5}
              fill={LEVEL_FILL[level(day.count)]}
            />
          );
        }),
      )}
    </svg>
  );
}

export function Activity({ locale, index, github }: { locale: Locale; index: string; github: GithubStats | null }) {
  if (!github) return null;
  const d = getDictionary(locale);
  const { profile } = getContent();
  const format = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US");

  const stats = [
    { value: format.format(github.total), label: d.github.total, accent: true },
    ...(github.privateCount > 0 ? [{ value: format.format(github.privateCount), label: d.github.private, accent: false }] : []),
    // Sequência atual só impressiona se for longa; abaixo disso, fica de fora.
    ...(github.currentStreak >= 3 ? [{ value: String(github.currentStreak), label: d.github.streak, accent: false }] : []),
    { value: String(github.longestStreak), label: d.github.longest, accent: false },
  ];

  return (
    <Panel
      id={SECTION_IDS.activity}
      index={index}
      title={d.github.title}
      meta={
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-accent"
        >
          @{github.login} · {d.github.meta}
          <ArrowUpRight className="size-3" aria-hidden />
        </a>
      }
      bodyClassName="grid grid-cols-1 gap-8 p-4 sm:p-6 lg:grid-cols-[220px_1fr] lg:gap-10"
    >
      <dl className="grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-5">
        {stats.map((s) => (
          <Readout key={s.label} value={s.value} label={s.label} accent={s.accent} />
        ))}
      </dl>
      <div className="min-w-0">
        <div className="overflow-x-auto pb-2 [direction:rtl]">
          <div className="[direction:ltr] w-max">
            <Heatmap github={github} locale={locale} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-subtle">
          {d.github.less}
          {LEVEL_FILL.map((fill) => (
            <span key={fill} className="inline-block size-2.5 rounded-[2px]" style={{ background: fill }} />
          ))}
          {d.github.more}
        </div>
      </div>
    </Panel>
  );
}
