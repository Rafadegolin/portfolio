"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  Globe,
  Terminal,
  Layers,
  Smartphone,
  Monitor,
  Cpu,
  Download,
  Send,
  MapPin,
  Server,
  Code2,
  Zap,
  MousePointer2,
  Workflow,
  Database,
  Bot,
  Play,
  FileJson,
  GitBranch,
  ArrowUpRight,
  CheckCircle2,
  Boxes,
  Code,
  Menu,
  X,
} from "lucide-react";

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
      <span className="ml-auto text-neutral-500">server.ts</span>
    </div>
    <div className="flex-1 overflow-hidden opacity-80">
      <span className="text-purple-400">import</span> {"{"}{" "}
      <span className="text-blue-400">ERP_Sync</span> {"}"}{" "}
      <span className="text-purple-400">from</span>{" "}
      <span className="text-orange-300">&apos;./services&apos;</span>;
      <br />
      <br />
      <span className="text-purple-400">async function</span>{" "}
      <span className="text-yellow-300">syncData</span>() {"{"}
      <br />
      &nbsp;&nbsp;
      <span className="text-neutral-400">// Legacy system fetch</span>
      <br />
      &nbsp;&nbsp;<span className="text-blue-400">const</span> data ={" "}
      <span className="text-purple-400">await</span> ERP.
      <span className="text-yellow-300">fetch</span>();
      <br />
      <br />
      &nbsp;&nbsp;<span className="text-purple-400">if</span> (data.
      <span className="text-blue-400">len</span> &gt;{" "}
      <span className="text-green-300">1k</span>) {"{"}
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">
        await
      </span>{" "}
      <span className="text-yellow-300">queue</span>(data);
      <br />
      &nbsp;&nbsp;{"}"}
      <br />
      &nbsp;&nbsp;<span className="text-blue-400">console</span>.
      <span className="text-yellow-300">log</span>(
      <span className="text-green-300">&quot;Done 🚀&quot;</span>);
      <br />
      {"}"}
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

const IdeWindow = () => {
  const [code, setCode] = useState("");
  const fullCode = `const rafael = {
  role: "Full Stack Developer",
  graduate: "Computer Engineer",
  stack: ["React", "Node", "Python"],
  status: "Coding..."
};`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCode(fullCode.substring(0, i));
      i++;
      if (i > fullCode.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#1E1E1E] border border-white/10 shadow-2xl font-mono text-xs md:text-sm">
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
            {code}
            <span className="animate-pulse">|</span>
          </code>
        </pre>
      </div>
    </div>
  );
};

const NoiseOverlay = () => (
  <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.80"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      setIsHovering(
        !!(
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a")
        )
      );
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-100 pointer-events-none hidden md:block mix-blend-difference rounded-full bg-white"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: isHovering ? "-32px" : "-8px",
        translateY: isHovering ? "-32px" : "-8px",
      }}
      animate={{ width: isHovering ? 64 : 16, height: isHovering ? 64 : 16 }}
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
    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(window.innerWidth * 0.05, 60);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.5)";
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${
              0.2 * (1 - distance / 120)
            })`;
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    window.addEventListener("resize", resize);
    resize();
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-60" />;
};

interface VelocityScrollProps {
  baseVelocity?: number;
  children: React.ReactNode;
}

function VelocityScroll({ baseVelocity = 100, children }: VelocityScrollProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
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
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap select-none">
      <motion.div
        className="font-black uppercase text-4xl md:text-9xl flex flex-nowrap gap-4 md:gap-8 text-neutral-800 tracking-tighter"
        style={{ x }}
      >
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
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

interface StickyCardProps {
  i: number;
  title: string;
  desc: string;
  tags: string[];
  gradient: string;
  type: string;
  stats: Array<{ value: string; label: string }>;
  progress: any;
  range: number[];
  targetScale: number;
}

const StickyCard = ({
  i,
  title,
  desc,
  tags,
  gradient,
  type,
  stats,
  progress,
  range,
  targetScale,
}: StickyCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  const renderVisual = () => {
    switch (type) {
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
    <div className="min-h-screen md:h-screen sticky top-0 flex items-center justify-center mb-0 px-0 md:px-0 py-4 md:py-0">
      <motion.div
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
        className={`relative flex flex-col-reverse md:flex-row w-full max-w-5xl min-h-[500px] md:h-[500px] rounded-3xl border border-white/10 bg-neutral-900 overflow-hidden origin-top shadow-2xl`}
      >
        <div className="relative w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between z-10 bg-neutral-900/50 backdrop-blur-sm border-t md:border-t-0 md:border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {type === "mobile" && (
                <Smartphone size={20} className="text-orange-400" />
              )}
              {type === "backend" && (
                <Terminal size={20} className="text-blue-400" />
              )}
              {type === "automation" && (
                <Workflow size={20} className="text-purple-400" />
              )}
              <span className="text-xs md:text-sm font-mono text-neutral-500 uppercase tracking-widest">
                {type} Project
              </span>
            </div>
            <h3 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-4 md:mb-6">
              {title}
            </h3>
            <p className="text-sm md:text-lg text-neutral-300 leading-relaxed mb-6">
              {desc}
            </p>
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
      </motion.div>
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
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden py-20 px-4">
      <div className="z-10 text-center w-full max-w-7xl">
        <motion.div
          style={{ y: y2 }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge>Full Stack Developer</Badge>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-extrabold tracking-tighter leading-[0.9] text-white mix-blend-lighten">
            RAFAEL <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-neutral-200 to-neutral-600">
              DEGOLIN
            </span>
          </h1>

          <div className="h-px w-16 md:w-24 bg-linear-to-r from-transparent via-cyan-500 to-transparent my-4 md:my-6" />

          <p className="text-neutral-400 text-sm md:text-2xl font-light max-w-3xl tracking-tight px-4">
            Desenvolvedor Full Stack & Engenheiro da Computação.{" "}
            <br className="hidden md:block" />
            Criando ecossistemas digitais completos potencializados por{" "}
            <span className="text-cyan-400 font-medium">automação</span>.
          </p>
        </motion.div>

        <motion.div
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
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="h-8 md:h-12 w-px bg-linear-to-b from-cyan-500 to-transparent" />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="sobre" className="py-10 md:py-32 relative">
      <div className="mb-10 md:mb-20">
        <VelocityScroll baseVelocity={-1}>
          FULL STACK DEVELOPER • REACT • NODE.JS • PYTHON •
        </VelocityScroll>
        <VelocityScroll baseVelocity={1}>
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
              Atualmente no <strong>VDV Group</strong>, lidero iniciativas
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

const Projects = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = [
    {
      title: "Field Ops Mobile App",
      desc: "App Full Stack (React Native + Node.js) para equipes de campo. Inclui sincronização offline-first e painel administrativo web para gestão em tempo real.",
      tags: ["React Native", "Node.js", "PostgreSQL", "Supabase"],
      gradient: "from-orange-500 to-red-600",
      type: "mobile",
      stats: [
        { value: "Offline", label: "Capability" },
        { value: "Full Stack", label: "Architecture" },
      ],
    },
    {
      title: "ERP Integration Hub",
      desc: "Sistema Backend robusto conectando múltiplos ERPs. Arquitetura de microsserviços para processamento massivo de dados de vendas e estoque.",
      tags: ["Python", "Node.js", "SQL", "Redis"],
      gradient: "from-blue-600 to-cyan-500",
      type: "backend",
      stats: [
        { value: "500k+", label: "Transações/Mês" },
        { value: "Scalable", label: "Backend" },
      ],
    },
    {
      title: "AI Automation Platform",
      desc: "Plataforma interna para orquestração de fluxos de trabalho. Interface React para controle de agentes de IA e backend Python para processamento lógico.",
      tags: ["React", "Python", "n8n", "OpenAI"],
      gradient: "from-purple-600 to-pink-500",
      type: "automation",
      stats: [
        { value: "40h", label: "Tempo Salvo/Semana" },
        { value: "End-to-End", label: "Solution" },
      ],
    },
  ];

  return (
    <section ref={container} id="projetos" className="relative pt-10">
      <div className="py-10 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-7xl font-bold text-white mb-10 md:mb-20 text-center">
          Projetos Full Stack
        </h2>
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <StickyCard
              key={i}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};

const Skills = () => {
  const skills = [
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
            <SpotlightCard key={i} className="h-full">
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
      <h2 className="text-4xl md:text-9xl font-bold text-white mb-6 md:mb-14 tracking-tighter">
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
    <>
      <NoiseOverlay />
      <CustomCursor />
      <div className="bg-neutral-950 text-white selection:bg-cyan-500/30 selection:text-white relative">
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
        <TechBackground />

        {/* Navbar Responsiva */}
        <nav className="fixed top-0 w-full z-40 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center mix-blend-difference backdrop-blur-sm md:backdrop-blur-none">
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
            <motion.div
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
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <footer className="py-6 text-center text-neutral-600 text-[10px] md:text-xs uppercase tracking-widest border-t border-white/5 bg-neutral-950">
          © {new Date().getFullYear()} Rafael Degolin da Silva. Full Stack
          Engineering.
        </footer>
      </div>
    </>
  );
}
