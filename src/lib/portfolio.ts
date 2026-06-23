import { Boxes, type LucideIcon } from "lucide-react";

/**
 * Carrega o conteúdo do portfolio da API pública do Proposa
 * (NEXT_PUBLIC_PORTFOLIO_API = URL completa, incluindo o slug).
 * Se a variável não estiver definida, a resposta falhar, ou uma seção vier
 * vazia, o site mantém o conteúdo padrão embutido (`page.tsx`) — nunca quebra.
 */

// ─── Tipos consumidos pelos componentes do portfolio ───────────────────────

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  techs: string[];
}

export interface ProjectRepo {
  name: string;
  url: string;
}

export type ProjectVisual = "mobile" | "backend" | "automation";

export interface Project {
  title: string;
  desc: string;
  tags: string[];
  gradient: string;
  visualType: ProjectVisual;
  customLabel?: string;
  image?: string;
  /** `true` p/ imagem do tipo "card" (preview OG do GitHub) → object-contain. */
  imageContain?: boolean;
  repos?: ProjectRepo[];
  stats: Array<{ value: string; label: string }>;
}

export interface Skill {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
}

export interface PortfolioData {
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
}

// ─── Shapes da API pública (get_public_portfolio) ──────────────────────────

interface ApiExperience {
  company: string;
  role: string;
  periodLabel: string | null;
  description: string | null;
  achievements: string[];
  stack: string[];
}

interface ApiProject {
  name: string;
  summary: string | null;
  stack: string[];
  repoUrl: string | null;
  homepageUrl: string | null;
  isPrivate: boolean;
  isHighlighted: boolean;
  year: number | null;
  role: string | null;
  imageUrl: string | null;
  githubStars: number | null;
}

interface ApiSkillGroup {
  title: string;
  description: string | null;
  tags: string[];
}

interface ApiPortfolio {
  profile: { skillGroups?: ApiSkillGroup[] } | null;
  experiences?: ApiExperience[];
  projects?: ApiProject[];
}

// ─── Mapeamento API → componentes ──────────────────────────────────────────

const GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-purple-600 to-fuchsia-600",
  "from-yellow-500 to-orange-600",
];

function pickVisual(stack: string[]): ProjectVisual {
  const s = stack.map((t) => t.toLowerCase());
  if (
    s.some((t) =>
      ["react native", "expo", "flutter", "swift", "kotlin", "android", "ios", "mobile"].includes(t),
    )
  ) {
    return "mobile";
  }
  if (
    s.some((t) =>
      ["n8n", "automation", "rpa", "langchain", "ai agent", "openai", "llm"].some((k) =>
        t.includes(k),
      ),
    )
  ) {
    return "automation";
  }
  return "backend";
}

/** Imagem social (OpenGraph) do repo público no GitHub — preview único por repo. */
function ghOgImage(repoUrl: string | null): string | undefined {
  if (!repoUrl) return undefined;
  try {
    const u = new URL(repoUrl);
    if (u.hostname !== "github.com") return undefined;
    const [owner, repo] = u.pathname.replace(/^\/+/, "").split("/");
    if (!owner || !repo) return undefined;
    return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  } catch {
    return undefined;
  }
}

function mapExperience(e: ApiExperience): Experience {
  return {
    company: e.company,
    role: e.role,
    period: e.periodLabel ?? "",
    description: e.description ?? "",
    achievements: e.achievements ?? [],
    techs: e.stack ?? [],
  };
}

function mapProject(p: ApiProject, i: number): Project {
  const repos: ProjectRepo[] = [];
  if (p.repoUrl) repos.push({ name: "Repositório", url: p.repoUrl });
  if (p.homepageUrl) repos.push({ name: "Demo", url: p.homepageUrl });
  const customLabel =
    [p.role, p.year ? String(p.year) : null].filter(Boolean).join(" • ") || undefined;
  // Imagem manual tem prioridade; senão, preview OG do repo público (único por repo).
  const ogImage = ghOgImage(p.repoUrl);
  const image = p.imageUrl ?? ogImage;
  return {
    title: p.name,
    desc: p.summary ?? "",
    tags: p.stack ?? [],
    gradient: GRADIENTS[i % GRADIENTS.length],
    visualType: pickVisual(p.stack ?? []),
    customLabel,
    image: image ?? undefined,
    imageContain: !p.imageUrl && Boolean(ogImage), // card OG → contain (não cortar)
    repos: repos.length ? repos : undefined,
    stats: p.githubStars != null ? [{ value: `★ ${p.githubStars}`, label: "GitHub" }] : [],
  };
}

function mapSkillGroup(g: ApiSkillGroup): Skill {
  return { icon: Boxes, title: g.title, desc: g.description ?? "", tags: g.tags ?? [] };
}

/**
 * Busca e mapeia o portfolio. Retorna `null` quando não há API configurada ou a
 * chamada falha (o chamador então mantém o conteúdo padrão). Seções vazias na
 * resposta voltam como `undefined` p/ o componente cair no default embutido.
 */
export async function loadPortfolio(): Promise<Partial<PortfolioData> | null> {
  try {
    // Mesma origem: a rota /api/portfolio busca o Proposa no servidor (sem CORS,
    // segue o redirect apex→www). A URL upstream fica em PORTFOLIO_API (server).
    const res = await fetch("/api/portfolio", { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.warn(`[portfolio] /api/portfolio respondeu ${res.status} — usando conteúdo padrão.`);
      return null;
    }
    const data = (await res.json()) as ApiPortfolio;
    const experiences = (data.experiences ?? []).map(mapExperience);
    const projects = (data.projects ?? []).map(mapProject);
    const skills = (data.profile?.skillGroups ?? []).map(mapSkillGroup);
    if (!experiences.length && !projects.length && !skills.length) {
      console.warn(
        `[portfolio] /api/portfolio veio vazio — PORTFOLIO_API setada? portfolio publicado e com itens publicados?`,
      );
    } else {
      console.info(
        `[portfolio] API OK: ${experiences.length} exp · ${projects.length} proj · ${skills.length} skills`,
      );
    }
    return {
      experiences: experiences.length ? experiences : undefined,
      projects: projects.length ? projects : undefined,
      skills: skills.length ? skills : undefined,
    };
  } catch (e) {
    console.warn(`[portfolio] Falha ao buscar /api/portfolio — usando conteúdo padrão.`, e);
    return null;
  }
}
