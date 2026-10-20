"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  MIN_PASSWORD_LENGTH,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminConfigProblem,
  checkPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth";
import { ConflictError, UserFacingError, getStoreMode, saveContent, type Upload } from "@/lib/content-store";
import { contentSchema } from "@/content/schema";

export type LoginState = { error?: string };

// Limite de tentativas por IP, em memória. É "melhor esforço": em serverless
// cada instância tem seu próprio contador. A defesa principal é a senha longa
// (mínimo de 16 caracteres) — com ela, força bruta não é viável.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; since: number }>();

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function isLocked(ip: string): boolean {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.since > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function registerFailure(ip: string) {
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.since > WINDOW_MS) failures.set(ip, { count: 1, since: Date.now() });
  else entry.count++;
}

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const problem = adminConfigProblem();
  if (problem === "missing") {
    return { error: "Defina ADMIN_PASSWORD e ADMIN_SECRET nas variáveis de ambiente." };
  }
  if (problem === "weak-password") {
    return { error: `ADMIN_PASSWORD precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }

  const ip = await clientIp();
  if (isLocked(ip)) {
    return { error: "Muitas tentativas. Tente de novo em 15 minutos." };
  }

  const ok = await checkPassword(String(formData.get("password") ?? ""));
  if (!ok) {
    registerFailure(ip);
    // Atrasa respostas erradas para encarecer tentativas em sequência.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Senha incorreta." };
  }

  failures.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

async function hasSession() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export type SaveResult =
  | { ok: true; sha: string; mode: string }
  | { ok: false; error: string; conflict?: boolean };

export async function save(input: { content: unknown; sha: string; uploads: Upload[] }): Promise<SaveResult> {
  if (!(await hasSession())) return { ok: false, error: "Sessão expirada. Faça login de novo." };

  const parsed = contentSchema.safeParse(input.content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `${issue.path.join(".")}: ${issue.message}` };
  }

  try {
    const sha = await saveContent(parsed.data, String(input.sha ?? ""), Array.isArray(input.uploads) ? input.uploads : []);
    return { ok: true, sha, mode: getStoreMode() };
  } catch (err) {
    if (err instanceof ConflictError) {
      return {
        ok: false,
        conflict: true,
        error: "O conteúdo foi alterado em outro lugar desde que você abriu o editor. Recarregue a página.",
      };
    }
    // Erros pensados para o usuário (upload inválido, modo leitura) aparecem; o resto fica só no log.
    if (err instanceof UserFacingError) return { ok: false, error: err.message };
    console.error("[admin/save]", err);
    return { ok: false, error: "Não foi possível salvar. Veja os logs do servidor para detalhes." };
  }
}
