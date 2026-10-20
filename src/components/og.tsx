import { ImageResponse } from "next/og";
import { getContent, t, visibleMetrics, type Locale } from "@/content";

export const ogSize = { width: 1200, height: 630 };

/** OG de um case: título, resumo, métricas e stack — o card que aparece ao compartilhar o link. */
export function renderProjectOgImage(locale: Locale, slug: string) {
  const { profile, projects } = getContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return renderOgImage(locale);
  const metrics = visibleMetrics(project.metrics, locale).slice(0, 3);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07090a",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e6ebe8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#3ddc84", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}>
          {`// ${t(project.category, locale)} — ${profile.shortName}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>{project.title}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#8b9894", lineHeight: 1.3, maxWidth: 1000 }}>
            {t(project.tagline, locale)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 56, fontFamily: "monospace" }}>
          {metrics.map((m) => (
            <div key={m.value} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", fontSize: 44, color: "#3ddc84" }}>{m.value}</div>
              <div style={{ display: "flex", fontSize: 18, color: "#56625f", textTransform: "uppercase", letterSpacing: 2 }}>
                {t(m.label, locale)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}

export function renderOgImage(locale: Locale) {
  const { profile } = getContent();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07090a",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e6ebe8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#3ddc84", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}>
          {`● ${profile.shortName} — ${t(profile.role, locale)}`}
        </div>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>
          {t(profile.headline, locale)}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#8b9894", fontFamily: "monospace" }}>
          Next.js → NestJS → PostgreSQL → n8n → AI Agents
        </div>
      </div>
    ),
    ogSize,
  );
}
