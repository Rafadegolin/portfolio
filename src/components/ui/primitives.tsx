import type { ProjectStatus } from "@/content";
import { TechIcon } from "@/lib/tech-icons";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

/** Cabeçalho de painel: "┌─ 02 SISTEMAS ──────── 5 no total" */
export function PanelHeader({
  index,
  title,
  meta,
  id,
}: {
  index?: string;
  title: string;
  meta?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] sm:px-5">
      {index && <span className="text-accent">{index}</span>}
      <h2 id={id} className="text-fg">
        {title}
      </h2>
      <span aria-hidden className="h-px flex-1 bg-line" />
      {meta && <span className="text-subtle normal-case tracking-normal">{meta}</span>}
    </div>
  );
}

export function Panel({
  index,
  title,
  meta,
  id,
  className = "",
  bodyClassName = "p-4 sm:p-6",
  children,
}: {
  index?: string;
  title: string;
  meta?: React.ReactNode;
  id?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`panel ${className}`}>
      <PanelHeader index={index} title={title} meta={meta} id={id ? `${id}-title` : undefined} />
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

const ledColor: Record<ProjectStatus | "ok", string> = {
  ok: "bg-accent shadow-[0_0_10px_var(--color-accent)]",
  production: "bg-accent shadow-[0_0_10px_var(--color-accent)]",
  side: "bg-amber shadow-[0_0_10px_var(--color-amber)]",
  archived: "bg-subtle",
};

export function Led({ status = "ok", live = true }: { status?: ProjectStatus | "ok"; live?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-1.5 shrink-0 rounded-full ${ledColor[status]} ${live && status !== "archived" ? "led-live" : ""}`}
    />
  );
}

export function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  const color = status === "production" ? "text-accent" : status === "side" ? "text-amber" : "text-subtle";
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] ${color}`}>
      <Led status={status} />
      {label}
    </span>
  );
}

export function Tag({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-line bg-raised/60 px-2 py-1 font-mono text-[11px] text-muted">
      {icon && <TechIcon name={icon} className="size-3.5" />}
      {children}
    </span>
  );
}

export function TagList({ items, className = "" }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Tag icon={item}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

/** Stack como pipeline: Next.js → NestJS → PostgreSQL */
export function Pipeline({ items, max = 4 }: { items: string[]; max?: number }) {
  const shown = items.slice(0, max);
  return (
    <span className="inline-flex flex-wrap items-center font-mono text-xs text-muted">
      {shown.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-1">
          {i > 0 && <span className="px-1 text-subtle">→</span>}
          <TechIcon name={item} className="size-3" />
          {item}
        </span>
      ))}
      {items.length > max && <span className="pl-1.5 text-subtle">+{items.length - max}</span>}
    </span>
  );
}

/** Bloco de número: valor grande + legenda mono. */
export function Readout({
  value,
  label,
  accent = false,
  size = "md",
}: {
  value: string;
  label: string;
  accent?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex flex-col-reverse gap-1.5">
      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">{label}</dt>
      <dd
        className={`tabular font-mono font-medium leading-none tracking-tight ${accent ? "text-accent glow" : "text-fg"} ${size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export const buttonPrimary =
  "inline-flex items-center gap-2 bg-accent px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-bg transition-[filter] hover:brightness-110";

export const buttonSecondary =
  "inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent hover:text-accent";
