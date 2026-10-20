import { ImageResponse } from "next/og";
import { getContent, t, type Locale } from "@/content";

export const ogSize = { width: 1200, height: 630 };

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
