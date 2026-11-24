"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Code2, Sparkles, Zap, CheckCircle2, Globe, Cpu } from "lucide-react";

export default function Mockup3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(6);
  const [rotateY, setRotateY] = useState(-10);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -16;
    const rotY = ((x - centerX) / centerX) * 20;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(6);
    setRotateY(-10);
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto py-8 select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Transform Container */}
      <div
        className="relative transition-transform ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transitionDuration: isHovered ? "100ms" : "700ms",
        }}
      >
        {/* Dynamic 3D Cast Shadow */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand/30 to-brand-2/20 blur-2xl transition-opacity duration-500"
          style={{
            transform: `translateZ(-60px) translateY(30px) scale(0.95)`,
            opacity: isHovered ? 0.7 : 0.4,
          }}
        />

        {/* Layer 0: Browser Window Frame */}
        <div
          className="glass rounded-2xl p-5 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Glare specular reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, rgba(139,123,255,0.15) 35%, transparent 70%)`,
            }}
          />

          {/* Browser Header Bar */}
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60">
              <Globe size={11} className="text-brand-2" />
              <span>pavitra.dev/preview/studio</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-white/40">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-2 animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* Main Workspace Preview */}
          <div className="space-y-4">
            {/* Hero Banner Mockup inside window */}
            <div className="relative rounded-xl overflow-hidden p-4 bg-gradient-to-br from-brand/25 via-brand/10 to-brand-2/15 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-brand-2 tracking-wide uppercase">
                    Production Build
                  </span>
                  <h4 className="mt-1 font-display font-bold text-sm text-white">Next-Gen Web Architecture</h4>
                </div>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand to-brand-2 grid place-items-center text-black shadow-md">
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Progress and mini charts */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "Performance", val: "100%", tone: "text-emerald-300" },
                  { label: "SEO Score", val: "100%", tone: "text-brand-2" },
                  { label: "Best Practices", val: "100%", tone: "text-sky-300" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-lg bg-black/40 p-2 border border-white/5">
                    <p className="text-xs text-white/50">{stat.label}</p>
                    <p className={`font-display text-xs font-bold ${stat.tone}`}>{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Content Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-3 border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                  <Cpu size={13} className="text-brand" />
                  <span>Interactive Engine</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand to-brand-2"
                    animate={{ width: ["30%", "85%", "60%", "95%"] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-xs text-white/50">Full-stack dynamic routing & API integration</p>
              </div>

              <div className="rounded-xl bg-white/5 p-3 border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                  <Code2 size={13} className="text-brand-2" />
                  <span>3D Canvas Ready</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-2 to-brand"
                    animate={{ width: ["50%", "92%", "70%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-xs text-white/50">Native 60 FPS WebGL perspective physics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 1: Floating Badge 1 (Top Right, Elevated 3D) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 glass rounded-xl px-3.5 py-2.5 border border-brand/40 shadow-[0_10px_30px_rgba(139,123,255,0.4)] flex items-center gap-2"
          style={{ transform: "translateZ(48px)" }}
        >
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400/20 text-emerald-300">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-emerald-300">Fast & Responsive</p>
            <p className="text-xs font-semibold text-white">Lighthouse 99+</p>
          </div>
        </motion.div>

        {/* Layer 2: Floating Badge 2 (Bottom Left, Elevated 3D) */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.4 }}
          className="absolute -bottom-6 -left-6 glass rounded-xl px-3.5 py-2.5 border border-brand-2/40 shadow-[0_10px_30px_rgba(56,225,198,0.3)] flex items-center gap-2"
          style={{ transform: "translateZ(58px)" }}
        >
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-2/20 text-brand-2">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-brand-2">Modern Stack</p>
            <p className="text-xs font-semibold text-white">Next.js & Supabase</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
