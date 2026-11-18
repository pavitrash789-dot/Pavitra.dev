"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { categories } from "@/lib/site";
import { useDraft } from "@/lib/store";
export default function Categories() {
  const { d, set } = useDraft();
  const pick = (id: string) => { set({ category:id, features:[], step:1 }); setTimeout(() => document.getElementById("customize")?.scrollIntoView({ behavior:"smooth" }), 50); };
  return (
    <section id="choose" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="font-display text-3xl font-bold md:text-4xl">Choose your <span className="grad">website</span></h2>
      <p className="mt-2 text-white/60">Pick the closest match. You can customize everything next.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const Icon = (Icons as any)[c.icon] ?? Icons.Globe;
          return (
            <motion.div key={c.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:(i%3)*.08 }} className={`card p-6 ${d.category===c.id ? "!border-brand" : ""}`}>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand/30 to-brand-2/20"><Icon size={22} /></div>
              <h3 className="font-display text-lg font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-white/60">{c.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">{c.ex.map(e => <span key={e} className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-white/70">{e}</span>)}</div>
              <button onClick={() => pick(c.id)} className="btn btn-g mt-5 w-full justify-center" aria-label={`Select ${c.name}`}>{d.category===c.id ? "Selected ✓" : "Select"}</button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
