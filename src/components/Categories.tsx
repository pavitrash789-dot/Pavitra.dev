"use client";
import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { categories } from "@/lib/site";
import { useDraft } from "@/lib/store";
import { formatINR } from "@/lib/pricing";
import Tilt3D from "@/components/3d/Tilt3D";

export default function Categories() {
  const { d, set } = useDraft();

  const pick = (id: string) => {
    set({ category: id, features: [], step: 1 });
    setTimeout(() => {
      document.getElementById("customize")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <section id="choose" className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-2">
            Step 1 · Foundation
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold md:text-5xl">
            Choose your <span className="grad">website type</span>
          </h2>
          <p className="mt-2 text-white/60">
            Pick the closest match to begin. You can customize every page, feature, and style in the next step.
          </p>
        </div>
        <div className="text-xs text-white/40">
          Interactive 3D Cards · Hover to inspect
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const Icon = (Icons as any)[c.icon] ?? Icons.Globe;
          const isSelected = d.category === c.id;

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              className="h-full"
            >
              <Tilt3D
                maxAngle={14}
                scale={1.03}
                glare={true}
                className={`card h-full p-6 flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? "!border-brand ring-2 ring-brand/40 shadow-[0_0_40px_rgba(139,123,255,0.4)]"
                    : "hover:border-white/20"
                }`}
                onClick={() => pick(c.id)}
              >
                <div>
                  {/* Top Row: 3D Pop Icon & Selected Indicator */}
                  <div className="mb-5 flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/30 to-brand-2/20 text-white shadow-inner border border-white/10">
                      <Icon size={24} className="text-brand-2" />
                    </div>
                    {isSelected && (
                      <span className="rounded-full bg-brand/20 border border-brand/50 px-2.5 py-1 text-xs font-semibold text-brand">
                        Selected ✓
                      </span>
                    )}
                  </div>

                  {/* Title & Description with 3D elevation */}
                  <div style={{ transform: "translateZ(20px)" }}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl font-bold tracking-tight text-white">
                        {c.name}
                      </h3>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-2/15 border border-brand-2/30 px-2.5 py-1 text-xs font-bold text-brand-2 shadow-sm">
                      Starting From {formatINR(c.startingPrice)}
                    </div>
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5" style={{ transform: "translateZ(15px)" }}>
                    {c.ex.map((e) => (
                      <span
                        key={e}
                        className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/70"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button with 3D elevation */}
                <div className="mt-6 pt-4 border-t border-white/5" style={{ transform: "translateZ(25px)" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      pick(c.id);
                    }}
                    className={`btn w-full justify-center !py-2.5 text-sm font-semibold transition-all ${
                      isSelected ? "btn-p" : "btn-g"
                    }`}
                    aria-label={`Select ${c.name}`}
                  >
                    {isSelected ? "Selected ✓" : "Select & Customize →"}
                  </button>
                </div>
              </Tilt3D>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
