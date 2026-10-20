import { getContent, t, visibleMetrics, type Locale, type Project } from "@/content";
import { getDictionary, projectPath } from "@/content/dictionary";
import { SvgTechIcon, resolveTech, techColor } from "@/lib/tech-icons";

// Mapa do hero: você no centro, as tecnologias que mais usa num anel interno e
// os sistemas em volta, ligados às tecnologias que realmente usam. Pacotes
// trafegam das tecnologias para os sistemas. Passar o mouse num sistema
// destaca suas ligações.

const W = 660;
const H = 440;
const CX = W / 2;
const CY = H / 2;
const SYS_RX = 238;
const SYS_RY = 166;
const TECH_RX = 132;
const TECH_RY = 88;
const CARD_W = 196;
const CARD_H = 78;
const CORE_R = 44;
const MAX_TECH = 6;

const STATUS_COLOR = {
  production: "var(--color-accent)",
  side: "var(--color-amber)",
  archived: "var(--color-subtle)",
} as const;

function ellipsePoint(i: number, n: number, rx: number, ry: number, offset: number) {
  const angle = -Math.PI / 2 + offset + (i * 2 * Math.PI) / n;
  return { x: CX + rx * Math.cos(angle), y: CY + ry * Math.sin(angle) };
}

/** Tecnologias mais citadas nas stacks dos sistemas (empate: ordem de aparição). */
function topTechs(systems: Project[]) {
  const counts = new Map<string, number>();
  for (const p of systems) for (const s of p.stack) counts.set(s, (counts.get(s) ?? 0) + 1);
  // Mais usadas primeiro; no empate, as que têm logo de marca (mais reconhecíveis).
  const hasBrand = (name: string) => Boolean(resolveTech(name) && "brand" in resolveTech(name)!);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || Number(hasBrand(b[0])) - Number(hasBrand(a[0])))
    .slice(0, MAX_TECH)
    .map(([name]) => name);
}

const chipWidth = (name: string) => 30 + name.length * 6.1;

export function SystemMap({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const { profile, projects } = getContent();
  const systems = projects.filter((p) => p.status !== "archived").slice(0, 4);
  if (systems.length === 0) return null;

  const initials = profile.shortName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const techs = topTechs(systems).map((name, i, all) => ({
    name,
    ...ellipsePoint(i, all.length, TECH_RX, TECH_RY, 0),
    color: techColor(name),
  }));
  const techByName = new Map(techs.map((tch) => [tch.name, tch]));

  const cards = systems.map((p, i) => {
    const c = ellipsePoint(i, systems.length, SYS_RX, SYS_RY, Math.PI / systems.length);
    const x = c.x - CARD_W / 2;
    const y = c.y - CARD_H / 2;
    // Canto do card mais próximo do centro: é dali que saem as ligações.
    const ax = c.x < CX ? x + CARD_W : x;
    const ay = c.y < CY ? y + CARD_H : y;
    const linked = p.stack.map((s) => techByName.get(s)).filter((tch) => tch !== undefined);
    return { p, i, x, y, ax, ay, linked, metric: visibleMetrics(p.metrics, locale)[0] };
  });

  const edgeId = (i: number, j: number) => `map-${i}-${j}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="group"
      aria-label={d.hero.mapLabel}
      data-motion
      className="h-auto w-full font-mono"
    >
      <defs>
        <radialGradient id="map-core-glow">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <pattern id="map-dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="var(--color-line-strong)" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="url(#map-dots)" opacity={0.5} />
      <ellipse cx={CX} cy={CY} rx={TECH_RX} ry={TECH_RY} fill="none" stroke="var(--color-line)" strokeDasharray="2 5" />
      <circle cx={CX} cy={CY} r={150} fill="url(#map-core-glow)" />

      {/* Núcleo ↔ tecnologias */}
      {techs.map((tch) => (
        <line
          key={`core-${tch.name}`}
          x1={CX}
          y1={CY}
          x2={tch.x}
          y2={tch.y}
          stroke="var(--color-accent-dim)"
          strokeOpacity={0.6}
          strokeDasharray="1 4"
        />
      ))}

      {/* Sistemas: ligações + card dentro do mesmo link, para o hover destacar tudo junto. */}
      {cards.map(({ p, i, x, y, ax, ay, linked, metric }) => (
        <a key={p.slug} href={projectPath(locale, p.slug)} className="group outline-none">
          <title>{`${p.title} — ${t(p.tagline, locale)}`}</title>
          {(linked.length > 0 ? linked : [{ name: "core", x: CX, y: CY, color: "var(--color-accent)" }]).map(
            (tch, j) => {
              const path = `M${tch.x.toFixed(1)},${tch.y.toFixed(1)} L${ax.toFixed(1)},${ay.toFixed(1)}`;
              const dur = 2.2 + ((i + j) % 3) * 0.5;
              const begin = `${((i * 0.6 + j * 0.9) % 2.4).toFixed(2)}s`;
              return (
                <g key={tch.name}>
                  <path
                    id={edgeId(i, j)}
                    d={path}
                    fill="none"
                    stroke="var(--color-line-strong)"
                    className="transition-[stroke] duration-300 group-hover:stroke-[var(--color-accent)] group-focus-visible:stroke-[var(--color-accent)]"
                  />
                  <g className="packet" opacity={0}>
                    <circle r={6} fill={tch.color} opacity={0.2} />
                    <circle r={2.4} fill={tch.color} />
                    <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite">
                      <mpath href={`#${edgeId(i, j)}`} />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.15;0.85;1"
                      dur={`${dur}s`}
                      begin={begin}
                      repeatCount="indefinite"
                    />
                  </g>
                </g>
              );
            },
          )}

          <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
            <rect
              width={CARD_W}
              height={CARD_H}
              rx={6}
              fill="var(--color-panel)"
              stroke="var(--color-line-strong)"
              className="transition-[stroke] duration-300 group-hover:stroke-[var(--color-accent)] group-focus-visible:stroke-[var(--color-accent)]"
            />
            <circle cx={14} cy={16} r={2.8} fill={STATUS_COLOR[p.status]} className="led-live" />
            <text x={23} y={19} fontSize={8.5} letterSpacing={1.4} fill={STATUS_COLOR[p.status]}>
              {d.systems.status[p.status]}
            </text>
            <text x={CARD_W - 12} y={19} textAnchor="end" fontSize={8.5} fill="var(--color-subtle)">
              {String(i + 1).padStart(2, "0")}
            </text>
            <text
              x={12}
              y={41}
              fontSize={14.5}
              fontWeight={600}
              fill="var(--color-fg)"
              className="font-sans transition-[fill] group-hover:fill-[var(--color-accent)]"
            >
              {p.title}
            </text>
            {p.stack.slice(0, 4).map((s, k) => (
              <SvgTechIcon key={s} name={s} x={12 + k * 21} y={52} size={14} />
            ))}
            {metric && (
              <text x={CARD_W - 12} y={63} textAnchor="end" fontSize={11} fill="var(--color-accent)">
                {metric.value}
              </text>
            )}
          </g>
        </a>
      ))}

      {/* Anel de tecnologias */}
      {techs.map((tch) => {
        const w = chipWidth(tch.name);
        return (
          <g key={tch.name} transform={`translate(${(tch.x - w / 2).toFixed(1)},${(tch.y - 12).toFixed(1)})`}>
            <rect width={w} height={24} rx={12} fill="var(--color-bg)" stroke={tch.color} strokeOpacity={0.45} />
            <SvgTechIcon name={tch.name} x={8} y={5} size={14} />
            <text x={27} y={16} fontSize={10} fill="var(--color-fg)">
              {tch.name}
            </text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={CORE_R + 12} fill="none" stroke="var(--color-accent-dim)" strokeDasharray="1 7" className="spin-slow" />
      <circle cx={CX} cy={CY} r={CORE_R} fill="var(--color-panel)" stroke="var(--color-accent)" />
      <text x={CX} y={CY + 3} textAnchor="middle" fontSize={21} fontWeight={600} fill="var(--color-fg)" className="font-sans">
        {initials}
      </text>
      <text x={CX} y={CY + 18} textAnchor="middle" fontSize={7.5} letterSpacing={1.6} fill="var(--color-accent)">
        ONLINE
      </text>
    </svg>
  );
}
