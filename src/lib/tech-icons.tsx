import {
  siAndroid,
  siClaude,
  siCloudflare,
  siDocker,
  siElectron,
  siGooglegemini,
  siGrafana,
  siLivekit,
  siOpenjdk,
  siOpentelemetry,
  siPrisma,
  siSocketdotio,
  siTanstack,
  siTurborepo,
  siWebrtc,
  siExpo,
  siGit,
  siGithub,
  siJavascript,
  siJira,
  siKotlin,
  siMysql,
  siN8n,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";
import {
  Boxes,
  Braces,
  CalendarDays,
  Code2,
  Database,
  FileSignature,
  Globe,
  HardDrive,
  Network,
  Server,
  ShoppingBag,
  Smartphone,
  Sparkles,
  User,
  Users,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ArchNode } from "@/content";

// Ícone + cor de cada tecnologia, resolvido pelo nome (server-only: os paths
// vão direto no HTML, nada disso chega ao bundle do cliente).

type Resolved = { color: string } & ({ brand: SimpleIcon } | { glyph: LucideIcon });

const FG = "#e6ebe8";
const ACCENT = "#3ddc84";

/** Marcas com cor muito escura (Next.js, Vercel…) ficam claras no fundo escuro. */
function brandColor(icon: SimpleIcon): string {
  const n = parseInt(icon.hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.3 ? FG : `#${icon.hex}`;
}

const brand = (icon: SimpleIcon): Resolved => ({ brand: icon, color: brandColor(icon) });
const glyph = (icon: LucideIcon, color = FG): Resolved => ({ glyph: icon, color });

// Ordem importa: o primeiro padrão que casar vence.
const RULES: [RegExp, Resolved][] = [
  [/electron/, brand(siElectron)],
  [/claude|anthropic/, brand(siClaude)],
  [/gemini/, brand(siGooglegemini)],
  [/prisma/, brand(siPrisma)],
  [/socket\.?io/, brand(siSocketdotio)],
  [/livekit/, brand(siLivekit)],
  [/webrtc/, brand(siWebrtc)],
  [/tanstack/, brand(siTanstack)],
  [/turbo ?repo/, brand(siTurborepo)],
  [/grafana/, brand(siGrafana)],
  [/opentelemetry|otel/, brand(siOpentelemetry)],
  [/cloudflare|\br2\b/, brand(siCloudflare)],
  [/\bjava\b/, brand(siOpenjdk)],
  [/bullmq|fila|queue/, glyph(Workflow, "#5ec8f2")],
  [/xterm|terminal|cli\b|pty/, glyph(Code2)],
  [/expo/, brand(siExpo)],
  [/next/, brand(siNextdotjs)],
  [/nest/, brand(siNestjs)],
  [/postgres|^pg$/, brand(siPostgresql)],
  [/n8n/, brand(siN8n)],
  [/redis/, brand(siRedis)],
  [/supabase/, brand(siSupabase)],
  [/react/, brand(siReact)],
  [/typescript|^ts$/, brand(siTypescript)],
  [/javascript/, brand(siJavascript)],
  [/tailwind/, brand(siTailwindcss)],
  [/docker/, brand(siDocker)],
  [/python/, brand(siPython)],
  [/node/, brand(siNodedotjs)],
  [/jira|scrum/, brand(siJira)],
  [/android/, brand(siAndroid)],
  [/kotlin/, brand(siKotlin)],
  [/mysql/, brand(siMysql)],
  [/github/, brand(siGithub)],
  [/\bgit\b/, brand(siGit)],
  [/vercel/, brand(siVercel)],
  [/whatsapp/, brand(siWhatsapp)],
  [/mercado ?livre/, glyph(ShoppingBag, "#ffe600")],
  [/llm|openai|gpt|\bia\b|\bai\b|agent|preditiv|langchain/, glyph(Sparkles, ACCENT)],
  [/vs ?code|extens/, glyph(Code2, "#3ea7f0")],
  [/\bast\b|parser/, glyph(Braces, "#c792ea")],
  [/agenda|calend/, glyph(CalendarDays)],
  [/contrat/, glyph(FileSignature)],
  [/times|equipe|team/, glyph(Users)],
  [/lead|usu[aá]rio|user|cliente/, glyph(User)],
  [/mobile|app/, glyph(Smartphone)],
  [/^web$|browser/, glyph(Globe)],
  [/armazenamento|storage/, glyph(HardDrive)],
  [/webhook/, glyph(Webhook)],
  [/zustand|state/, glyph(Boxes, "#d9a05b")],
  [/rest|api/, glyph(Network)],
  [/\bqa\b|dogfood/, glyph(Braces)],
];

const BY_KIND: Record<ArchNode["kind"], Resolved> = {
  client: glyph(User),
  service: glyph(Server),
  db: glyph(Database, "#ffb547"),
  queue: glyph(Workflow, "#5ec8f2"),
  ai: glyph(Sparkles, ACCENT),
  external: glyph(Globe),
};

export function resolveTech(name: string, kind?: ArchNode["kind"]): Resolved | null {
  const key = name.toLowerCase();
  for (const [pattern, icon] of RULES) if (pattern.test(key)) return icon;
  return kind ? BY_KIND[kind] : null;
}

/** Ícone para usar dentro de um <svg> (diagramas). */
export function SvgTechIcon({
  name,
  kind,
  x,
  y,
  size,
}: {
  name: string;
  kind?: ArchNode["kind"];
  x: number;
  y: number;
  size: number;
}) {
  const icon = resolveTech(name, kind);
  if (!icon) return null;
  if ("brand" in icon) {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d={icon.brand.path} fill={icon.color} />
      </svg>
    );
  }
  const Glyph = icon.glyph;
  return <Glyph x={x} y={y} width={size} height={size} color={icon.color} strokeWidth={1.75} aria-hidden />;
}

/** Ícone inline para HTML (chips de stack). */
export function TechIcon({ name, className = "size-3.5" }: { name: string; className?: string }) {
  const icon = resolveTech(name);
  if (!icon) return null;
  if ("brand" in icon) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden>
        <path d={icon.brand.path} fill={icon.color} />
      </svg>
    );
  }
  const Glyph = icon.glyph;
  return <Glyph className={`shrink-0 ${className}`} color={icon.color} strokeWidth={1.75} aria-hidden />;
}

export function techColor(name: string, kind?: ArchNode["kind"]): string {
  return resolveTech(name, kind)?.color ?? FG;
}
