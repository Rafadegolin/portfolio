import raw from "../../content/portfolio.json";
import { contentSchema, type Content, type Locale, type Localized } from "./schema";

export * from "./schema";

// Valida no build: um JSON inválido quebra o deploy em vez de quebrar a página.
const content: Content = contentSchema.parse(raw);

export function getContent(): Content {
  return content;
}

/** Placeholder ainda não preenchido — visível no admin, nunca no site. */
export function isPending(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim();
  return v === "" || v.startsWith("TODO");
}

/** Texto no idioma pedido, ou "" se ainda pendente. */
export function t(field: Localized, locale: Locale): string {
  const v = field[locale];
  return isPending(v) ? "" : v;
}

/** Itens de uma lista localizada que estão preenchidos no idioma. */
export function tList(fields: Localized[], locale: Locale): string[] {
  return fields.map((f) => t(f, locale)).filter(Boolean);
}

export const visibleMetrics = <T extends { value: string; label: Localized }>(
  metrics: T[],
  locale: Locale,
) => metrics.filter((m) => !isPending(m.value) && t(m.label, locale));
