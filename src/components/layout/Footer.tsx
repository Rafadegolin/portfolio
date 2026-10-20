import { getContent, type Locale } from "@/content";
import { getDictionary } from "@/content/dictionary";
import { Container, Led } from "@/components/ui/primitives";

export function Footer({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const { profile } = getContent();

  return (
    <footer className="no-print border-t border-line py-8">
      <Container className="flex flex-col gap-3 font-mono text-[11px] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2">
          <Led live={false} />© {new Date().getFullYear()} {profile.name}
        </p>
        <p>{d.footer.built}</p>
      </Container>
    </footer>
  );
}
