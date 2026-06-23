import { NextResponse } from "next/server";

/**
 * Proxy same-origin para a API pública do Proposa.
 * O fetch acontece no SERVIDOR (server-to-server): não há CORS, segue redirects
 * (apex → www) e lê a URL de uma env de servidor (`PORTFOLIO_API`) — sem
 * `NEXT_PUBLIC`, então trocar a URL não exige rebuild. O cliente chama
 * `/api/portfolio` (mesma origem), eliminando o erro de CORS.
 *
 * Aceita também `NEXT_PUBLIC_PORTFOLIO_API` (env legada) como fallback.
 */
export const revalidate = 300;

export async function GET() {
  const url = process.env.PORTFOLIO_API ?? process.env.NEXT_PUBLIC_PORTFOLIO_API;
  if (!url) {
    return NextResponse.json({}, { status: 200 });
  }
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "fetch falhou" }, { status: 502 });
  }
}
