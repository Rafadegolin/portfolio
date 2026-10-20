import Link from "next/link";
import { getContent, t, type Locale, type Project } from "@/content";
import { getDictionary, projectPath } from "@/content/dictionary";
import { Panel } from "@/components/ui/primitives";
import { TechIcon } from "@/lib/tech-icons";
import { SECTION_IDS } from "@/components/layout/Nav";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Sistemas cuja stack cita a tecnologia ("Node.js / NestJS" casa com "NestJS"). */
function usedIn(name: string, projects: Project[]) {
  const parts = name.split("/").map(norm).filter(Boolean);
  return projects.filter((p) =>
    p.stack.some((s) => parts.some((part) => norm(s).includes(part) || part.includes(norm(s)))),
  );
}

export function Stack({ locale, index }: { locale: Locale; index: string }) {
  const d = getDictionary(locale);
  const { skillGroups, projects } = getContent();

  return (
    <Panel id={SECTION_IDS.stack} index={index} title={d.stack.title} meta={d.stack.meta} bodyClassName="">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {skillGroups.map((group, i) => (
          <div
            key={i}
            className={`border-line p-4 sm:p-6 ${i > 0 ? "border-t sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""} ${i >= 2 ? "sm:border-t xl:border-t-0" : ""} ${i > 0 ? "xl:border-l" : ""}`}
          >
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{t(group.title, locale)}</h3>
            <ul className="mt-4 space-y-3.5">
              {group.items.map((item) => {
                const systems = usedIn(item.name, projects);
                const context = t(item.context, locale);
                return (
                  <li key={item.name}>
                    <p className="flex items-center gap-2 font-medium">
                      <TechIcon name={item.name} className="size-4" />
                      {item.name}
                    </p>
                    {(context || systems.length > 0) && (
                      <p className="mt-0.5 font-mono text-[11px] leading-relaxed text-subtle">
                        {context}
                        {!context &&
                          systems.map((p, j) => (
                            <span key={p.slug}>
                              {j > 0 && ", "}
                              <Link href={projectPath(locale, p.slug)} className="hover:text-accent">
                                {p.title}
                              </Link>
                            </span>
                          ))}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}
