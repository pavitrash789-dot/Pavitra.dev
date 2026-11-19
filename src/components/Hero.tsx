"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Layers, Box, CheckCircle } from "lucide-react";
import Hero3DCanvas from "@/components/3d/Hero3DCanvas";
import Mockup3D from "@/components/3d/Mockup3D";
import Tilt3D from "@/components/3d/Tilt3D";

export default function Hero() {
  const [viewMode, setViewMode] = useState<"canvas" | "preview">("canvas");

  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 lg:pt-36">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Copy & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand-2 shadow-[0_0_20px_rgba(139,123,255,0.2)] mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-2 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-2" />
            </span>
            <span>Freelance Web Developer &amp; 3D Specialist · Kota, India</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl lg:leading-[1.12]">
            Create Your Idea of a Website{" "}
            <span className="grad block sm:inline">with My Skills.</span>
          </h1>

          <p className="mt-5 text-xl font-medium text-white/90">
            You imagine it. You choose it. I&apos;ll build it.
          </p>

          <p className="mt-3 max-w-lg text-base leading-relaxed text-white/65">
            From modern business portals and high-converting e-commerce stores to custom interactive
            web applications with bespoke 3D effects, clean code, and blazing performance.
          </p>

          {/* Quick value badges */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-brand-2" /> 100% Mobile Responsive
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-brand-2" /> SEO &amp; Speed Optimized
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-brand-2" /> Supabase &amp; Full-Stack
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#choose" className="btn btn-p group">
              Start Your Project
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a href="#portfolio" className="btn btn-g">
              Explore Selected Work
            </a>
          </div>
        </motion.div>

        {/* Right Column: Interactive 3D Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10"
        >
          {/* View Mode Toggle Pill */}
          <div className="mb-3 flex items-center justify-end">
            <div className="glass inline-flex items-center rounded-full p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("canvas")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-all ${
                  viewMode === "canvas"
                    ? "bg-gradient-to-r from-brand to-brand-2 text-black shadow-md font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
                aria-pressed={viewMode === "canvas"}
              >
                <Box size={13} />
                <span>3D Interactive Core</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-all ${
                  viewMode === "preview"
                    ? "bg-gradient-to-r from-brand to-brand-2 text-black shadow-md font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
                aria-pressed={viewMode === "preview"}
              >
                <Layers size={13} />
                <span>3D Device Mockup</span>
              </button>
            </div>
          </div>

          {/* Interactive Container with 3D Depth */}
          <div className="relative rounded-2xl">
            {viewMode === "canvas" ? (
              <div className="glass relative rounded-2xl border border-white/10 p-2 shadow-[0_0_80px_-20px_rgba(139,123,255,0.4)] overflow-hidden">
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-brand-2 animate-ping" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                    Interactive 3D Engine · Move cursor to rotate
                  </span>
                </div>

                <Hero3DCanvas className="min-h-[380px] md:min-h-[440px]" />

                <div className="absolute bottom-4 inset-x-4 z-20 flex justify-between items-center text-[11px] text-white/40">
                  <span>60 FPS WebGL Perspective</span>
                  <span className="text-brand-2">Drag / Hover to rotate</span>
                </div>
              </div>
            ) : (
              <Mockup3D />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
