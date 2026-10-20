import { z } from "zod";

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Texto nos dois idiomas. Campo vazio ou começando com "TODO" não aparece no site. */
export const localized = z.object({
  pt: z.string(),
  en: z.string(),
});
export type Localized = z.infer<typeof localized>;

const localizedList = z.array(localized);

// ─── URLs seguras ───────────────────────────────────────────────────────────
// Tudo que vira href/src no site passa por aqui: bloqueia javascript:, data:,
// URLs protocol-relative (//host) e path traversal. Vazio = campo não usado.

const isLocalPath = (v: string) => /^\/(?!\/)[\w\-./]*$/.test(v) && !v.includes("..");

/** https://, http://, mailto: ou caminho local (/…). */
export const safeUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/[^\s"'<>]+$/i.test(v) || /^mailto:[^\s"'<>]+$/i.test(v) || isLocalPath(v), {
    message: "use uma URL https://, mailto: ou um caminho que comece com /",
  });

/** Arquivo servido pelo próprio site (imagens, CV). */
export const localPath = z
  .string()
  .trim()
  .refine((v) => v === "" || isLocalPath(v), { message: "use um caminho local que comece com /" });

const email = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("TODO") || /^[^\s@<>"'?&]+@[^\s@<>"'?&]+\.[^\s@<>"'?&]+$/.test(v), {
    message: "e-mail inválido",
  });

const link = z.object({
  label: localized,
  url: safeUrl,
});

const metric = z.object({
  value: z.string(),
  label: localized,
});

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  role: localized,
  headline: localized,
  subheadline: localized,
  availability: localized,
  location: localized,
  email,
  links: z.object({
    github: safeUrl,
    linkedin: safeUrl,
    whatsapp: safeUrl,
  }),
  cv: z.object({ pt: localPath, en: localPath }),
  photo: z.object({ src: localPath, alt: localized }).default({ src: "", alt: { pt: "", en: "" } }),
  stats: z.array(metric),
  about: localizedList,
});

export const NODE_KINDS = ["client", "service", "db", "queue", "ai", "external"] as const;

export const architectureSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      kind: z.enum(NODE_KINDS),
      /** Posição na grade do diagrama (coluna = etapa do fluxo). */
      col: z.number().int().min(0),
      row: z.number().int().min(0),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string().min(1),
      to: z.string().min(1),
      label: z.string().optional(),
    }),
  ),
});

export const PROJECT_STATUS = ["production", "side", "archived"] as const;

/** "case" aparece em Sistemas; "lab" vai para o bloco de experimentos. */
export const PROJECT_KINDS = ["case", "lab"] as const;

const highlight = z.object({
  title: localized,
  description: localized,
});

const milestone = z.object({
  date: z.string(),
  label: localized,
});

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "use apenas letras minúsculas, números e hífen"),
  title: z.string().min(1),
  category: localized,
  year: z.string(),
  tagline: localized,
  problem: localized,
  solution: localized,
  role: localized,
  results: localizedList,
  metrics: z.array(metric),
  stack: z.array(z.string()),
  images: z.array(z.object({ src: localPath, alt: localized, caption: localized.optional() })),
  links: z.array(link),
  featured: z.boolean(),
  confidential: z.boolean(),
  status: z.enum(PROJECT_STATUS).default("side"),
  kind: z.enum(PROJECT_KINDS).default("case"),
  /** Empresa/cliente, período e time — uma linha no topo do case. */
  context: localized.default({ pt: "", en: "" }),
  highlights: z.array(highlight).default([]),
  decisions: localizedList.default([]),
  timeline: z.array(milestone).default([]),
  /** Imagem do card na home; vazio = sem capa. */
  cover: localPath.default(""),
  architecture: architectureSchema.default({ nodes: [], edges: [] }),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: localized,
  start: z.string(),
  end: localized,
  summary: localized,
  achievements: localizedList,
  stack: z.array(z.string()),
});

export const skillGroupSchema = z.object({
  title: localized,
  items: z.array(
    z.object({
      name: z.string().min(1),
      context: localized,
    }),
  ),
});

export const principleSchema = z.object({
  title: localized,
  description: localized,
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  course: localized,
  period: z.string(),
});

export const contentSchema = z.object({
  profile: profileSchema,
  projects: z.array(projectSchema),
  experiences: z.array(experienceSchema),
  skillGroups: z.array(skillGroupSchema),
  routine: localizedList,
  principles: z.array(principleSchema),
  education: z.array(educationSchema),
  seo: z.object({
    siteUrl: z.string(),
    title: localized,
    description: localized,
  }),
});

export type Content = z.infer<typeof contentSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Principle = z.infer<typeof principleSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Metric = z.infer<typeof metric>;
export type Architecture = z.infer<typeof architectureSchema>;
export type ArchNode = Architecture["nodes"][number];
export type ArchEdge = Architecture["edges"][number];
export type ProjectStatus = (typeof PROJECT_STATUS)[number];
export type ProjectKind = (typeof PROJECT_KINDS)[number];
export type Highlight = z.infer<typeof highlight>;
