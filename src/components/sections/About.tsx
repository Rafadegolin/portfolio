import Image from "next/image";
import { getContent, t, tList, type Locale } from "@/content";
import { getDictionary } from "@/content/dictionary";
import { Led, Panel } from "@/components/ui/primitives";
import { SECTION_IDS } from "@/components/layout/Nav";

export function About({ locale, index }: { locale: Locale; index: string }) {
  const d = getDictionary(locale);
  const { profile, education } = getContent();
  const paragraphs = tList(profile.about, locale);
  const visibleEducation = education.filter((e) => t(e.course, locale));
  const location = t(profile.location, locale);

  return (
    <Panel id={SECTION_IDS.about} index={index} title={d.about.title} className="h-full">
      {/* Crachá de "operador": foto + identificação. */}
      <div className="grid grid-cols-[112px_1fr] items-end gap-5 border-b border-line pb-6 sm:grid-cols-[148px_1fr]">
        {profile.photo.src ? (
          <div className="panel group relative aspect-[4/5] overflow-hidden">
            <Image
              src={profile.photo.src}
              alt={t(profile.photo.alt, locale) || profile.name}
              fill
              sizes="148px"
              className="object-cover grayscale-[40%] transition-[filter] duration-500 group-hover:grayscale-0"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgb(0_0_0/0.18)_3px,rgb(0_0_0/0.18)_4px)] mix-blend-multiply"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent" />
          </div>
        ) : (
          <div />
        )}
        <div className="min-w-0 font-mono text-[11px] uppercase tracking-[0.14em]">
          <p className="text-subtle">operator</p>
          <p className="mt-1 font-sans text-xl font-semibold normal-case tracking-tight text-fg">{profile.name}</p>
          <p className="mt-1 text-muted">{t(profile.role, locale)}</p>
          {location && <p className="mt-1 text-subtle">{location}</p>}
          <p className="mt-3 inline-flex items-center gap-2 text-accent" data-motion>
            <Led />
            online
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4 leading-relaxed text-pretty">
        {paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg text-fg" : "text-muted"}>
            {p}
          </p>
        ))}
      </div>
      {visibleEducation.length > 0 && (
        <div className="mt-8 border-t border-line pt-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{d.about.education}</h3>
          <ul className="mt-3 space-y-2">
            {visibleEducation.map((e, i) => (
              <li key={i}>
                <p className="font-medium">{t(e.course, locale)}</p>
                <p className="font-mono text-xs text-subtle">
                  {[e.institution, e.period].filter((v) => v && !v.startsWith("TODO")).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
