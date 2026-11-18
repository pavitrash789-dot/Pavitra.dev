"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 md:grid-cols-2">
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>
        <p className="glass mb-5 inline-block rounded-full px-4 py-1 text-sm text-brand-2">Freelance web developer · Kota, India</p>
        <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">Create Your Idea of a Website <span className="grad">with My Skills.</span></h1>
        <p className="mt-4 text-xl text-white/80">You imagine it. You choose it. I'll build it.</p>
        <p className="mt-4 max-w-lg text-white/60">From simple portfolio websites to advanced e-commerce platforms, bring your ideas to life with modern, responsive, and professional web development.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#choose" className="btn btn-p">Start Your Project <ArrowRight size={18} /></a>
          <a href="#portfolio" className="btn btn-g">Explore My Work</a>
        </div>
      </motion.div>
      <motion.div aria-hidden initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.8, delay:.2 }} className="relative">
        <motion.div animate={{ y:[0,-12,0] }} transition={{ repeat:Infinity, duration:6 }} className="glass rounded-2xl p-4 shadow-[0_0_80px_-20px_#8b7bff]">
          <div className="mb-3 flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-red-400/70"/><i className="h-2.5 w-2.5 rounded-full bg-yellow-400/70"/><i className="h-2.5 w-2.5 rounded-full bg-green-400/70"/></div>
          <div className="space-y-3">
            <div className="h-24 rounded-xl bg-gradient-to-br from-brand/50 to-brand-2/40" />
            <div className="grid grid-cols-3 gap-3">{[0,1,2].map(i => <motion.div key={i} animate={{ opacity:[.4,1,.4] }} transition={{ repeat:Infinity, duration:3, delay:i*.4 }} className="h-16 rounded-lg bg-white/10" />)}</div>
            <div className="h-3 w-2/3 rounded bg-white/15" /><div className="h-3 w-1/2 rounded bg-white/10" />
          </div>
        </motion.div>
        <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:5 }} className="glass absolute -bottom-6 -left-4 rounded-xl px-4 py-3 text-sm">⚡ Responsive · SEO-ready</motion.div>
      </motion.div>
    </section>
  );
}
