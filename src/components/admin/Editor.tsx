"use client";

import { ExternalLink, FileUp, ImagePlus, LogOut, Save } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  NODE_KINDS,
  PROJECT_STATUS,
  contentSchema,
  type Content,
  type Localized,
  type ArchEdge,
  type ArchNode,
  type Project,
} from "@/content/schema";
import type { StoreMode, Upload } from "@/lib/content-store";
import { logout, save } from "@/app/(admin)/admin/actions";
import {
  ArrayField,
  Checkbox,
  Fieldset,
  Label,
  LocalizedField,
  LocalizedListField,
  NumberField,
  SelectField,
  TagsField,
  TextField,
} from "./fields";

const empty = (): Localized => ({ pt: "", en: "" });

const TABS = [
  ["profile", "Perfil"],
  ["projects", "Projetos"],
  ["experience", "Experiência"],
  ["skills", "Competências"],
  ["daily", "Dia a dia"],
  ["other", "Formação e SEO"],
  ["json", "JSON"],
] as const;
type Tab = (typeof TABS)[number][0];

type PendingUpload = Upload & { preview: string };

/** Conta strings vazias obrigatórias ou "TODO…" para mostrar o que falta preencher. */
function countTodos(value: unknown): number {
  if (typeof value === "string") return value.trim().startsWith("TODO") ? 1 : 0;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countTodos(v), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((n: number, v) => n + countTodos(v), 0);
  return 0;
}

/** Converte imagem para WebP (máx. 1600px de largura) no navegador. */
async function toWebp(file: File): Promise<{ base64: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const preview = canvas.toDataURL("image/webp", 0.85);
  return { base64: preview.split(",")[1], preview };
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buffer.length; i += 0x8000) {
    binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export function Editor({
  initialContent,
  initialSha,
  mode,
}: {
  initialContent: Content;
  initialSha: string;
  mode: StoreMode;
}) {
  const [content, setContent] = useState(initialContent);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialContent));
  const [sha, setSha] = useState(initialSha);
  const [tab, setTab] = useState<Tab>("profile");
  const [uploads, setUploads] = useState<PendingUpload[]>([]);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, startSaving] = useTransition();

  const dirty = uploads.length > 0 || JSON.stringify(content) !== savedJson;
  const todos = useMemo(() => countTodos(content), [content]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(fn: (draft: Content) => void) {
    setContent((current) => {
      const draft = structuredClone(current);
      fn(draft);
      return draft;
    });
  }

  function addUpload(upload: PendingUpload) {
    setUploads((list) => [...list.filter((u) => u.path !== upload.path), upload]);
  }

  const previewFor = (src: string) => uploads.find((u) => `/${u.path}` === src)?.preview ?? src;

  function onSave() {
    const parsed = contentSchema.safeParse(content);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setStatus({ kind: "error", text: `Campo inválido em ${issue.path.join(".")}: ${issue.message}` });
      return;
    }
    setStatus(null);
    startSaving(async () => {
      const result = await save({
        content: parsed.data,
        sha,
        uploads: uploads.map(({ path, base64 }) => ({ path, base64 })),
      });
      if (!result.ok) {
        setStatus({ kind: "error", text: result.error });
        return;
      }
      setSha(result.sha);
      setSavedJson(JSON.stringify(parsed.data));
      setUploads([]);
      setStatus({
        kind: "ok",
        text:
          result.mode === "github"
            ? "Publicado! O commit foi feito e o site atualiza em ~1 minuto, quando o deploy terminar."
            : "Salvo em content/portfolio.json. Recarregue o site para ver.",
      });
    });
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="font-display text-2xl tracking-tight">Admin</h1>
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
            {mode === "github" ? "GitHub" : mode === "fs" ? "arquivo local" : "somente leitura"}
          </span>
          {todos > 0 && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
              {todos} campo(s) com TODO
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted hover:text-fg"
            >
              Ver site <ExternalLink className="size-3.5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={onSave}
              disabled={!dirty || saving || mode === "readonly"}
              className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-1.5 text-sm font-medium text-bg disabled:opacity-40"
            >
              <Save className="size-4" aria-hidden />
              {saving ? "Salvando…" : mode === "github" ? "Publicar" : "Salvar"}
            </button>
            <form action={logout}>
              <button type="submit" aria-label="Sair" className="grid size-8 place-items-center rounded-full text-muted hover:bg-line hover:text-fg">
                <LogOut className="size-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key}
              className={`shrink-0 rounded-full px-3 py-1 text-sm ${tab === key ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {status && (
          <p
            role="status"
            className={`rounded-lg px-4 py-3 text-sm ${status.kind === "ok" ? "bg-accent/10 text-fg" : "bg-red-500/10 text-red-300"}`}
          >
            {status.text}
          </p>
        )}
        {mode === "readonly" && (
          <p className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm">
            Configure <code>GITHUB_TOKEN</code> e <code>GITHUB_REPO</code> na Vercel para publicar pelo admin.
          </p>
        )}
        <p className="text-sm text-muted">
          Campos em amarelo estão vazios ou começam com <code>TODO</code>. Eles não aparecem no site até serem
          preenchidos, então pode publicar sem medo.
        </p>

        {tab === "profile" && (
          <ProfileTab content={content} update={update} addUpload={addUpload} previewFor={previewFor} />
        )}
        {tab === "projects" && (
          <ProjectsTab content={content} update={update} addUpload={addUpload} previewFor={previewFor} />
        )}
        {tab === "experience" && <ExperienceTab content={content} update={update} />}
        {tab === "skills" && <SkillsTab content={content} update={update} />}
        {tab === "daily" && <DailyTab content={content} update={update} />}
        {tab === "other" && <OtherTab content={content} update={update} />}
        {tab === "json" && <JsonTab content={content} setContent={setContent} />}
      </main>
    </div>
  );
}

type TabProps = { content: Content; update: (fn: (draft: Content) => void) => void };

function ProfileTab({
  content,
  update,
  addUpload,
  previewFor,
}: TabProps & { addUpload: (u: PendingUpload) => void; previewFor: (src: string) => string }) {
  const p = content.profile;
  return (
    <>
      <Fieldset title="Identidade">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nome completo" value={p.name} onChange={(v) => update((d) => void (d.profile.name = v))} />
          <TextField
            label="Nome curto"
            hint="logo e títulos"
            value={p.shortName}
            onChange={(v) => update((d) => void (d.profile.shortName = v))}
          />
        </div>
        <LocalizedField label="Cargo" value={p.role} onChange={(v) => update((d) => void (d.profile.role = v))} />
        <LocalizedField
          label="Disponibilidade"
          hint="vazio esconde o selo"
          optional
          value={p.availability}
          onChange={(v) => update((d) => void (d.profile.availability = v))}
        />
        <LocalizedField
          label="Localização"
          optional
          value={p.location}
          onChange={(v) => update((d) => void (d.profile.location = v))}
        />
      </Fieldset>

      <Fieldset title="Hero">
        <LocalizedField
          label="Headline"
          hint="a frase principal; foque no valor que você entrega"
          multiline
          value={p.headline}
          onChange={(v) => update((d) => void (d.profile.headline = v))}
        />
        <LocalizedField
          label="Subtítulo"
          multiline
          value={p.subheadline}
          onChange={(v) => update((d) => void (d.profile.subheadline = v))}
        />
        <ArrayField
          label="Números em destaque"
          items={p.stats}
          onChange={(v) => update((d) => void (d.profile.stats = v))}
          create={() => ({ value: "", label: empty() })}
          title={(m) => `${m.value} ${m.label.pt}`}
          render={(m, set) => (
            <>
              <TextField label="Valor" hint="ex.: 4+, −93%, 120h" value={m.value} onChange={(v) => set((x) => void (x.value = v))} />
              <LocalizedField label="Legenda" value={m.label} onChange={(v) => set((x) => void (x.label = v))} />
            </>
          )}
        />
      </Fieldset>

      <Fieldset title="Contato e CV">
        <TextField label="E-mail" value={p.email} onChange={(v) => update((d) => void (d.profile.email = v))} />
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="GitHub" value={p.links.github} optional onChange={(v) => update((d) => void (d.profile.links.github = v))} />
          <TextField label="LinkedIn" value={p.links.linkedin} optional onChange={(v) => update((d) => void (d.profile.links.linkedin = v))} />
          <TextField
            label="WhatsApp"
            hint="https://wa.me/55…"
            value={p.links.whatsapp}
            optional
            onChange={(v) => update((d) => void (d.profile.links.whatsapp = v))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(["pt", "en"] as const).map((loc) => (
            <div key={loc}>
              <Label hint="PDF">{`CV (${loc.toUpperCase()})`}</Label>
              <div className="flex items-center gap-2">
                <input
                  value={p.cv[loc]}
                  readOnly
                  placeholder="nenhum arquivo"
                  className="w-full rounded-md border border-line bg-bg px-2.5 py-1.5 text-sm text-muted"
                />
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-line px-2.5 py-1.5 text-sm hover:border-fg">
                  <FileUp className="size-4" aria-hidden /> Enviar
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const path = `cv/rafael-degolin-cv-${loc}.pdf`;
                      addUpload({ path, base64: await fileToBase64(file), preview: "" });
                      update((d) => void (d.profile.cv[loc] = `/${path}`));
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </Fieldset>

      <Fieldset title="Foto">
        <div className="flex items-end gap-4">
          {p.photo.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewFor(p.photo.src)} alt="" className="h-28 w-[90px] rounded-md border border-line object-cover" />
          )}
          <div className="flex-1 space-y-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Arquivo" value={p.photo.src} optional onChange={(v) => update((d) => void (d.profile.photo.src = v))} />
              </div>
              <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-line px-2.5 py-1.5 text-sm hover:border-fg">
                <ImagePlus className="size-4" aria-hidden /> Enviar
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const { base64, preview } = await toWebp(file);
                    const path = `profile/foto-${Date.now().toString(36)}.webp`;
                    addUpload({ path, base64, preview });
                    update((d) => void (d.profile.photo.src = `/${path}`));
                  }}
                />
              </label>
            </div>
            <LocalizedField label="Texto alternativo" optional value={p.photo.alt} onChange={(v) => update((d) => void (d.profile.photo.alt = v))} />
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Sobre">
        <LocalizedListField
          label="Parágrafos"
          items={p.about}
          onChange={(v) => update((d) => void (d.profile.about = v))}
        />
      </Fieldset>
    </>
  );
}

function newProject(): Project {
  return {
    slug: "",
    title: "",
    category: empty(),
    year: String(new Date().getFullYear()),
    tagline: empty(),
    problem: empty(),
    solution: empty(),
    role: empty(),
    results: [],
    metrics: [],
    stack: [],
    images: [],
    links: [],
    featured: false,
    confidential: false,
    status: "side",
    architecture: { nodes: [], edges: [] },
  };
}

function ProjectsTab({
  content,
  update,
  addUpload,
  previewFor,
}: TabProps & { addUpload: (u: PendingUpload) => void; previewFor: (src: string) => string }) {
  return (
    <ArrayField
      label="Projetos (a ordem aqui é a ordem no site)"
      items={content.projects}
      onChange={(v) => update((d) => void (d.projects = v))}
      create={newProject}
      title={(p) => `${p.featured ? "★ " : ""}${p.title}${p.confidential ? " · confidencial" : ""}`}
      render={(p, set) => (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="Título" value={p.title} onChange={(v) => set((x) => void (x.title = v))} />
            <TextField label="Slug" hint="URL do case" value={p.slug} onChange={(v) => set((x) => void (x.slug = v))} />
            <TextField label="Ano" value={p.year} onChange={(v) => set((x) => void (x.year = v))} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox label="Destaque (card grande)" checked={p.featured} onChange={(v) => set((x) => void (x.featured = v))} />
            <Checkbox label="Sistema interno / confidencial" checked={p.confidential} onChange={(v) => set((x) => void (x.confidential = v))} />
          </div>
          <SelectField
            label="Status"
            value={p.status}
            options={PROJECT_STATUS.map((v) => ({ value: v, label: STATUS_LABEL[v] }))}
            onChange={(v) => set((x) => void (x.status = v))}
          />
          <LocalizedField label="Categoria" value={p.category} onChange={(v) => set((x) => void (x.category = v))} />
          <LocalizedField label="Resumo (1 frase)" multiline value={p.tagline} onChange={(v) => set((x) => void (x.tagline = v))} />
          <LocalizedField label="O problema" multiline value={p.problem} onChange={(v) => set((x) => void (x.problem = v))} />
          <LocalizedField label="O que construí" multiline value={p.solution} onChange={(v) => set((x) => void (x.solution = v))} />
          <LocalizedField label="Meu papel" multiline value={p.role} onChange={(v) => set((x) => void (x.role = v))} />
          <LocalizedListField label="Resultados" items={p.results} onChange={(v) => set((x) => void (x.results = v))} />
          <ArrayField
            label="Métricas"
            items={p.metrics}
            onChange={(v) => set((x) => void (x.metrics = v))}
            create={() => ({ value: "", label: empty() })}
            title={(m) => `${m.value} ${m.label.pt}`}
            render={(m, setM) => (
              <>
                <TextField label="Valor" value={m.value} onChange={(v) => setM((x) => void (x.value = v))} />
                <LocalizedField label="Legenda" value={m.label} onChange={(v) => setM((x) => void (x.label = v))} />
              </>
            )}
          />
          <TagsField label="Stack" value={p.stack} onChange={(v) => set((x) => void (x.stack = v))} />
          <ArchitectureEditor project={p} set={set} />
          <ArrayField
            label="Links"
            items={p.links}
            onChange={(v) => set((x) => void (x.links = v))}
            create={() => ({ label: empty(), url: "" })}
            title={(l) => l.label.pt || l.url}
            render={(l, setL) => (
              <>
                <LocalizedField label="Texto" value={l.label} onChange={(v) => setL((x) => void (x.label = v))} />
                <TextField label="URL" value={l.url} onChange={(v) => setL((x) => void (x.url = v))} />
              </>
            )}
          />
          <ArrayField
            label="Imagens (a primeira é a capa)"
            items={p.images}
            onChange={(v) => set((x) => void (x.images = v))}
            create={() => ({ src: "", alt: empty() })}
            title={(img) => img.src.split("/").pop() || "(sem arquivo)"}
            render={(img, setImg) => (
              <>
                {img.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewFor(img.src)} alt="" className="max-h-56 rounded-md border border-line" />
                )}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <TextField label="Arquivo" value={img.src} onChange={(v) => setImg((x) => void (x.src = v))} />
                  </div>
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-line px-2.5 py-1.5 text-sm hover:border-fg">
                    <ImagePlus className="size-4" aria-hidden /> Enviar
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const { base64, preview } = await toWebp(file);
                        const path = `projects/${p.slug || "projeto"}-${Date.now().toString(36)}.webp`;
                        addUpload({ path, base64, preview });
                        setImg((x) => void (x.src = `/${path}`));
                      }}
                    />
                  </label>
                </div>
                <LocalizedField label="Texto alternativo" value={img.alt} onChange={(v) => setImg((x) => void (x.alt = v))} />
              </>
            )}
          />
        </>
      )}
    />
  );
}

const STATUS_LABEL: Record<Project["status"], string> = {
  production: "Em produção (LED verde)",
  side: "Projeto pessoal / paralelo (LED âmbar)",
  archived: "Arquivado",
};

const KIND_LABEL: Record<(typeof NODE_KINDS)[number], string> = {
  client: "Cliente / usuário",
  service: "Serviço / app",
  db: "Banco / cache",
  queue: "Fluxo / fila (n8n…)",
  ai: "IA / LLM",
  external: "Externo (API de terceiros)",
};

/** Nós e arestas do diagrama. col = etapa do fluxo (esquerda → direita), row = linha. */
function ArchitectureEditor({
  project,
  set,
}: {
  project: Project;
  set: (fn: (draft: Project) => void) => void;
}) {
  const { nodes, edges } = project.architecture;
  const nodeOptions = nodes.map((n) => ({ value: n.id, label: n.label || n.id }));
  return (
    <Fieldset title="Diagrama de arquitetura">
      <p className="text-xs text-muted">
        Coluna = etapa do fluxo (0 à esquerda). Linha = posição vertical dentro da coluna. Vazio esconde o diagrama.
      </p>
      <ArrayField<ArchNode>
        label="Blocos"
        items={nodes}
        onChange={(v) => set((x) => void (x.architecture.nodes = v))}
        create={() => ({ id: `n${Date.now().toString(36)}`, label: "", kind: "service", col: 0, row: 0 })}
        title={(n) => `[${n.col},${n.row}] ${n.label}`}
        render={(n, setN) => (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Nome" value={n.label} onChange={(v) => setN((x) => void (x.label = v))} />
              <SelectField
                label="Tipo"
                value={n.kind}
                options={NODE_KINDS.map((k) => ({ value: k, label: KIND_LABEL[k] }))}
                onChange={(v) => setN((x) => void (x.kind = v))}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <TextField label="ID" hint="usado nas ligações" value={n.id} onChange={(v) => setN((x) => void (x.id = v))} />
              <NumberField label="Coluna" value={n.col} onChange={(v) => setN((x) => void (x.col = v))} />
              <NumberField label="Linha" value={n.row} onChange={(v) => setN((x) => void (x.row = v))} />
            </div>
          </>
        )}
      />
      <ArrayField<ArchEdge>
        label="Ligações"
        items={edges}
        onChange={(v) => set((x) => void (x.architecture.edges = v))}
        create={() => ({ from: nodes[0]?.id ?? "", to: nodes[1]?.id ?? "" })}
        title={(e) => {
          const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;
          return `${name(e.from)} → ${name(e.to)}${e.label ? ` (${e.label})` : ""}`;
        }}
        render={(e, setE) => (
          <div className="grid gap-4 md:grid-cols-3">
            <SelectField label="De" value={e.from} options={nodeOptions} onChange={(v) => setE((x) => void (x.from = v))} />
            <SelectField label="Para" value={e.to} options={nodeOptions} onChange={(v) => setE((x) => void (x.to = v))} />
            <TextField
              label="Rótulo"
              optional
              value={e.label ?? ""}
              onChange={(v) => setE((x) => void (x.label = v || undefined))}
            />
          </div>
        )}
      />
    </Fieldset>
  );
}

function ExperienceTab({ content, update }: TabProps) {
  return (
    <ArrayField
      label="Experiências (mais recente primeiro)"
      items={content.experiences}
      onChange={(v) => update((d) => void (d.experiences = v))}
      create={() => ({
        company: "",
        role: empty(),
        start: "",
        end: { pt: "Atual", en: "Present" },
        summary: empty(),
        achievements: [],
        stack: [],
      })}
      title={(e) => `${e.company} — ${e.role.pt}`}
      render={(e, set) => (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Empresa" value={e.company} onChange={(v) => set((x) => void (x.company = v))} />
            <TextField label="Início" hint="AAAA-MM" value={e.start} onChange={(v) => set((x) => void (x.start = v))} />
          </div>
          <LocalizedField label="Cargo" value={e.role} onChange={(v) => set((x) => void (x.role = v))} />
          <LocalizedField label="Fim" hint="ex.: Atual / Ago 2025" value={e.end} onChange={(v) => set((x) => void (x.end = v))} />
          <LocalizedField label="Resumo" multiline optional value={e.summary} onChange={(v) => set((x) => void (x.summary = v))} />
          <LocalizedListField
            label="Conquistas (verbo + resultado + número)"
            items={e.achievements}
            onChange={(v) => set((x) => void (x.achievements = v))}
          />
          <TagsField label="Stack" value={e.stack} onChange={(v) => set((x) => void (x.stack = v))} />
        </>
      )}
    />
  );
}

function SkillsTab({ content, update }: TabProps) {
  return (
    <ArrayField
      label="Grupos de competências"
      items={content.skillGroups}
      onChange={(v) => update((d) => void (d.skillGroups = v))}
      create={() => ({ title: empty(), items: [] })}
      title={(g) => g.title.pt}
      render={(g, set) => (
        <>
          <LocalizedField label="Título do grupo" value={g.title} onChange={(v) => set((x) => void (x.title = v))} />
          <ArrayField
            label="Itens"
            items={g.items}
            onChange={(v) => set((x) => void (x.items = v))}
            create={() => ({ name: "", context: empty() })}
            title={(s) => s.name}
            render={(s, setS) => (
              <>
                <TextField label="Tecnologia" value={s.name} onChange={(v) => setS((x) => void (x.name = v))} />
                <LocalizedField
                  label="Onde usei"
                  optional
                  value={s.context}
                  onChange={(v) => setS((x) => void (x.context = v))}
                />
              </>
            )}
          />
        </>
      )}
    />
  );
}

function DailyTab({ content, update }: TabProps) {
  return (
    <>
      <Fieldset title="Entregas recentes">
        <ArrayField
          label="Log (mostra as 6 mais recentes)"
          items={content.workLog}
          onChange={(v) => update((d) => void (d.workLog = v))}
          create={() => ({ date: new Date().toISOString().slice(0, 10), title: empty(), description: empty(), tags: [] })}
          title={(e) => `${e.date} · ${e.title.pt}`}
          render={(e, set) => (
            <>
              <TextField label="Data" hint="AAAA-MM-DD" value={e.date} onChange={(v) => set((x) => void (x.date = v))} />
              <LocalizedField label="O que entreguei" value={e.title} onChange={(v) => set((x) => void (x.title = v))} />
              <LocalizedField
                label="Contexto e resultado"
                multiline
                optional
                value={e.description}
                onChange={(v) => set((x) => void (x.description = v))}
              />
              <TagsField label="Tags" value={e.tags} onChange={(v) => set((x) => void (x.tags = v))} />
            </>
          )}
        />
      </Fieldset>
      <Fieldset title="Uma semana típica">
        <LocalizedListField label="Passos" items={content.routine} onChange={(v) => update((d) => void (d.routine = v))} />
      </Fieldset>
      <Fieldset title="Princípios">
        <ArrayField
          label="Princípios"
          items={content.principles}
          onChange={(v) => update((d) => void (d.principles = v))}
          create={() => ({ title: empty(), description: empty() })}
          title={(p) => p.title.pt}
          render={(p, set) => (
            <>
              <LocalizedField label="Título" value={p.title} onChange={(v) => set((x) => void (x.title = v))} />
              <LocalizedField label="Descrição" multiline value={p.description} onChange={(v) => set((x) => void (x.description = v))} />
            </>
          )}
        />
      </Fieldset>
    </>
  );
}

function OtherTab({ content, update }: TabProps) {
  return (
    <>
      <Fieldset title="Formação">
        <ArrayField
          label="Cursos"
          items={content.education}
          onChange={(v) => update((d) => void (d.education = v))}
          create={() => ({ institution: "", course: empty(), period: "" })}
          title={(e) => `${e.course.pt} — ${e.institution}`}
          render={(e, set) => (
            <>
              <TextField label="Instituição" value={e.institution} onChange={(v) => set((x) => void (x.institution = v))} />
              <LocalizedField label="Curso" value={e.course} onChange={(v) => set((x) => void (x.course = v))} />
              <TextField label="Período" hint="ex.: 2019 — 2024" value={e.period} onChange={(v) => set((x) => void (x.period = v))} />
            </>
          )}
        />
      </Fieldset>
      <Fieldset title="SEO">
        <TextField
          label="URL do site"
          value={content.seo.siteUrl}
          onChange={(v) => update((d) => void (d.seo.siteUrl = v))}
        />
        <LocalizedField label="Título" value={content.seo.title} onChange={(v) => update((d) => void (d.seo.title = v))} />
        <LocalizedField
          label="Descrição"
          hint="~155 caracteres"
          multiline
          value={content.seo.description}
          onChange={(v) => update((d) => void (d.seo.description = v))}
        />
      </Fieldset>
    </>
  );
}

function JsonTab({ content, setContent }: { content: Content; setContent: (c: Content) => void }) {
  const [text, setText] = useState(() => JSON.stringify(content, null, 2));
  const [error, setError] = useState<string | null>(null);

  function apply() {
    try {
      const parsed = contentSchema.safeParse(JSON.parse(text));
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        setError(`${issue.path.join(".")}: ${issue.message}`);
        return;
      }
      setContent(parsed.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON inválido");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Edição avançada. Clique em “Aplicar” e depois em Publicar/Salvar.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="h-[65vh] w-full rounded-lg border border-line bg-surface p-3 font-mono text-xs leading-relaxed outline-none focus:border-fg"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="button" onClick={apply} className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-fg">
        Aplicar
      </button>
    </div>
  );
}
