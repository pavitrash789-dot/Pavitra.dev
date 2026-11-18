"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, MessageCircle, Mail, Linkedin, Github, Loader2 } from "lucide-react";
import { services, site, stack } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export function Nav() {
  return <header className="glass fixed inset-x-3 top-3 z-40 mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
    <a href="#" className="font-display font-bold">Pavitra<span className="grad">.dev</span></a>
    <nav className="hidden gap-6 text-sm text-white/70 md:flex">{[["Choose","#choose"],["Services","#services"],["Work","#portfolio"],["Process","#how"],["Contact","#contact"]].map(([l, h]) => <a key={h} href={h} className="hover:text-white">{l}</a>)}</nav>
    <a href="#choose" className="btn btn-p !px-4 !py-2 text-sm">Start</a></header>;
}
export function Services() {
  return <section id="services" className="mx-auto max-w-6xl px-5 py-20">
    <h2 className="font-display text-3xl font-bold md:text-4xl">My <span className="grad">services</span></h2>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map(s => <div key={s} className="card flex items-center gap-3 p-5"><Code2 className="text-brand-2" size={20} />{s}</div>)}</div>
    <p className="mt-6 text-sm text-white/50">Built with: {stack.join(" · ")}</p></section>;
}
type P = { id:string; title:string; category:string; description:string; tech:string[]; demo_url:string|null; image_url:string|null };
const placeholders: P[] = [1, 2, 3].map(i => ({ id:`p${i}`, title:["Sample Store","Sample Portfolio","Sample Booking App"][i-1], category:["E-commerce","Portfolio","Booking"][i-1], description:"Placeholder project. Add your real projects from the admin dashboard.", tech:["Next.js","Tailwind","Supabase"], demo_url:null, image_url:null }));
export function Portfolio() {
  const [items, setItems] = useState<P[]>(placeholders);
  useEffect(() => { supabase.from("portfolio_projects").select("*").order("created_at", { ascending:false }).then(({ data }) => { if (data?.length) setItems(data as P[]); }); }, []);
  return <section id="portfolio" className="mx-auto max-w-6xl px-5 py-20">
    <h2 className="font-display text-3xl font-bold md:text-4xl">Selected <span className="grad">work</span></h2>
    <div className="mt-8 grid gap-5 md:grid-cols-3">{items.map(p => <div key={p.id} className="card overflow-hidden">
      {p.image_url ? <img src={p.image_url} alt={`${p.title} screenshot`} className="h-44 w-full object-cover" /> : <div className="h-44 bg-gradient-to-br from-brand/40 to-brand-2/30" />}
      <div className="p-5"><p className="text-xs text-brand-2">{p.category}</p><h3 className="font-display text-lg font-semibold">{p.title}</h3><p className="mt-1 text-sm text-white/60">{p.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{p.tech?.map(t => <span key={t} className="rounded-full bg-white/8 px-2 py-0.5 text-xs">{t}</span>)}</div>
        {p.demo_url ? <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-g mt-4 !py-2 text-sm">Live Demo</a> : <span className="mt-4 inline-block text-xs text-white/40">Demo coming soon</span>}</div></div>)}</div></section>;
}
export function How() {
  const s = ["Choose Your Website", "Customize Your Requirements", "Submit Your Project", "I Design, Develop & Deliver"];
  return <section id="how" className="mx-auto max-w-4xl px-5 py-20">
    <h2 className="font-display text-3xl font-bold md:text-4xl">How it <span className="grad">works</span></h2>
    <ol className="relative mt-10 space-y-8 border-l border-white/15 pl-8">{s.map((t, i) => <motion.li key={t} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*.1 }} className="relative">
      <span className="absolute -left-[3.15rem] grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 font-bold text-black">{String(i+1).padStart(2, "0")}</span><p className="font-display text-xl">{t}</p></motion.li>)}</ol></section>;
}
export function Contact() {
  const [f, setF] = useState({ name:"", email:"", message:"" }); const [st, setSt] = useState<"idle"|"busy"|"ok"|"err">("idle"); const [msg, setMsg] = useState("");
  const send = async (e: React.FormEvent) => { e.preventDefault(); setSt("busy");
    try { const r = await fetch("/api/contact", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(f) }); const j = await r.json(); if (!r.ok) throw new Error(j.error); setSt("ok"); setF({ name:"", email:"", message:"" }); }
    catch (x: any) { setMsg(x.message || "Could not send."); setSt("err"); } };
  return <section id="contact" className="mx-auto max-w-5xl px-5 py-20">
    <h2 className="font-display text-3xl font-bold md:text-4xl">Let's <span className="grad">talk</span></h2>
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <a className="btn btn-p" href={site.wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />Chat on WhatsApp</a>
        <p><a className="flex items-center gap-2 text-white/80 hover:text-white" href={`mailto:${site.email}`}><Mail size={18} />{site.email}</a></p>
        <p className="flex gap-4"><a aria-label="LinkedIn" href={site.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin /></a><a aria-label="GitHub" href={site.github} target="_blank" rel="noopener noreferrer"><Github /></a></p>
        <p className="text-sm text-white/50">{site.city}</p></div>
      <form onSubmit={send} className="glass space-y-3 rounded-2xl p-6">
        <input required className="inp" placeholder="Name" aria-label="Name" value={f.name} onChange={e => setF({ ...f, name:e.target.value })} />
        <input required type="email" className="inp" placeholder="Email" aria-label="Email" value={f.email} onChange={e => setF({ ...f, email:e.target.value })} />
        <textarea required minLength={10} className="inp min-h-28" placeholder="Message" aria-label="Message" value={f.message} onChange={e => setF({ ...f, message:e.target.value })} />
        <button className="btn btn-p" disabled={st === "busy"}>{st === "busy" && <Loader2 className="animate-spin" size={16} />}Send message</button>
        {st === "ok" && <p role="status" className="text-brand-2">Thanks! I'll get back to you soon.</p>}{st === "err" && <p role="alert" className="text-red-300">{msg}</p>}</form></div>
    <footer className="mt-16 text-center text-sm text-white/40">© {new Date().getFullYear()} {site.name}</footer></section>;
}
export function WhatsAppFloat() {
  return <a href={site.wa} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-black shadow-lg transition hover:scale-110"><MessageCircle /></a>;
}
