<div align="center">

# 🚀 Portfolio | Rafael Degolin

### Full Stack Developer

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br />

**[🌐 Ver Portfolio →](https://rafadegolin-portfolio.vercel.app)**

</div>

---

## 💻 Sobre o Projeto

Este repositório contém o código fonte do meu portfolio pessoal (ainda em construção).

Mais do que apenas uma vitrine de projetos, utilizei este espaço como um laboratório para aplicar as features mais recentes do ecossistema React. A ideia foi criar uma aplicação estática, mas com a robustez e escalabilidade de um produto real, utilizando **Next.js 15** e a nova configuração do **Tailwind v4**.

### Por que essa stack?

Embora um portfolio pudesse ser feito com tecnologias mais simples, optei por uma abordagem de *over-engineering* consciente para demonstrar domínio técnico em:

* **Next.js 15 (App Router):** Para aproveitar a renderização híbrida e otimização de rotas.
* **TypeScript:** Tipagem estrita para garantir manutenibilidade e reduzir erros em tempo de execução.
* **Tailwind CSS v4:** Explorando a nova engine e configuração *CSS-first*.
* **Framer Motion:** Para criar micro-interações e feedback visual refinado sem comprometer a performance.

---

## ✨ Principais Features

* **UI/UX Moderno:** Design system consistente com suporte nativo a Dark Mode.
* **Animações:** Uso de *Framer Motion* para transições de página, scroll parallax e interações de hover.
* **Performance:** Otimização de imagens, fontes e code-splitting automático do Next.js.
* **Responsividade:** Layout fluido que se adapta de mobile a monitores ultrawide.
* **Canvas API:** Implementação leve de partículas para compor o visual da Hero section.

---

## 🛠️ Instalação e Uso

Para rodar o projeto localmente:

```bash
# 1. Clone o repositório
git clone [https://github.com/Rafadegolin/portfolio-next.git](https://github.com/Rafadegolin/portfolio-next.git)

# 2. Instale as dependências
cd portfolio-next
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev

📂 Estrutura
A organização segue o padrão do App Router do Next.js:

portfolio-next/
├── app/
│   ├── components/  # Componentes reutilizáveis (Atomic Design)
│   ├── hooks/       # Hooks customizados (useScroll, etc)
│   ├── layout.tsx   # Layout global e providers
│   └── page.tsx     # Home page
├── public/          # Assets estáticos
└── tailwind.config.ts
