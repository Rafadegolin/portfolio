import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Editor } from "@/components/admin/Editor";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { ContentMissingError, getStoreMode, getStoreTarget, loadContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // O proxy já protege a rota; checar aqui também evita depender só dele.
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    redirect("/admin/login");
  }

  try {
    const { content, sha } = await loadContent();
    return <Editor initialContent={content} initialSha={sha} mode={getStoreMode()} />;
  } catch (err) {
    if (!(err instanceof ContentMissingError)) throw err;
    const { repo, branch } = getStoreTarget();
    return (
      <main className="mx-auto max-w-xl px-4 py-24">
        <h1 className="text-2xl font-semibold tracking-tight">Conteúdo não encontrado no GitHub</h1>
        <p className="mt-4 leading-relaxed text-muted">
          O arquivo <code className="text-fg">content/portfolio.json</code> ainda não existe na branch{" "}
          <code className="text-fg">{branch}</code> do repositório <code className="text-fg">{repo}</code>. Faça
          merge e push da branch com o novo portfolio, ou ajuste <code className="text-fg">GITHUB_BRANCH</code>.
        </p>
      </main>
    );
  }
}
