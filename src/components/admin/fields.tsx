"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Localized } from "@/content/schema";

export const isTodo = (v: string) => v.trim() === "" || v.trim().startsWith("TODO");

const inputBase =
  "w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-fg";

function inputClass(value: string, optional?: boolean) {
  const pending = value.trim().startsWith("TODO") || (!optional && value.trim() === "");
  return `${inputBase} ${pending ? "border-amber-500/70 bg-amber-500/5" : "border-line"}`;
}

function Input({
  value,
  onChange,
  multiline,
  optional,
  placeholder,
  lang,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  optional?: boolean;
  placeholder?: string;
  lang?: string;
}) {
  const cls = inputClass(value, optional);
  return multiline ? (
    <textarea
      value={value}
      lang={lang}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className={`${cls} resize-y leading-relaxed`}
    />
  ) : (
    <input
      value={value}
      lang={lang}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cls}
    />
  );
}

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-1 flex items-baseline gap-2 text-xs font-medium text-muted">
      {children}
      {hint && <span className="font-normal text-subtle">{hint}</span>}
    </span>
  );
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  multiline,
  optional,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  optional?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label hint={hint}>{label}</Label>
      <Input value={value} onChange={onChange} multiline={multiline} optional={optional} placeholder={placeholder} />
    </label>
  );
}

/** Campo PT + EN lado a lado. */
export function LocalizedField({
  label,
  hint,
  value,
  onChange,
  multiline,
  optional,
}: {
  label: string;
  hint?: string;
  value: Localized;
  onChange: (v: Localized) => void;
  multiline?: boolean;
  optional?: boolean;
}) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="grid gap-2 md:grid-cols-2">
        {(["pt", "en"] as const).map((loc) => (
          <label key={loc} className="relative block">
            <span className="pointer-events-none absolute top-1.5 right-2 font-mono text-[10px] uppercase text-subtle">
              {loc}
            </span>
            <Input
              value={value[loc]}
              lang={loc}
              multiline={multiline}
              optional={optional}
              onChange={(v) => onChange({ ...value, [loc]: v })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

/** Lista de strings editada como texto separado por vírgula. */
export function TagsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [text, setText] = useState(value.join(", "));
  return (
    <label className="block">
      <Label hint="separado por vírgula">{label}</Label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const next = text
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          onChange(next);
          setText(next.join(", "));
        }}
        className={`${inputBase} border-line`}
      />
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4" />
      {label}
    </label>
  );
}

const iconButton =
  "grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-line hover:text-fg disabled:opacity-30";

/** Lista editável: adicionar, remover, reordenar e recolher itens. */
export function ArrayField<T>({
  label,
  items,
  onChange,
  create,
  title,
  render,
  defaultOpen = false,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  title: (item: T, index: number) => string;
  render: (item: T, update: (fn: (draft: T) => void) => void, index: number) => React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen ? items.map((_, i) => i) : []));

  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setOpen(new Set());
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={() => {
            onChange([...items, create()]);
            setOpen((s) => new Set(s).add(items.length));
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium hover:bg-line"
        >
          <Plus className="size-3.5" aria-hidden /> Adicionar
        </button>
      </div>
      <ol className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <li key={i} className="rounded-lg border border-line bg-bg">
              <div className="flex items-center gap-1 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setOpen((s) => {
                      const n = new Set(s);
                      if (n.has(i)) n.delete(i);
                      else n.add(i);
                      return n;
                    })
                  }
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-left text-sm"
                >
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform ${isOpen ? "" : "-rotate-90"}`}
                    aria-hidden
                  />
                  <span className="truncate">{title(item, i) || <em className="text-subtle">(sem título)</em>}</span>
                </button>
                <button type="button" aria-label="Mover para cima" className={iconButton} disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ChevronUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Mover para baixo"
                  className={iconButton}
                  disabled={i === items.length - 1}
                  onClick={() => move(i, i + 1)}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Remover"
                  className={`${iconButton} hover:text-red-400`}
                  onClick={() => {
                    if (confirm("Remover este item?")) {
                      onChange(items.filter((_, j) => j !== i));
                      setOpen(new Set());
                    }
                  }}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
              {isOpen && (
                <div className="space-y-4 border-t border-line p-3">
                  {render(
                    item,
                    (fn) => {
                      const next = [...items];
                      const draft = structuredClone(item);
                      fn(draft);
                      next[i] = draft;
                      onChange(next);
                    },
                    i,
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Lista de textos localizados (bullets). */
export function LocalizedListField({
  label,
  items,
  onChange,
  multiline = true,
}: {
  label: string;
  items: Localized[];
  onChange: (items: Localized[]) => void;
  multiline?: boolean;
}) {
  return (
    <ArrayField
      label={label}
      items={items}
      onChange={onChange}
      create={() => ({ pt: "", en: "" })}
      title={(item) => item.pt || item.en}
      render={(item, update) => (
        <LocalizedField
          label="Texto"
          value={item}
          multiline={multiline}
          onChange={(v) =>
            update((d) => {
              d.pt = v.pt;
              d.en = v.en;
            })
          }
        />
      )}
    />
  );
}

export function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-line bg-surface p-4 sm:p-5">
      <legend className="px-1 font-mono text-xs uppercase tracking-widest text-subtle">{title}</legend>
      {children}
    </fieldset>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`${inputBase} ${options.some((o) => o.value === value) ? "border-line" : "border-amber-500/70"}`}
      >
        {!options.some((o) => o.value === value) && <option value={value}>{value || "—"}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value) || 0)))}
        className={`${inputBase} border-line`}
      />
    </label>
  );
}
