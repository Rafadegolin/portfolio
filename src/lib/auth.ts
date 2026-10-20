// Sessão do /admin: cookie "exp.assinatura" com HMAC-SHA256 de ADMIN_SECRET.
// A assinatura também cobre uma impressão digital de ADMIN_PASSWORD: trocar a
// senha (ou o segredo) derruba todas as sessões abertas.
// Usa Web Crypto para rodar igual no proxy e nas server actions.

export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 horas
export const MIN_PASSWORD_LENGTH = 16;

/** Em produção o prefixo __Host- obriga Secure, Path=/ e nenhum Domain. */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session";

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Comparação em tempo constante de strings de mesmo tamanho. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type AdminConfigProblem = "missing" | "weak-password" | null;

export function adminConfigProblem(): AdminConfigProblem {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !process.env.ADMIN_SECRET) return "missing";
  if (password.length < MIN_PASSWORD_LENGTH) return "weak-password";
  return null;
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;
  if (!expected || !secret || adminConfigProblem()) return false;
  // Compara os HMACs (tamanho fixo) para não vazar o tamanho da senha.
  return safeEqual(await hmac(secret, input), await hmac(secret, expected));
}

async function sign(exp: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET!;
  const passwordPrint = await hmac(secret, `pw:${process.env.ADMIN_PASSWORD ?? ""}`);
  return hmac(secret, `${exp}.${passwordPrint}`);
}

export async function createSessionToken(): Promise<string> {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE);
  return `${exp}.${await sign(exp)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || adminConfigProblem()) return false;
  const [exp, signature, extra] = token.split(".");
  if (!exp || !signature || extra !== undefined || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  return safeEqual(signature, await sign(exp));
}
