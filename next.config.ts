import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Hosts cujas imagens o otimizador pode processar. Precisa ficar em sincronia
    // com OPTIMIZABLE_IMAGE_HOSTS em src/lib/portfolio.ts — o que cair fora
    // renderiza com `unoptimized` em vez de estourar em runtime.
    remotePatterns: [
      // lib/portfolio.ts gera https://opengraph.githubassets.com/1/{owner}/{repo}
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
        pathname: "/1/**",
      },
      // Imagens anexadas ao portfolio no Proposa
      { protocol: "https", hostname: "proposa-web.vercel.app" },
    ],
    // Default do Next 16 e apenas ["image/webp"]; AVIF economiza mais ~30%.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
