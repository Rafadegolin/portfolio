import type { Locale, ProjectStatus } from "./schema";

/** Textos fixos da interface (o conteúdo editável fica em content/portfolio.json). */
const dictionary = {
  pt: {
    nav: {
      systems: "Sistemas",
      log: "Log",
      stack: "Stack",
      career: "Trajetória",
      contact: "Contato",
      recruiter: "Modo recrutador",
      recruiterShort: "30s",
      menu: "Abrir menu",
      close: "Fechar menu",
      switchLangLabel: "Ver site em inglês",
      skip: "Pular para o conteúdo",
    },
    hero: {
      overline: "overview",
      seeWork: "Ver sistemas",
      downloadCv: "Baixar CV",
      copyEmail: "Copiar e-mail",
      copied: "E-mail copiado",
      tldr: "Sem tempo? Resumo em 30s",
      mapLabel: "Mapa dos sistemas que construí",
      mapTitle: "Live · mapa de sistemas",
      mapMeta: (prod: number, side: number) => `${prod} prod · ${side} side`,
      events: "último evento",
    },
    github: {
      title: "Atividade",
      meta: "GitHub · últimos 12 meses · atualiza a cada 6h",
      total: "contribuições",
      private: "em repositórios privados",
      activeDays: "dias ativos",
      streak: "dias seguidos agora",
      longest: "maior sequência",
      repos: "repositórios públicos",
      less: "menos",
      more: "mais",
      day: (count: number, date: string) => `${count} contribuições em ${date}`,
    },
    systems: {
      title: "Sistemas",
      meta: (n: number) => `${n} no total`,
      intro:
        "O que eu construí e que está rodando. Parte é interno e confidencial: nesses casos mostro problema, arquitetura e resultado, sem expor dados.",
      openCase: "abrir case",
      confidential: "confidencial",
      status: { production: "PROD", side: "SIDE", archived: "ARQUIVADO" } satisfies Record<ProjectStatus, string>,
      lab: "Lab",
      labIntro: "Experimentos e projetos por diversão — onde testo stacks e ideias fora da zona de conforto.",
    },
    log: {
      title: "Deploy log",
      meta: "entregas + commits recentes",
      shipped: "entregue",
      commit: "commit",
    },
    stack: {
      title: "Stack",
      meta: "onde cada tecnologia foi usada",
    },
    career: {
      title: "Trajetória",
      meta: "changelog de uma carreira",
      intro:
        "Testei software, operei o negócio e hoje desenvolvo as ferramentas que a operação usa. Cada versão adicionou uma camada.",
    },
    runbook: {
      title: "Runbook",
      meta: "como eu trabalho",
      principles: "Princípios",
      routine: "Uma semana típica",
    },
    about: {
      title: "Sobre",
      education: "Formação",
    },
    contact: {
      title: "Vamos conversar?",
      text:
        "Estou aberto a vagas de desenvolvimento full stack e a projetos em que software e automação façam diferença real no negócio. Respondo em até um dia útil.",
      email: "Enviar e-mail",
    },
    caseStudy: {
      back: "Todos os sistemas",
      report: "Relatório do sistema",
      architecture: "Arquitetura",
      problem: "Problema",
      solution: "O que construí",
      role: "Meu papel",
      results: "Resultados",
      stack: "Stack",
      links: "Links",
      gallery: "Telas",
      next: "Próximo sistema",
      context: "Contexto",
      highlights: "Destaques técnicos",
      decisions: "Decisões",
      timeline: "Linha do tempo",
      ctaTitle: "Precisa de um sistema assim?",
      ctaText: "Construo de ponta a ponta — arquitetura, backend, frontend, IA e deploy. Vamos conversar sobre o seu problema.",
      ctaButton: "Falar comigo",
      ctaSecondary: "Ver todos os sistemas",
      openImage: "Ampliar tela",
      closeImage: "Fechar",
      prevImage: "Tela anterior",
      nextImage: "Próxima tela",
    },
    tldr: {
      title: "Resumo em 30 segundos",
      full: "Ver portfolio completo",
      print: "Imprimir / salvar PDF",
      results: "Resultados",
      stack: "Stack principal",
      experience: "Experiência",
      contact: "Contato",
    },
    footer: {
      built: "Feito com Next.js · conteúdo estático, dados do GitHub atualizados a cada 6h.",
    },
    months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  },
  en: {
    nav: {
      systems: "Systems",
      log: "Log",
      stack: "Stack",
      career: "Career",
      contact: "Contact",
      recruiter: "Recruiter mode",
      recruiterShort: "30s",
      menu: "Open menu",
      close: "Close menu",
      switchLangLabel: "View site in Portuguese",
      skip: "Skip to content",
    },
    hero: {
      overline: "overview",
      seeWork: "See systems",
      downloadCv: "Download CV",
      copyEmail: "Copy email",
      copied: "Email copied",
      tldr: "Short on time? 30s summary",
      mapLabel: "Map of the systems I built",
      mapTitle: "Live · system map",
      mapMeta: (prod: number, side: number) => `${prod} prod · ${side} side`,
      events: "latest event",
    },
    github: {
      title: "Activity",
      meta: "GitHub · last 12 months · refreshes every 6h",
      total: "contributions",
      private: "in private repositories",
      activeDays: "active days",
      streak: "day streak now",
      longest: "longest streak",
      repos: "public repositories",
      less: "less",
      more: "more",
      day: (count: number, date: string) => `${count} contributions on ${date}`,
    },
    systems: {
      title: "Systems",
      meta: (n: number) => `${n} total`,
      intro:
        "What I built and what is running. Some of it is internal and confidential: for those I show the problem, the architecture and the outcome without exposing data.",
      openCase: "open case",
      confidential: "confidential",
      status: { production: "PROD", side: "SIDE", archived: "ARCHIVED" } satisfies Record<ProjectStatus, string>,
      lab: "Lab",
      labIntro: "Experiments and just-for-fun builds — where I try stacks and ideas outside my comfort zone.",
    },
    log: {
      title: "Deploy log",
      meta: "shipped work + recent commits",
      shipped: "shipped",
      commit: "commit",
    },
    stack: {
      title: "Stack",
      meta: "where each technology was used",
    },
    career: {
      title: "Career",
      meta: "a career changelog",
      intro:
        "I tested software, ran operations and now build the tools the business runs on. Each version added a layer.",
    },
    runbook: {
      title: "Runbook",
      meta: "how I work",
      principles: "Principles",
      routine: "A typical week",
    },
    about: {
      title: "About",
      education: "Education",
    },
    contact: {
      title: "Let's talk?",
      text:
        "I'm open to full stack roles and to projects where software and automation make a real difference to the business. I reply within one business day.",
      email: "Send an email",
    },
    caseStudy: {
      back: "All systems",
      report: "System report",
      architecture: "Architecture",
      problem: "Problem",
      solution: "What I built",
      role: "My role",
      results: "Results",
      stack: "Stack",
      links: "Links",
      gallery: "Screens",
      next: "Next system",
      context: "Context",
      highlights: "Technical highlights",
      decisions: "Decisions",
      timeline: "Timeline",
      ctaTitle: "Need a system like this?",
      ctaText: "I build end to end — architecture, backend, frontend, AI and deployment. Let's talk about your problem.",
      ctaButton: "Get in touch",
      ctaSecondary: "See all systems",
      openImage: "Enlarge screen",
      closeImage: "Close",
      prevImage: "Previous screen",
      nextImage: "Next screen",
    },
    tldr: {
      title: "30-second summary",
      full: "See the full portfolio",
      print: "Print / save as PDF",
      results: "Results",
      stack: "Core stack",
      experience: "Experience",
      contact: "Contact",
    },
    footer: {
      built: "Built with Next.js · static content, GitHub data refreshed every 6h.",
    },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
};

export type Dictionary = (typeof dictionary)["pt"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale];
}

/** "2025-08" → "Ago 2025" */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-");
  const m = Number(month);
  if (!year || !m) return value;
  return `${dictionary[locale].months[m - 1]} ${year}`;
}

/** "2026-10-14" → "14 Out" */
export function formatDay(value: string, locale: Locale): string {
  const [, month, day] = value.slice(0, 10).split("-");
  const m = Number(month);
  if (!m) return value;
  return day ? `${day} ${dictionary[locale].months[m - 1]}` : dictionary[locale].months[m - 1];
}

export function homePath(locale: Locale): string {
  return locale === "pt" ? "/" : "/en";
}

export function projectPath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/projetos/${slug}` : `/en/projects/${slug}`;
}

export function tldrPath(locale: Locale): string {
  return locale === "pt" ? "/resumo" : "/en/tldr";
}

export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en" };
