import type { ArchNode, Architecture } from "@/content";
import { SvgTechIcon, techColor } from "@/lib/tech-icons";

// Diagrama de arquitetura em SVG puro (server component). Os pacotes andam
// pelas arestas com <animateMotion>; o InViewPauser pausa o SVG fora da tela e
// o CSS esconde os pacotes com prefers-reduced-motion.

const NODE_W = 176;
const NODE_H = 54;
const CELL_W = 232;
const CELL_H = 80;
const PAD = 18;
const ICON_BOX = 34;

const KIND_LABEL: Record<ArchNode["kind"], string> = {
  client: "client",
  service: "service",
  db: "data",
  queue: "workflow",
  ai: "ai",
  external: "external",
};

const KIND_COLOR: Record<ArchNode["kind"], string> = {
  client: "var(--color-muted)",
  service: "var(--color-fg)",
  db: "var(--color-amber)",
  queue: "var(--color-flow)",
  ai: "var(--color-accent)",
  external: "var(--color-muted)",
};

function position(node: ArchNode) {
  return { x: PAD + node.col * CELL_W, y: PAD + node.row * CELL_H };
}

/** Caminho da aresta + ponto de chegada (para posicionar o rótulo). */
function edgeGeometry(a: ArchNode, b: ArchNode) {
  const pa = position(a);
  const pb = position(b);
  if (b.col !== a.col) {
    const forward = b.col > a.col;
    const x1 = forward ? pa.x + NODE_W : pa.x;
    const x2 = forward ? pb.x : pb.x + NODE_W;
    const y1 = pa.y + NODE_H / 2;
    const y2 = pb.y + NODE_H / 2;
    const mid = (x1 + x2) / 2;
    return { d: `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`, end: { x: x2, y: y2 }, forward };
  }
  const down = b.row > a.row;
  const x = pa.x + NODE_W / 2;
  const y1 = down ? pa.y + NODE_H : pa.y;
  const y2 = down ? pb.y : pb.y + NODE_H;
  return { d: `M${x},${y1} L${x},${y2}`, end: { x, y: y2 }, forward: true };
}

export function ArchitectureDiagram({
  architecture,
  title,
  idPrefix,
  className = "",
}: {
  architecture: Architecture;
  title: string;
  /** Prefixo único na página para os ids das arestas. */
  idPrefix: string;
  className?: string;
}) {
  const { nodes, edges } = architecture;
  if (nodes.length === 0) return null;

  const edgeId = (i: number) => `${idPrefix}-edge-${i}`;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const width = PAD * 2 + (cols - 1) * CELL_W + NODE_W;
  const height = PAD * 2 + (rows - 1) * CELL_H + NODE_H;

  const validEdges = edges.flatMap((e, i) => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    return a && b ? [{ ...e, i, a, b, ...edgeGeometry(a, b) }] : [];
  });

  const description = validEdges.map((e) => `${e.a.label} → ${e.b.label}`).join(", ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${title}: ${description}`}
      data-motion
      className={`h-auto w-full font-mono ${className}`}
      style={{ maxWidth: width * 1.1 }}
    >
      <title>{title}</title>
      <defs>
        <pattern id={`${idPrefix}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="var(--color-line-strong)" />
        </pattern>
        <filter id={`${idPrefix}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width={width} height={height} fill={`url(#${idPrefix}-dots)`} opacity={0.6} />

      <g fill="none" strokeWidth={1.25}>
        {validEdges.map((e) => (
          <path key={e.i} id={edgeId(e.i)} d={e.d} stroke="var(--color-line-strong)" />
        ))}
      </g>

      {validEdges.map((e) => {
        const color = KIND_COLOR[e.b.kind];
        const dur = 2.4 + (e.i % 3) * 0.45;
        const begin = `${((e.i * 0.53) % 2).toFixed(2)}s`;
        return (
          <g key={`p${e.i}`} className="packet" opacity={0}>
            <circle r={7} fill={color} opacity={0.18} />
            <circle r={2.8} fill={color} />
            <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite">
              <mpath href={`#${edgeId(e.i)}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.12;0.88;1"
              dur={`${dur}s`}
              begin={begin}
              repeatCount="indefinite"
            />
          </g>
        );
      })}

      {/* Rótulos junto da chegada de cada aresta: arestas que saem do mesmo nó não colidem. */}
      {validEdges.map((e) => {
        if (!e.label) return null;
        const w = e.label.length * 5.6 + 10;
        const x = e.forward ? e.end.x - w - 8 : e.end.x + 8;
        return (
          <g key={`l${e.i}`} transform={`translate(${x},${e.end.y - 18})`}>
            <rect width={w} height={13} rx={2} fill="var(--color-bg)" stroke="var(--color-line)" />
            <text x={w / 2} y={9.5} textAnchor="middle" fontSize={8.5} fill="var(--color-muted)">
              {e.label}
            </text>
          </g>
        );
      })}

      {nodes.map((node) => {
        const { x, y } = position(node);
        const kindColor = KIND_COLOR[node.kind];
        const iconColor = techColor(node.label, node.kind);
        const iconY = (NODE_H - ICON_BOX) / 2;
        return (
          <g key={node.id} transform={`translate(${x},${y})`}>
            {node.kind === "ai" && (
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill="var(--color-accent)"
                opacity={0.22}
                filter={`url(#${idPrefix}-glow)`}
              />
            )}
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill="var(--color-panel)"
              stroke={kindColor}
              strokeOpacity={node.kind === "client" || node.kind === "external" ? 0.35 : 0.55}
              strokeDasharray={node.kind === "external" ? "4 3" : undefined}
            />
            <rect
              x={9}
              y={iconY}
              width={ICON_BOX}
              height={ICON_BOX}
              rx={5}
              fill={iconColor}
              fillOpacity={0.1}
              stroke={iconColor}
              strokeOpacity={0.25}
            />
            <SvgTechIcon name={node.label} kind={node.kind} x={9 + 8} y={iconY + 8} size={18} />
            <text x={53} y={22} fontSize={8} letterSpacing={1.4} fill={kindColor} opacity={0.85}>
              {KIND_LABEL[node.kind].toUpperCase()}
            </text>
            <text x={53} y={39} fontSize={node.label.length > 16 ? 11.5 : 12.5} fill="var(--color-fg)" className="font-sans" fontWeight={500}>
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
