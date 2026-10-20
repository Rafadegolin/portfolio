import { getContent, t, tList, type Locale } from "@/content";
import { getDictionary } from "@/content/dictionary";
import { Panel } from "@/components/ui/primitives";
import { SECTION_IDS } from "@/components/layout/Nav";

export function hasRunbook(locale: Locale) {
  const { routine, principles } = getContent();
  return tList(routine, locale).length > 0 || principles.some((p) => t(p.title, locale));
}

export function Runbook({ locale, index }: { locale: Locale; index: string }) {
  const d = getDictionary(locale);
  const { routine, principles } = getContent();
  const steps = tList(routine, locale);
  const visible = principles.filter((p) => t(p.title, locale));

  return (
    <Panel id={SECTION_IDS.runbook} index={index} title={d.runbook.title} meta={d.runbook.meta} className="h-full">
      {visible.length > 0 && (
        <>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{d.runbook.principles}</h3>
          <ol className="mt-4 space-y-5">
            {visible.map((p, i) => (
              <li key={i} className="reveal grid grid-cols-[2.25rem_1fr]">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-medium">{t(p.title, locale)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{t(p.description, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
      {steps.length > 0 && (
        <>
          <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{d.runbook.routine}</h3>
          <ol className="mt-4 space-y-2.5 font-mono text-[13px]">
            {steps.map((step, i) => (
              <li key={i} className="grid grid-cols-[2.25rem_1fr] text-muted">
                <span className="text-subtle">{`${i + 1}.`}</span>
                <span className="font-sans text-sm leading-relaxed text-fg text-pretty">{step}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Panel>
  );
}
