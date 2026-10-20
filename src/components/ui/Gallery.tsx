"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export type GalleryImage = { src: string; alt: string; caption: string };

type Labels = { open: string; close: string; prev: string; next: string };

/** Grade de telas; clicar abre em tela cheia (<dialog> nativo: Esc fecha, ←/→ navegam). */
export function Gallery({ images, labels }: { images: GalleryImage[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const img = images[current];

  const open = (i: number) => {
    setCurrent(i);
    dialog.current?.showModal();
  };
  const step = (delta: number) => setCurrent((i) => (i + delta + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2">
        {images.map((image, i) => (
          <figure key={image.src} className={i === 0 ? "md:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`${labels.open} ${i + 1}`}
              className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden border border-line bg-raised transition-colors hover:border-accent"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={i === 0}
                sizes={i === 0 ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 600px, 100vw"}
                className="object-contain"
              />
              <span
                aria-hidden
                className="absolute right-2 top-2 border border-line bg-bg/80 p-1.5 text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Maximize2 className="size-3.5" />
              </span>
            </button>
            {image.caption && (
              <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label={img?.alt}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-fg backdrop:bg-bg/90 backdrop:backdrop-blur-sm"
      >
        {img && (
          <div className="flex h-dvh w-screen flex-col items-center justify-center gap-3 p-4 sm:p-10">
            <div className="relative h-full max-h-[80dvh] w-full max-w-6xl">
              <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex w-full max-w-6xl items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <span className="tabular">
                {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                {img.caption && <span className="ml-3 text-fg">{img.caption}</span>}
              </span>
              <span className="flex gap-2">
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className="border border-line p-2 hover:border-accent hover:text-accent">
                      <ChevronLeft className="size-4" aria-hidden />
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label={labels.next} className="border border-line p-2 hover:border-accent hover:text-accent">
                      <ChevronRight className="size-4" aria-hidden />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  aria-label={labels.close}
                  autoFocus
                  className="border border-line p-2 hover:border-accent hover:text-accent"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </span>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
