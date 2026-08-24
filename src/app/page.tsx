"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useVelocity,
  useAnimationFrame,
  type MotionValue,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Terminal,
  Smartphone,
  Monitor,
  Server,
  Zap,
  Workflow,
  Database,
  Bot,
  GitBranch,
  Code,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  canOptimizeImage,
  loadPortfolio,
  type Experience,
  type PortfolioData,
  type Project,
  type Skill,
} from "@/lib/portfolio";

// --- CUSTOM HOOKS ---
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- VISUAL COMPONENTS FOR PROJECTS ---

const PhoneMockup = () => (
  <div className="relative w-40 md:w-[200px] h-80 md:h-[400px] bg-neutral-900 rounded-4xl md:rounded-[3rem] border-4 md:border-8 border-neutral-800 shadow-2xl overflow-hidden mx-auto transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-neutral-800 rounded-b-xl z-20" />
    <div className="w-full h-full bg-neutral-900 flex flex-col relative">
      <div className="h-1/2 bg-linear-to-b from-orange-500/20 to-neutral-900 p-4 pt-12">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 mb-4" />
        <div className="w-3/4 h-3 md:h-4 bg-white/20 rounded mb-2" />
        <div className="w-1/2 h-3 md:h-4 bg-white/10 rounded" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 md:h-16 bg-white/5 rounded-xl border border-white/5 flex items-center px-3 gap-3"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-neutral-700" />
            <div className="flex-1">
              <div className="w-16 md:w-20 h-2 bg-white/20 rounded mb-1" />
              <div className="w-10 md:w-12 h-2 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CodeVisual = () => (
  <div className="w-full h-full bg-[#1E1E1E] rounded-xl border border-white/10 p-4 font-mono text-[10px] md:text-xs shadow-2xl flex flex-col">
    <div className="flex gap-2 mb-4 border-b border-white/5 pb-2">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="ml-auto text-neutral-500">extension.ts</span>
    </div>
    <div className="flex-1 overflow-hidden opacity-80 leading-relaxed">
      <span className="text-purple-400">await</span> vscode.window.
      <span className="text-yellow-300">withProgress</span>(
      <br />
      &nbsp;&nbsp;{"{"}
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;location: vscode.ProgressLocation.Notification,
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;title: titles[mode],
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;cancellable:{" "}
      <span className="text-blue-400">true</span>,
      <br />
      &nbsp;&nbsp;{"}"},
      <br />
      &nbsp;&nbsp;<span className="text-purple-400">async</span> (progress,
      token) =&gt; {"{"}
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">try</span> {"{"}
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className="text-green-600">// Passo 1: Buscar arquivos</span>
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;progress.
      <span className="text-yellow-300">report</span>({"{"}
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;message: mode.
      <span className="text-yellow-300">includes</span>(
      <span className="text-orange-300">"en"</span>) ?{" "}
      <span className="text-orange-300">"Scanning files..."</span> :{" "}
      <span className="text-orange-300">"Escaneando arquivos..."</span>,
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"});
      <br />
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className="text-blue-400">const</span> files ={" "}
      <span className="text-purple-400">await</span> vscode.workspace.
      <span className="text-yellow-300">findFiles</span>(
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className="text-orange-300">
        "**/*.{"{"}ts,tsx,js,jsx...{"}"}"
      </span>
      ,
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className="text-orange-300">
        "{"{"}**/node_modules/**,**/dist/**...{"}"}"
      </span>
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;);
      <br />
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className="text-purple-400">if</span>{" "}
      (token.isCancellationRequested) {"{"}
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className="text-purple-400">return</span>;
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
      <br />
    </div>
  </div>
);

const WorkflowVisual = () => (
  <div className="w-full h-full bg-neutral-900 rounded-xl border border-white/10 relative overflow-hidden group min-h-[200px]">
    <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />

    <div className="absolute top-1/2 left-6 md:left-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] z-10">
      <Zap className="text-black" size={20} />
    </div>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.4)] z-10 animate-pulse">
      <Bot className="text-white" size={24} />
    </div>

    <div className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] z-10">
      <Database className="text-white" size={20} />
    </div>

    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <path
        d="M 60 50% H 50% M 50% 50% H calc(100% - 60px)"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="5,5"
        className="opacity-30"
      />
    </svg>

    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-[10px] font-mono border border-white/10">
      n8n Active
    </div>
  </div>
);

const AutomationFlow = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M100 200 H 250" stroke="#333" strokeWidth="2" />
        <path
          d="M350 200 C 400 200, 400 100, 500 100"
          stroke="#333"
          strokeWidth="2"
        />
        <path
          d="M350 200 C 400 200, 400 300, 500 300"
          stroke="#333"
          strokeWidth="2"
        />
        <path d="M600 100 H 700" stroke="#333" strokeWidth="2" />
        <path d="M600 300 H 700" stroke="#333" strokeWidth="2" />

        <circle r="4" fill="#06b6d4">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M100 200 H 250"
          />
        </circle>
        <circle r="4" fill="#8b5cf6">
          <animateMotion
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
            path="M350 200 C 400 200, 400 100, 500 100"
          />
        </circle>
        <circle r="4" fill="#10b981">
          <animateMotion
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
            path="M350 200 C 400 200, 400 300, 500 300"
          />
        </circle>
      </svg>
    </div>
  );
};

// --- COMPONENTES GERAIS ---

const IDE_CODE = `const rafael = {
  role: "Full Stack Developer",
  graduate: "Computer Engineer",
  stack: ["React", "Node", "Python"],
  status: "Coding..."
};`;

const IdeWindow = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const code = codeRef.current;
    if (!host || !code) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      code.textContent = IDE_CODE;
      return;
    }

    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const i = Math.floor((t - t0) / 40);
      code.textContent = IDE_CODE.slice(0, i); // escrita direta: 0 render React
      if (i <= IDE_CODE.length) raf = requestAnimationFrame(tick);
    };

    // Antes eram ~6s de setState a 25/s comecando no mount, em cima da
    // hidratacao/LCP. Agora so roda quando a secao entra em cena.
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      raf = requestAnimationFrame(tick);
    });
    io.observe(host);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="w-full rounded-xl overflow-hidden bg-[#1E1E1E] border border-white/10 shadow-2xl font-mono text-xs md:text-sm"
    >
      <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-black/50">
        <div className="flex gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="ml-4 text-neutral-500 text-[10px] md:text-xs flex items-center gap-2">
          <Code size={10} className="text-blue-400" /> dev.ts
        </div>
      </div>
      <div className="p-4 md:p-6 text-neutral-300">
        <pre>
          <code>
            <span ref={codeRef} />
            <span className="animate-pulse">|</span>
          </code>
        </pre>
      </div>
    </div>
  );
};

const NoiseOverlay = () => (
  // O grao vive num tile 200x200 rasterizado uma vez (ver .noise-overlay em
  // globals.css). Antes era um feTurbulence aplicado a viewport inteira, refeito
  // a cada frame de scroll.
  <div
    aria-hidden
    className="noise-overlay fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
  />
);

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Optimized spring physics for lower latency (snappier feel)
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 500, mass: 0.1 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 500, mass: 0.1 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Only update position on mousemove - minimal overhead
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const next = !!(
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      );
      // Sem o guard, todo mouseover agenda um render.
      setIsHovering((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", checkHover, { passive: true });
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", checkHover);
    };
  }, [mouseX, mouseY]);

  return (
    // Caixa fixa de 16px centrada por margem negativa; o hover cresce via
    // `scale` (composite) em vez de width/height (layout + paint por frame).
    <m.div
      aria-hidden
      className="fixed top-0 left-0 z-100 pointer-events-none hidden md:block mix-blend-difference rounded-full bg-white w-4 h-4 -ml-2 -mt-2"
      style={{ x: smoothX, y: smoothY }}
      animate={{ scale: isHovering ? 4 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
};

const TechBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const MAX_D = 120;
    const MAX_D2 = MAX_D * MAX_D;
    const FRAME_MS = 1000 / 30; // particulas andam 0.3px/frame: 30fps e indistinguivel
    const BUCKETS = 4;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    };
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let lastW = 0;
    let lastH = 0;
    let resizeTimer = 0;

    const initParticles = () => {
      const count = Math.min(Math.round(window.innerWidth * 0.05), 60);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2,
      }));
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // A barra de endereco do mobile colapsa e dispara resize durante o scroll,
      // mudando so a altura. Recriar bitmap + particulas ali causava jank.
      if (w === lastW && Math.abs(h - lastH) < 200) return;
      lastW = w;
      lastH = h;
      canvas.width = w;
      canvas.height = h;
      initParticles();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(6, 182, 212, 0.5)";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Linhas agrupadas por faixa de alpha: 4 stroke() por frame em vez de ~200.
      // Cada stroke() e uma tessellation + draw call separada.
      const buckets: number[][] = [[], [], [], []];
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy; // sqrt so nos pares que realmente conectam
          if (d2 >= MAX_D2) continue;
          const t = 1 - Math.sqrt(d2) / MAX_D;
          const k = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
          buckets[k].push(a.x, a.y, b.x, b.y);
        }
      }
      for (let k = 0; k < BUCKETS; k++) {
        const seg = buckets[k];
        if (!seg.length) continue;
        ctx.strokeStyle = `rgba(6, 182, 212, ${(0.2 * (k + 0.5)) / BUCKETS})`;
        ctx.beginPath();
        for (let m = 0; m < seg.length; m += 4) {
          ctx.moveTo(seg[m], seg[m + 1]);
          ctx.lineTo(seg[m + 2], seg[m + 3]);
        }
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < FRAME_MS) return;
      last = t;
      draw();
    };

    const start = () => {
      if (running || document.hidden || reduced.matches) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onReducedChange = () => {
      stop();
      draw(); // deixa um frame estatico quando o usuario pede menos movimento
      start();
    };

    resize();
    draw();
    start();

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onReducedChange);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 opacity-60"
    />
  );
};

interface VelocityScrollProps {
  baseVelocity?: number;
  scrollY: MotionValue<number>;
  children: React.ReactNode;
}

function VelocityScroll({
  baseVelocity = 100,
  scrollY,
  children,
}: VelocityScrollProps) {
  const baseX = useMotionValue(0);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  // Sem isso o marquee roda para sempre — inclusive durante todo o scroll da
  // secao de projetos, com o About tres telas acima.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      active.current = visible && !document.hidden && !reduced.matches;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useAnimationFrame((t, delta) => {
    if (!active.current) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  return (
    <div
      ref={wrapRef}
      className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap select-none"
    >
      <m.div
        className="font-black uppercase text-4xl md:text-9xl flex flex-nowrap gap-4 md:gap-8 text-neutral-800 tracking-tighter"
        style={{ x }}
      >
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </m.div>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const Section = ({ children, id, className = "" }: SectionProps) => (
  <section
    id={id}
    className={`relative min-h-screen flex flex-col justify-center px-4 md:px-6 py-10 md:py-20 ${className}`}
  >
    {children}
  </section>
);

interface BadgeProps {
  children: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => (
  <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] md:text-sm font-mono tracking-wider uppercase">
    {children}
  </span>
);

interface StickyCardProps extends Project {
  i: number;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

const StickyCard = ({
  i,
  title,
  desc,
  tags,
  gradient,
  visualType,
  customLabel,
  image,
  imageContain,
  repos,
  stats,
  progress,
  range,
  targetScale,
}: StickyCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  const renderVisual = () => {
    if (image) {
      return (
        <Image
          src={image}
          alt={title}
          fill
          // Card = max-w-5xl (1024px); metade direita = md:w-1/2 com p-8 -> 448px.
          // Abaixo de md, coluna unica: largura do card menos p-6.
          sizes="(min-width: 1080px) 448px, (min-width: 768px) calc(50vw - 88px), calc(100vw - 80px)"
          unoptimized={!canOptimizeImage(image)}
          className={`rounded-xl shadow-2xl ${
            imageContain ? "object-contain" : "object-cover object-top"
          }`}
        />
      );
    }

    switch (visualType) {
      case "mobile":
        return <PhoneMockup />;
      case "backend":
        return <CodeVisual />;
      case "automation":
        return <WorkflowVisual />;
      default:
        return (
          <div
            className={`w-full h-full bg-linear-to-br ${gradient} opacity-20`}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen md:h-screen sticky top-0 flex items-center justify-center py-4 md:py-0"
      // Offset da pilha vive no wrapper estatico. Mantem o `style` do motion com
      // apenas `scale`, para o framer-motion escrever so `transform` por frame.
      style={
        { "--card-offset": `calc(-5vh + ${i * 25}px)` } as React.CSSProperties
      }
    >
      <m.div
        style={{ scale }}
        className="relative top-[var(--card-offset)] flex flex-col-reverse md:flex-row w-full max-w-5xl min-h-[500px] md:h-[500px] rounded-3xl border border-white/10 bg-neutral-900 overflow-hidden origin-top shadow-2xl md:will-change-transform"
      >
        <div className="relative w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between z-10 bg-neutral-900 border-t md:border-t-0 md:border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {visualType === "mobile" && (
                <Smartphone size={20} className="text-orange-400" />
              )}
              {visualType === "backend" && (
                <Terminal size={20} className="text-blue-400" />
              )}
              {visualType === "automation" && (
                <Workflow size={20} className="text-purple-400" />
              )}
              <span className="text-xs md:text-sm font-mono text-neutral-500 uppercase tracking-widest">
                {customLabel || `${visualType} Project`}
              </span>
            </div>
            <h3 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-4 md:mb-6">
              {title}
            </h3>
            <p className="text-sm md:text-lg text-neutral-300 leading-relaxed mb-6">
              {desc}
            </p>

            {repos && repos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {repos.map((repo, idx) => (
                  <a
                    key={idx}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs md:text-sm font-medium text-white transition-colors"
                  >
                    <Github size={14} />
                    {repo.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4 mb-6 md:mb-8">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-lg md:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-xs text-neutral-500 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, k) => (
                <span
                  key={k}
                  className="px-2 py-1 md:px-3 md:py-1 rounded bg-white/5 text-neutral-300 text-[10px] md:text-xs border border-white/5 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 bg-black/20 p-6 md:p-8 flex items-center justify-center overflow-hidden group min-h-[250px] md:min-h-0">
          <div
            className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-700`}
          />
          <div className="relative w-full h-full max-h-[350px] transform group-hover:scale-105 transition-transform duration-700">
            {renderVisual()}
          </div>
        </div>
      </m.div>
    </div>
  );
};

const SpotlightCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);
  const rect = useRef<DOMRect | null>(null);
  const next = useRef({ x: 0, y: 0 });

  const flush = () => {
    rafId.current = 0;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot-x", `${next.current.x}px`);
    el.style.setProperty("--spot-y", `${next.current.y}px`);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = rect.current;
    if (!r) return;
    next.current.x = e.clientX - r.left;
    next.current.y = e.clientY - r.top;
    // Coalesce em uma escrita por frame, sem passar pelo React.
    if (!rafId.current) rafId.current = requestAnimationFrame(flush);
  };

  const onEnter = () => {
    const el = ref.current;
    if (!el) return;
    rect.current = el.getBoundingClientRect(); // 1 leitura por entrada, nao por pixel
    el.style.setProperty("--spot-o", "1");
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--spot-o", "0");
    rect.current = null;
  };

  useEffect(() => {
    // O card se move sob o cursor durante o scroll, invalidando o rect cacheado.
    const invalidate = () => {
      if (rect.current && ref.current)
        rect.current = ref.current.getBoundingClientRect();
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={`spotlight relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-8 ${className}`}
    >
      <div className="spotlight__glow pointer-events-none absolute -inset-px" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Hero = ({ scrollY }: { scrollY: MotionValue<number> }) => {
  const y1 = useTransform(scrollY, [0, 500], [0, 50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const scrollHintOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden py-20 px-4">
      <div className="z-10 text-center w-full max-w-7xl">
        <m.div
          style={{ y: y2 }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge>Full Stack Developer</Badge>
          </m.div>

          <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-extrabold tracking-tighter leading-[0.9] text-white mix-blend-lighten">
            RAFAEL <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-neutral-200 to-neutral-600">
              DEGOLIN
            </span>
          </h1>

          <div className="h-px w-16 md:w-24 bg-linear-to-r from-transparent via-cyan-500 to-transparent my-4 md:my-6" />

          <p className="text-neutral-400 text-2xl md:text-2xl font-light max-w-3xl tracking-tight px-4">
            Desenvolvedor Full Stack & Engenheiro da Computação.{" "}
            <br className="hidden md:block" />
            Criando ecossistemas digitais completos potencializados por{" "}
            <span className="text-cyan-400 font-medium">automação</span>.
          </p>
        </m.div>

        <m.div
          style={{ y: y1 }}
          className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center pb-10 w-full max-w-md mx-auto sm:max-w-none"
        >
          <a
            href="#projetos"
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors duration-300 text-center"
          >
            Ver Soluções
          </a>
          <a
            href="https://www.linkedin.com/in/rafaeldegolin/"
            target="_blank"
            className="px-8 py-4 text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors duration-300 text-center"
          >
            LinkedIn
          </a>
        </m.div>
      </div>

      <m.div
        style={{ opacity: scrollHintOpacity }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="h-8 md:h-12 w-px bg-linear-to-b from-cyan-500 to-transparent" />
      </m.div>
    </section>
  );
};

const About = ({ scrollY }: { scrollY: MotionValue<number> }) => {
  return (
    <section id="sobre" className="py-10 md:py-32 relative">
      <div className="mb-10 md:mb-20">
        <VelocityScroll baseVelocity={-1} scrollY={scrollY}>
          FULL STACK DEVELOPER • REACT • NODE.JS • PYTHON •
        </VelocityScroll>
        <VelocityScroll baseVelocity={1} scrollY={scrollY}>
          AUTOMATION • N8N • AI AGENTS • ARCHITECTURE •
        </VelocityScroll>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 md:gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Desenvolvimento Full Stack <br />
            <span className="text-neutral-500">de ponta a ponta.</span>
          </h2>
          <div className="space-y-4 md:space-y-6 text-base md:text-lg text-neutral-400 leading-relaxed">
            <p>
              Sou <strong>Rafael Degolin</strong>, Desenvolvedor Full Stack e
              Engenheiro da Computação. Minha paixão é arquitetar e construir
              softwares completos que resolvem problemas reais de negócio.
            </p>
            <p>
              Com experiência sólida em <strong>Frontend</strong> (React,
              Next.js) e <strong>Backend</strong> (Node.js, Python), crio
              aplicações robustas e escaláveis. Além disso, utilizo meu
              conhecimento em <strong>Automação (n8n, IA)</strong> para eliminar
              ineficiências.
            </p>
            <p>
              Atualmente na <strong>Pronix</strong>, lidero iniciativas
              tecnológicas que transformam operação em vantagem competitiva.
            </p>
          </div>
        </div>
        <div className="relative w-full">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <IdeWindow />
          </div>
        </div>
      </div>
    </section>
  );
};

const Career = ({ override }: { override?: Experience[] }) => {
  const experiences: Experience[] = override ?? [
    {
      company: "Pronix",
      role: "Full Stack Developer",
      period: "Ago 2025 - Momento",
      description:
        "Atuando no novo setor de tecnologia, transformando operações internas em ecossistemas digitais de alta performance.",
      achievements: [
        "Arquitetura full-stack (Next.js + NestJS) para centralização de gestão.",
        "Dashboard de métricas integrado à API do Mercado Livre.",
        "Automação de contratos e CRM com N8N e Agentes de IA.",
        "Treinamento de equipes para adoção de fluxos com IA.",
      ],
      techs: ["Next.js", "NestJS", "PostgreSQL", "N8N", "AI Agents"],
    },
    {
      company: "Pronix",
      role: "Especialista em Olist ERP",
      period: "Out 2024 - Ago 2025",
      description:
        "Otimização operacional e implementação estratégica de ERP, focando em escalabilidade e organização de dados.",
      achievements: [
        "Implementação e organização de produtos no Olist ERP.",
        "Treinamento de clientes para uso eficiente da plataforma.",
        "Criação de dashboards e KPIs para agilizar a operação diária.",
      ],
      techs: ["ERP", "Gestão de Projetos", "Análise de Dados"],
    },
    {
      company: "Motorola Mobility",
      role: "QA Tester & Dogfooding",
      period: "Jan 2022 - Set 2024",
      description:
        "Garantia de qualidade em escala global, liderando testes de protótipos e assegurando a excelência de software.",
      achievements: [
        "Gestão de centenas de protótipos em programas de Dogfooding.",
        "QA Tester em app Android e portal web de uso interno.",
        "Redução significativa de bugs em lançamentos globais.",
        "Aumento da produtividade do time através de metodologias ágeis.",
      ],
      techs: [
        "QA",
        "Android",
        "Java/Kotlin",
        "MySQL",
        "Scrum",
        "Jira",
        "Dogfooding",
      ],
    },
  ];

  return (
    <Section id="career" className="relative">
      <div className="max-w-7xl mx-auto w-full relative z-10 px-4">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6">
            Trajetória Profissional
          </h2>
          <p className="text-neutral-400 text-lg">
            Evolução constante: de grandes corporações a startups ágeis,
            transformando problemas complexos em soluções tecnológicas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 relative">
          {/* Linha conectora vertical para desktop */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 hidden md:block" />

          {experiences.map((exp, i) => (
            <m.div
              key={`${exp.company}-${exp.period}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`relative flex flex-col md:flex-row gap-8 ${
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Ponto na timeline */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] md:-translate-x-1/2 top-8 z-20 hidden md:block" />
              <div className="w-full md:w-1/2">
                <SpotlightCard
                  className={`h-full border-l-4 ${
                    i === 0
                      ? "border-l-cyan-400"
                      : i === 1
                        ? "border-l-purple-400"
                        : "border-l-orange-400"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge>{exp.period}</Badge>
                      <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        {exp.company}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                      {exp.role}
                    </h3>
                    <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
                      {exp.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {exp.achievements.map((item, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/50 shrink-0" />
                          <span className="text-neutral-300 text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {exp.techs.map((tech, t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-[10px] font-mono text-white/40 bg-white/5 rounded border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </div>
              <div className="hidden md:block w-1/2" />{" "}
              {/* Espaço vazio para manter o grid */}
            </m.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Projects = ({ override }: { override?: Project[] }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects: Project[] = override ?? [
    {
      title: "Fala Facilitada",
      desc: "App de Comunicação Alternativa (PECS) para autismo. 100% offline-first, garantindo voz e autonomia para quem precisa, em qualquer lugar.",
      tags: ["React Native", "Expo", "TypeScript", "Offline-First"],
      gradient: "from-orange-500 to-amber-500",
      visualType: "mobile",
      customLabel: "Mobile App • TCC",
      stats: [
        { value: "100%", label: "Offline" },
        { value: "Acessível", label: "Inclusivo" },
      ],
    },
    {
      title: "Pronix Hub",
      desc: "O sistema nervoso central do Pronix. ERP Full Stack que unifica CRM, financeiro e jornada do cliente em uma experiência fluida e personalizada.",
      tags: ["Next.js", "NestJS", "PostgreSQL", "Zustand"],
      gradient: "from-blue-600 to-indigo-600",
      visualType: "backend",
      customLabel: "Full Stack Ecosystem",
      image: "/projects/vdv-hub.png",
      stats: [
        { value: "360°", label: "Gestão" },
        { value: "Centralized", label: "Data Source" },
      ],
    },
    {
      title: "Miu Controle",
      desc: "Finanças pessoais sem fricção. Unindo App Mobile e Web com IA preditiva para transformar a saúde financeira em menos de 5 segundos.",
      tags: ["NestJS", "Redis", "Predictive AI", "Mobile & Web"],
      gradient: "from-emerald-500 to-teal-500",
      visualType: "automation",
      customLabel: "Full Stack + Mobile",
      image: "/projects/miu-controle.png",
      repos: [
        {
          name: "Backend",
          url: "https://github.com/Rafadegolin/miu-controle-backend",
        },
        {
          name: "Frontend",
          url: "https://github.com/Rafadegolin/miu-controle-frontend",
        },
      ],
      stats: [
        { value: "-93%", label: "Latência" },
        { value: "< 5s", label: "Registro" },
      ],
    },
    {
      title: "VS Code AI Suite",
      desc: "Power tools para DX. 'Project Architect' para análise estrutural e 'GitIssue Bridge' para conectar issues ao código.",
      tags: ["TypeScript", "VS Code API", "OpenAI", "AST"],
      gradient: "from-purple-600 to-fuchsia-600",
      visualType: "backend",
      customLabel: "DevTools & AI Engineering",
      repos: [
        {
          name: "Project Architect",
          url: "https://github.com/Rafadegolin/project-architect-ai",
        },
        {
          name: "GitIssue Bridge",
          url: "https://github.com/Rafadegolin/gitIssue-bridge",
        },
      ],
      stats: [
        { value: "2", label: "Extensions" },
        { value: "AI-Powered", label: "Analysis" },
      ],
    },
    {
      title: "AI SDR Agent",
      desc: "SDR 100% autônomo. Recupera leads, agenda reuniões e gera contratos automaticamente. Uma máquina de vendas que nunca dorme.",
      tags: ["n8n", "Supabase", "Redis", "LLMs"],
      gradient: "from-yellow-500 to-orange-600",
      visualType: "automation",
      customLabel: "AI Agent • Automation",
      image: "/projects/ai-sdr.png",
      stats: [
        { value: "Auto", label: "Recovery" },
        { value: "End-to-End", label: "Sales" },
      ],
    },
  ];

  return (
    <section ref={container} id="projetos" className="relative pt-10">
      <div className="py-10 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-7xl font-bold text-white mb-10 md:mb-20 text-center">
          Alguns Projetos
        </h2>
        {projects.map((project, i) => {
          // `last` = quantos cards ainda pousam por cima deste. O passo deriva do
          // total, senao a API devolvendo != 5 projetos gera range decrescente.
          const last = Math.max(1, projects.length - 1);
          const targetScale = Math.max(0.6, 1 - (last - i) * 0.05);
          return (
            <StickyCard
              key={project.title}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i / last, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};

const Skills = ({ override }: { override?: Skill[] }) => {
  const skills: Skill[] = override ?? [
    {
      icon: Monitor,
      title: "Frontend Engineering",
      desc: "Criação de interfaces imersivas com foco em performance, acessibilidade e animações fluidas.",
      tags: [
        "React",
        "Next.js 14",
        "TypeScript",
        "Tailwind",
        "Framer Motion",
        "Three.js",
      ],
    },
    {
      icon: Server,
      title: "Backend Architecture",
      desc: "Sistemas robustos e escaláveis, desenhados para alta disponibilidade e processamento de dados em tempo real.",
      tags: [
        "Node.js",
        "Python",
        "NestJS",
        "Serverless",
        "GraphQL",
        "REST APIs",
      ],
    },
    {
      icon: Database,
      title: "Database & DevOps",
      desc: "Gestão de dados segura e infraestrutura automatizada para deploy contínuo e monitoramento.",
      tags: ["PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "CI/CD"],
    },
    {
      icon: Bot,
      title: "Automation & AI",
      desc: "Orquestração de fluxos inteligentes que conectam sistemas e reduzem trabalho manual através de IA.",
      tags: ["n8n", "OpenAI API", "LangChain", "Webhooks", "RPA", "AI Agents"],
    },
  ];

  return (
    <Section className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden md:block">
        <AutomationFlow />
      </div>
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-16 md:text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6">
            Arsenal Tecnológico
          </h2>
          <p className="text-neutral-400 text-lg">
            Uma combinação estratégica de ferramentas modernas para construir
            soluções que não apenas funcionam, mas escalam e impressionam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {skills.map((skill, i) => (
            <SpotlightCard key={skill.title} className="h-full">
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-cyan-400 border border-white/10">
                  <skill.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {skill.title}
                </h3>
                <p className="text-neutral-400 mb-6 grow">{skill.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {skill.tags.map((tag, t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs font-mono text-cyan-200 bg-cyan-900/20 border border-cyan-500/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Contact = () => (
  <section
    id="contato"
    className="min-h-[60vh] flex items-center justify-center relative overflow-hidden py-20"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
    <div className="relative z-10 text-center px-4 md:px-6">
      <h2 className="text-6xl md:text-9xl font-bold text-white mb-6 md:mb-14 tracking-tighter">
        Vamos construir <br /> o futuro?
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
        <a
          href="https://www.linkedin.com/in/rafaeldegolin/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors w-full sm:w-auto justify-center"
        >
          <Linkedin size={20} /> LinkedIn
        </a>
        <a
          href="https://github.com/Rafadegolin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
        >
          <Github size={20} /> GitHub
        </a>
      </div>
      <div className="mt-10 md:mt-20 text-neutral-500 font-mono flex items-center gap-2 justify-center text-xs md:text-sm">
        <Terminal size={12} /> RAFAEL DEGOLIN DA SILVA
      </div>
    </div>
  </section>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Um unico useScroll global: cada instancia re-mede o DOM a cada evento de
  // scroll, para todos os handlers registrados no mesmo container.
  const { scrollY } = useScroll();
  // Conteúdo gerenciado no Proposa (API pública). Sem API/erro → mantém o
  // conteúdo padrão embutido nas seções.
  const [portfolio, setPortfolio] = useState<Partial<PortfolioData> | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    loadPortfolio().then((data) => {
      if (active && data) setPortfolio(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <NoiseOverlay />
        <CustomCursor />
        <div className="bg-neutral-950 text-white selection:bg-cyan-500/30 selection:text-white relative">
          <TechBackground />

          {/* Navbar Responsiva */}
          <nav className="fixed top-0 w-full z-40 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center mix-blend-difference">
            <span className="font-bold tracking-tighter text-lg md:text-xl flex items-center gap-1">
              <GitBranch size={18} /> RD.
            </span>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a
                href="#sobre"
                onClick={handleScroll}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                SOBRE
              </a>
              <a
                href="#career"
                onClick={handleScroll}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                TRAJETÓRIA
              </a>
              <a
                href="#projetos"
                onClick={handleScroll}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                SOLUÇÕES
              </a>
              <a
                href="#contato"
                onClick={handleScroll}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                CONTATO
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-30 bg-black/95 flex flex-col items-center justify-center gap-8 text-xl font-bold md:hidden"
              >
                <a
                  href="#sobre"
                  onClick={handleScroll}
                  className="text-white hover:text-cyan-400"
                >
                  SOBRE
                </a>
                <a
                  href="#career"
                  onClick={handleScroll}
                  className="text-white hover:text-cyan-400"
                >
                  TRAJETÓRIA
                </a>
                <a
                  href="#projetos"
                  onClick={handleScroll}
                  className="text-white hover:text-cyan-400"
                >
                  SOLUÇÕES
                </a>
                <a
                  href="#contato"
                  onClick={handleScroll}
                  className="text-white hover:text-cyan-400"
                >
                  CONTATO
                </a>
              </m.div>
            )}
          </AnimatePresence>

          <main>
            <Hero scrollY={scrollY} />
            <About scrollY={scrollY} />
            <Skills override={portfolio?.skills} />
            <Career override={portfolio?.experiences} />
            <Projects override={portfolio?.projects} />
            <Contact />
          </main>
          <footer className="py-6 text-center text-neutral-600 text-[10px] md:text-xs uppercase tracking-widest border-t border-white/5 bg-neutral-950">
            © {new Date().getFullYear()} Rafael Degolin da Silva. Full Stack
            Engineering.
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
