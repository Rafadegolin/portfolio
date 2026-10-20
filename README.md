# Portfolio · Rafael Degolin

Portfolio pessoal em PT-BR e EN no estilo "sala de controle": os sistemas que construí apresentados como um painel de produção, com diagramas de arquitetura animados, atividade real do GitHub e um modo recrutador de 30 segundos (`/resumo`, `/en/tldr`). Gerado estaticamente, com editor de conteúdo em `/admin`.

**[rafadegolin-portfolio.vercel.app](https://rafadegolin-portfolio.vercel.app)**

## Stack

Next.js 16 (App Router, React Compiler) · React 19 · TypeScript · Tailwind CSS v4 · zod

## Como funciona

- **Conteúdo:** fica em [`content/portfolio.json`](content/portfolio.json), validado por [`src/content/schema.ts`](src/content/schema.ts). Todo texto tem versão `pt` e `en`.
- **Build:** todas as páginas públicas são geradas no build (`/`, `/en`, `/projetos/[slug]`, `/en/projects/[slug]`). Não há busca de dados no navegador.
- **GitHub:** contribuições, sequências e commits recentes vêm da API do GitHub (`src/lib/github.ts`) usando o `GITHUB_TOKEN`, com revalidação a cada 6h. Sem token, esses painéis somem.
- **Diagramas:** cada projeto tem `status` e `architecture` (blocos e ligações) no JSON, editáveis no admin. A grade tem vão de 56px entre colunas: rótulo de bloco com até ~18 caracteres, rótulo de ligação com até ~7, e no máximo uma ligação com rótulo chegando em cada bloco.
- **Cases:** cada projeto vira uma página com contexto, problema, solução, papel, decisões, resultados, destaques técnicos, linha do tempo, stack e galeria (com legenda e ampliação em tela cheia). O primeiro link vira o botão principal do topo, e a página termina com uma chamada para contato.
  - `kind: "lab"` manda o projeto para o bloco "Lab" (experimentos) da home em vez da lista de sistemas.
  - `cover` mostra uma imagem de capa no card de destaque da home.
  - Cada case tem imagem de compartilhamento própria (`opengraph-image.tsx` em `/projetos/[slug]` e `/en/projects/[slug]`) e JSON-LD `CreativeWork`.
- **Campos pendentes:** um campo vazio ou que começa com `TODO` não aparece no site. Dá para publicar com conteúdo incompleto.
- **`/admin`:** é protegido por senha.
  - Em produção, salvar faz um commit no GitHub com o JSON e as imagens enviadas, e a Vercel publica o novo deploy em cerca de 1 minuto.
  - Em `npm run dev`, ele grava direto no arquivo local (use `ADMIN_STORE=github` para testar a publicação).

```
content/portfolio.json        conteúdo do site
src/content/                  schema, helpers de idioma e textos fixos da UI
src/components/sections/      seções da home
src/components/CaseStudyPage.tsx  página de cada projeto
src/components/diagram/       diagramas de arquitetura (SVG)
public/projects/              prints dos projetos (WebP/PNG)
src/components/admin/         editor do /admin
src/lib/content-store.ts      leitura e gravação (GitHub ou disco)
src/lib/auth.ts, src/proxy.ts sessão do /admin
src/app/(pt) (en) (admin)     root layouts de cada idioma e do admin
```

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha ADMIN_PASSWORD e ADMIN_SECRET
npm run dev
```

Abra `http://localhost:3000/admin` para editar o conteúdo.

## Segurança do /admin

- Senha com no mínimo 16 caracteres, comparada em tempo constante. Tentativas erradas têm atraso e bloqueio por IP (5 em 15 min).
- Sessão em cookie `httpOnly`, `sameSite=strict`, `__Host-` em produção, válida por 12h e assinada com HMAC junto com a senha: trocar a senha derruba todas as sessões.
- Server Actions conferem a sessão de novo (não dependem só do `proxy.ts`).
- Todo link, imagem e CV do conteúdo é validado (bloqueia `javascript:`, `data:`, `//host` e `..`). Conteúdo inválido não passa no save nem no build.
- Uploads: só em `public/projects`, `public/profile` e `public/cv`, com assinatura binária conferida (WebP, PNG, JPEG, PDF), máx. 5 MB por arquivo e 10 por publicação.
- Headers: CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; `/admin` com `no-store` e `noindex`.

## Deploy (Vercel)

Configure as variáveis do `.env.example` no projeto da Vercel. O `GITHUB_TOKEN` deve ser um token fine-grained com permissão **Contents: Read and write**, restrito a este repositório.
