import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { contentSchema, type Content } from "@/content/schema";
import bundled from "../../content/portfolio.json";
import { UserFacingError, validateUploads, type Upload } from "./uploads";

export { UserFacingError, type Upload };

// Onde o /admin lê e grava o conteúdo:
// - "github": commit no repositório via API (produção). A Vercel faz o rebuild.
// - "fs": grava direto no disco (só no `npm run dev`, a menos que ADMIN_STORE=github).

export const CONTENT_PATH = "content/portfolio.json";

export type StoreMode = "github" | "fs" | "readonly";

export class ConflictError extends Error {}

/** Conteúdo ainda não existe na branch configurada (ex.: branch não mergeada). */
export class ContentMissingError extends Error {}

export function getStoreMode(): StoreMode {
  const hasGithub = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
  // Em dev o padrão é o arquivo local, mesmo com token: editar o GitHub a partir
  // do dev deixaria o arquivo local divergente. ADMIN_STORE=github força o GitHub.
  if (process.env.NODE_ENV === "development") {
    return hasGithub && process.env.ADMIN_STORE === "github" ? "github" : "fs";
  }
  return hasGithub ? "github" : "readonly";
}

export function getStoreTarget() {
  return { repo: process.env.GITHUB_REPO ?? "", branch: process.env.GITHUB_BRANCH || "main" };
}

export function serialize(content: Content): string {
  return JSON.stringify(content, null, 2) + "\n";
}

/** Mesmo sha que o Git calcula para um blob: o modo fs e o GitHub comparam versões igual. */
function gitBlobSha(text: string): string {
  const body = Buffer.from(text, "utf8");
  return createHash("sha1").update(`blob ${body.length}\0`).update(body).digest("hex");
}

export async function loadContent(): Promise<{ content: Content; sha: string }> {
  const mode = getStoreMode();
  // Somente leitura (produção sem token): usa o JSON embutido no build, já que o
  // arquivo pode não estar no bundle da função serverless.
  const text =
    mode === "github" ? await gh.readFile(CONTENT_PATH) : mode === "fs" ? await fsStore.read() : serialize(contentSchema.parse(bundled));
  return { content: contentSchema.parse(JSON.parse(text)), sha: gitBlobSha(text) };
}

/**
 * Grava conteúdo + imagens em um único commit.
 * @param baseSha sha do JSON quando o editor carregou; se mudou, lança ConflictError.
 */
export async function saveContent(content: Content, baseSha: string, uploads: Upload[]): Promise<string> {
  const text = serialize(contentSchema.parse(content));
  validateUploads(uploads);
  const mode = getStoreMode();
  if (mode === "github") await gh.commit(text, baseSha, uploads);
  else if (mode === "fs") await fsStore.write(text, baseSha, uploads);
  else throw new UserFacingError("Configure GITHUB_TOKEN e GITHUB_REPO para salvar em produção.");
  return gitBlobSha(text);
}

// ─── Disco (dev) ────────────────────────────────────────────────────────────

const fsStore = {
  async read() {
    return readFile(path.join(process.cwd(), CONTENT_PATH), "utf8");
  },
  async write(text: string, baseSha: string, uploads: Upload[]) {
    if (gitBlobSha(await this.read()) !== baseSha) throw new ConflictError();
    for (const upload of uploads) {
      const target = path.join(process.cwd(), "public", upload.path);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, Buffer.from(upload.base64, "base64"));
    }
    await writeFile(path.join(process.cwd(), CONTENT_PATH), text, "utf8");
  },
};

// ─── GitHub ─────────────────────────────────────────────────────────────────

const gh = {
  get branch() {
    return process.env.GITHUB_BRANCH || "main";
  },

  async request<T>(endpoint: string, init?: { method?: string; body?: unknown }): Promise<T> {
    const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}${endpoint}`, {
      method: init?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    if (!res.ok) {
      // 422 no update do ref = alguém commitou no meio do caminho.
      if (res.status === 422 && endpoint.startsWith("/git/refs/")) throw new ConflictError();
      if (res.status === 404 && endpoint.startsWith(`/contents/${CONTENT_PATH}`)) throw new ContentMissingError();
      throw new Error(`GitHub ${res.status} em ${endpoint}: ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  },

  async readFile(filePath: string): Promise<string> {
    const data = await this.request<{ content: string }>(
      `/contents/${filePath}?ref=${encodeURIComponent(this.branch)}`,
    );
    return Buffer.from(data.content, "base64").toString("utf8");
  },

  async commit(text: string, baseSha: string, uploads: Upload[]) {
    const ref = await this.request<{ object: { sha: string } }>(`/git/ref/heads/${this.branch}`);
    const headSha = ref.object.sha;

    const current = await this.request<{ sha: string }>(
      `/contents/${CONTENT_PATH}?ref=${headSha}`,
    );
    if (current.sha !== baseSha) throw new ConflictError();

    const head = await this.request<{ tree: { sha: string } }>(`/git/commits/${headSha}`);

    const files = [
      { path: CONTENT_PATH, content: Buffer.from(text, "utf8").toString("base64") },
      ...uploads.map((u) => ({ path: `public/${u.path}`, content: u.base64 })),
    ];
    const tree = await Promise.all(
      files.map(async (file) => {
        const blob = await this.request<{ sha: string }>("/git/blobs", {
          method: "POST",
          body: { content: file.content, encoding: "base64" },
        });
        return { path: file.path, mode: "100644", type: "blob", sha: blob.sha };
      }),
    );

    const newTree = await this.request<{ sha: string }>("/git/trees", {
      method: "POST",
      body: { base_tree: head.tree.sha, tree },
    });
    const commit = await this.request<{ sha: string }>("/git/commits", {
      method: "POST",
      body: {
        message: uploads.length
          ? `content: atualiza portfolio e ${uploads.length} imagem(ns) via admin`
          : "content: atualiza portfolio via admin",
        tree: newTree.sha,
        parents: [headSha],
      },
    });
    await this.request(`/git/refs/heads/${this.branch}`, {
      method: "PATCH",
      body: { sha: commit.sha, force: false },
    });
  },
};
