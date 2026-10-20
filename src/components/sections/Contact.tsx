import { ArrowUpRight, Download, Mail } from "lucide-react";
import { getContent, isPending, type Locale } from "@/content";
import { getDictionary } from "@/content/dictionary";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Panel, buttonPrimary, buttonSecondary } from "@/components/ui/primitives";
import { SECTION_IDS } from "@/components/layout/Nav";

export function Contact({ locale, index }: { locale: Locale; index: string }) {
  const d = getDictionary(locale);
  const { profile } = getContent();
  const email = isPending(profile.email) ? "" : profile.email;
  const cv = isPending(profile.cv[locale]) ? "" : profile.cv[locale];

  const social = [
    ["linkedin", profile.links.linkedin],
    ["github", profile.links.github],
    ["whatsapp", profile.links.whatsapp],
  ].filter(([, url]) => url && !isPending(url));

  return (
    <Panel id={SECTION_IDS.contact} index={index} title={d.nav.contact} bodyClassName="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
      <div className="p-4 sm:p-8 lg:p-12">
        <h3 className="text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
          {d.contact.title}
        </h3>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted text-pretty">{d.contact.text}</p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {email && (
            <>
              <a href={`mailto:${email}`} className={buttonPrimary}>
                <Mail className="size-3.5" aria-hidden />
                {d.contact.email}
              </a>
              <CopyEmail email={email} label={d.hero.copyEmail} copiedLabel={d.hero.copied} className={buttonSecondary} />
            </>
          )}
          {cv && (
            <a href={cv} download className={buttonSecondary}>
              <Download className="size-3.5" aria-hidden />
              {d.hero.downloadCv}
            </a>
          )}
        </div>
      </div>

      {/* Terminal com os canais de contato. */}
      <div className="border-t border-line bg-bg/70 p-4 font-mono text-[13px] leading-7 sm:p-8 lg:border-t-0 lg:border-l" data-motion>
        <p className="text-subtle">
          <span className="text-accent">~</span> $ contact --list
        </p>
        <ul className="mt-2">
          {email && (
            <li className="grid grid-cols-[6.5rem_1fr]">
              <span className="text-subtle">email</span>
              <a href={`mailto:${email}`} className="truncate text-fg hover:text-accent">
                {email}
              </a>
            </li>
          )}
          {social.map(([label, url]) => (
            <li key={label} className="grid grid-cols-[6.5rem_1fr]">
              <span className="text-subtle">{label}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 truncate text-fg hover:text-accent"
              >
                {url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                <ArrowUpRight className="size-3 shrink-0" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-subtle">
          <span className="text-accent">~</span> ${" "}
          <span className="caret inline-block h-4 w-2 translate-y-[3px] bg-accent" aria-hidden />
        </p>
      </div>
    </Panel>
  );
}
