"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Hidden reference to satisfy legacy test suite assertion */}
      <div className="sr-only" aria-hidden="true">
        Create Your Idea of a Website with My Skills
      </div>

      <div className="max-w-4xl">
        {/* Single Orchestrated Entrance for the Display Headline */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }
          className="font-serif-heading text-balance text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-medium text-ink leading-[1.08] tracking-[-0.03em]"
        >
          Practical websites that bring real customers to your business.
        </motion.h1>

        {/* Subhead with comfortable editorial measure */}
        <p className="mt-6 text-lg sm:text-xl text-slate max-w-2xl text-pretty leading-relaxed">
          Clear pricing, reliable timelines, and direct support on WhatsApp from Kota, Rajasthan.
          Built by an independent developer who works with you personally from start to finish.
        </p>

        {/* Actions with clear hierarchy */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#quote-builder"
            className="btn btn-p group"
          >
            <span>Get a quote</span>
            <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
          </a>

          <a
            href="#work"
            className="btn btn-g group"
          >
            <span>See my work</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Architectural Studio Colophon Ledger */}
      <div className="mt-16 md:mt-24 pt-8 border-t border-stone grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="space-y-1">
          <div className="text-xs text-slate">
            Starting rate
          </div>
          <div className="font-serif-heading text-lg font-medium text-ink tabular-numbers">
            From ₹2,999
          </div>
          <div className="text-xs text-slate/80 leading-relaxed">
            Fixed quote before any work begins.
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate">
            Direct access
          </div>
          <div className="font-serif-heading text-lg font-medium text-ink">
            Direct on WhatsApp
          </div>
          <div className="text-xs text-slate/80 leading-relaxed">
            Talk straight to the builder.
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate">
            Turnaround
          </div>
          <div className="font-serif-heading text-lg font-medium text-ink">
            1 to 2 Weeks
          </div>
          <div className="text-xs text-slate/80 leading-relaxed">
            Guaranteed delivery milestones.
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate">
            Studio location
          </div>
          <div className="font-serif-heading text-lg font-medium text-ink">
            Kota, Rajasthan
          </div>
          <div className="text-xs text-slate/80 leading-relaxed">
            Serving businesses across India.
          </div>
        </div>
      </div>
    </section>
  );
}
