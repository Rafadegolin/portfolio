"use client";

import { useEffect } from "react";

/**
 * Pausa as animações (LEDs, pacotes, cursor) de qualquer [data-motion] que
 * esteja fora da tela, marcando-o com data-paused. Um único observer na página.
 */
export function InViewPauser() {
  useEffect(() => {
    const targets = document.querySelectorAll<Element>("[data-motion]");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          if (entry.isIntersecting) el.removeAttribute("data-paused");
          else el.setAttribute("data-paused", "");
          // Animações SMIL (pacotes dos diagramas) não respeitam CSS: pausa direto no SVG.
          const svgs = el instanceof SVGSVGElement ? [el] : Array.from(el.querySelectorAll("svg"));
          for (const svg of svgs) {
            if (entry.isIntersecting && !reduced) svg.unpauseAnimations();
            else svg.pauseAnimations();
          }
        }
      },
      { rootMargin: "100px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
