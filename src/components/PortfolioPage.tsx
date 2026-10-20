import type { Locale } from "@/content";
import { getContent, t } from "@/content";
import { homePath } from "@/content/dictionary";
import { getGithubStats } from "@/lib/github";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/primitives";
import { InViewPauser } from "@/components/ui/InViewPauser";
import { Hero } from "@/components/sections/Hero";
import { Activity } from "@/components/sections/Activity";
import { Systems } from "@/components/sections/Systems";
import { DeployLog } from "@/components/sections/DeployLog";
import { Stack } from "@/components/sections/Stack";
import { Career } from "@/components/sections/Career";
import { Runbook, hasRunbook } from "@/components/sections/Runbook";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { PersonJsonLd } from "@/components/seo";

export async function PortfolioPage({ locale }: { locale: Locale }) {
  const github = await getGithubStats(getContent().profile.links.github);

  // Numeração contínua só para os painéis que vão aparecer.
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  const showLog = Boolean(github?.recent.length) || getContent().workLog.some((e) => t(e.title, locale));

  return (
    <>
      <PersonJsonLd locale={locale} />
      <Nav locale={locale} altHref={homePath(locale === "pt" ? "en" : "pt")} />
      <main id="main">
        <Hero locale={locale} github={github} />
        <Container className="flex flex-col gap-6 py-10 sm:gap-8 sm:py-14">
          <Systems locale={locale} index={next()} />
          {github && <Activity locale={locale} index={next()} github={github} />}
          {showLog && <DeployLog locale={locale} index={next()} github={github} />}
          <Stack locale={locale} index={next()} />
          <Career locale={locale} index={next()} />
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {hasRunbook(locale) && <Runbook locale={locale} index={next()} />}
            <About locale={locale} index={next()} />
          </div>
          <Contact locale={locale} index={next()} />
        </Container>
      </main>
      <Footer locale={locale} />
      <InViewPauser />
    </>
  );
}
