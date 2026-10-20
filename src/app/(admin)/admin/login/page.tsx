import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl tracking-tight">Admin</h1>
        <p className="mt-2 text-sm text-muted">Edite o conteúdo do portfolio.</p>
        <LoginForm />
      </div>
    </main>
  );
}
