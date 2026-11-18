"use client";
import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { categories, common, allFeatures, pagesList, designs, steps } from "@/lib/site";
import { useDraft } from "@/lib/store";

const toggle = (a: string[], v: string) => a.includes(v) ? a.filter(x => x !== v) : [...a, v];
const Chips = ({ items, sel, on, multi = true }: { items: string[]; sel: string[]; on: (v: string) => void; multi?: boolean }) => (
  <div className="flex flex-wrap gap-2.5" role={multi ? "group" : "radiogroup"}>{items.map(i => <button type="button" key={i} aria-pressed={sel.includes(i)} className="chip" onClick={() => on(i)}>{i}</button>)}</div>
);
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block"><span className="mb-1 block text-sm text-white/70">{label}</span>{children}</label>;

export default function Wizard() {
  const { d, set, reset } = useDraft();
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const cat = categories.find(c => c.id === d.category);
  const feats = cat?.id === "custom" ? allFeatures : allFeatures.filter(f => common.includes(f) || cat?.feat.includes(f));

  const validate = (s: number): string => {
    if (s === 0 && !cat) return "Please select a website type above first.";
    if (s === 1 && d.purpose.trim().length < 10) return "Tell me a little about the purpose (at least 10 characters).";
    if (s === 2 && !d.design) return "Choose a design style.";
    if (s === 3 && d.pages.length === 0) return "Select at least one page.";
    if (s === 5) {
      if (!d.name.trim()) return "Your name is required.";
      if (!/^\S+@\S+\.\S+$/.test(d.email)) return "Enter a valid email address.";
      if (d.whatsapp.replace(/\D/g, "").length < 10) return "Enter a valid WhatsApp number.";
      if (d.reference_url && !/^https?:\/\/\S+\.\S+/.test(d.reference_url)) return "Reference URL must start with http:// or https://";
    }
    return "";
  };
  const go = (n: number) => { setErr(""); set({ step:n }); };
  const next = () => { const e = validate(d.step); if (e) return setErr(e); go(d.step + 1); };
  const addFiles = (list: FileList | null) => {
    const f = [...(list ?? [])]; if (f.some(x => x.size > 10 * 1024 * 1024)) return setErr("Each file must be under 10 MB.");
    if (files.length + f.length > 5) return setErr("You can upload up to 5 files."); setErr(""); setFiles([...files, ...f]);
  };
  const submit = async () => {
    for (const s of [0, 1, 2, 3, 5]) { const e = validate(s); if (e) { setErr(e); set({ step:s }); return; } }
    setBusy(true); setErr("");
    try {
      const fd = new FormData(); fd.append("data", JSON.stringify(d)); files.forEach(f => fd.append("files", f));
      const r = await fetch("/api/submit", { method:"POST", body:fd }); const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setDone(true); reset(); setFiles([]);
    } catch (e: any) { setErr(e.message || "Network error. Please try again."); } finally { setBusy(false); }
  };

  if (done) return (
    <section id="customize" className="mx-auto max-w-3xl px-5 py-20"><div className="glass rounded-2xl p-10 text-center" role="status">
      <CheckCircle2 className="mx-auto mb-3 text-brand-2" size={44} /><h2 className="font-display text-2xl font-bold">Request received!</h2>
      <p className="mt-2 text-white/70">Thank you. I'll review your project and contact you on WhatsApp or email soon.</p></div></section>
  );

  const review: [string, string, number][] = [["Website type", cat?.name ?? "—", 0], ["Purpose", d.purpose || "—", 1], ["Design", d.design || "—", 2], ["Pages", d.pages.join(", ") || "—", 3], ["Features", d.features.join(", ") || "None selected", 4],
    ["Contact", `${d.name} · ${d.business || "No business name"} · ${d.email} · ${d.whatsapp}`, 5], ["Details", `Budget: ${d.budget || "—"} · Timeline: ${d.timeline || "—"} · Ref: ${d.reference_url || "—"} · Files: ${files.length}`, 5]];

  return (
    <section id="customize" className="mx-auto max-w-3xl px-5 py-20">
      <h2 className="font-display text-3xl font-bold md:text-4xl">Customize your <span className="grad">website</span></h2>
      <ol className="mt-6 flex gap-1.5" aria-label="Progress">{steps.map((s, i) => <li key={s} className="flex-1"><div className={`h-1.5 rounded-full ${i <= d.step ? "bg-gradient-to-r from-brand to-brand-2" : "bg-white/10"}`} /><span className="mt-1 hidden text-xs text-white/50 sm:block">{s}</span></li>)}</ol>
      <div className="glass mt-6 rounded-2xl p-6 md:p-8">
        {d.step === 0 && <div><h3 className="mb-3 font-display text-xl">Website type</h3>{cat ? <p className="text-lg">{cat.name} <a href="#choose" className="ml-2 text-sm text-brand underline">change</a></p> : <p className="text-white/60">No type selected yet. <a href="#choose" className="text-brand underline">Choose one above</a>.</p>}</div>}
        {d.step === 1 && <Field label="What is this website for?"><textarea className="inp min-h-32" value={d.purpose} onChange={e => set({ purpose:e.target.value })} placeholder="e.g. Sell handmade jewellery across India" /></Field>}
        {d.step === 2 && <div><h3 className="mb-3 font-display text-xl">Design style</h3><Chips multi={false} items={designs} sel={[d.design]} on={v => set({ design:v })} /></div>}
        {d.step === 3 && <div><h3 className="mb-3 font-display text-xl">Pages you need</h3><Chips items={pagesList} sel={d.pages} on={v => set({ pages:toggle(d.pages, v) })} /></div>}
        {d.step === 4 && <div><h3 className="mb-3 font-display text-xl">Required features</h3><Chips items={feats} sel={d.features} on={v => set({ features:toggle(d.features, v) })} /></div>}
        {d.step === 5 && <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name *"><input className="inp" value={d.name} onChange={e => set({ name:e.target.value })} autoComplete="name" /></Field>
          <Field label="Business name"><input className="inp" value={d.business} onChange={e => set({ business:e.target.value })} /></Field>
          <Field label="Email *"><input type="email" className="inp" value={d.email} onChange={e => set({ email:e.target.value })} autoComplete="email" /></Field>
          <Field label="WhatsApp number *"><input type="tel" className="inp" value={d.whatsapp} onChange={e => set({ whatsapp:e.target.value })} placeholder="+91…" /></Field>
          <div className="sm:col-span-2"><Field label="Project description"><textarea className="inp min-h-24" value={d.description} onChange={e => set({ description:e.target.value })} /></Field></div>
          <Field label="Reference website URL"><input className="inp" value={d.reference_url} onChange={e => set({ reference_url:e.target.value })} placeholder="https://" /></Field>
          <Field label="Expected budget"><select className="inp" value={d.budget} onChange={e => set({ budget:e.target.value })}><option value="">Select</option>{["Under ₹10,000","₹10,000–₹25,000","₹25,000–₹50,000","₹50,000+","Not sure yet"].map(o => <option key={o} className="text-black">{o}</option>)}</select></Field>
          <Field label="Delivery timeline"><select className="inp" value={d.timeline} onChange={e => set({ timeline:e.target.value })}><option value="">Select</option>{["ASAP","1–2 weeks","2–4 weeks","1–2 months","Flexible"].map(o => <option key={o} className="text-black">{o}</option>)}</select></Field>
          <Field label="Logos, images, documents (max 5 × 10 MB)"><input type="file" multiple accept="image/*,.pdf,.doc,.docx" className="inp" onChange={e => addFiles(e.target.files)} /></Field>
          {files.length > 0 && <ul className="text-sm text-white/70 sm:col-span-2">{files.map((f, i) => <li key={i}>{f.name} <button className="ml-2 text-red-300" onClick={() => setFiles(files.filter((_, j) => j !== i))}>remove</button></li>)}</ul>}
        </div>}
        {d.step === 6 && <div><h3 className="mb-3 font-display text-xl">Review & submit</h3><dl className="space-y-3">{review.map(([k, v, s]) => <div key={k} className="flex items-start justify-between gap-4 border-b border-white/10 pb-3"><div><dt className="text-sm text-white/50">{k}</dt><dd className="break-words">{v}</dd></div><button className="text-sm text-brand underline" onClick={() => go(s)}>Edit</button></div>)}</dl></div>}
        {err && <p role="alert" className="mt-4 flex items-center gap-2 text-red-300"><AlertCircle size={16} />{err}</p>}
        <div className="mt-8 flex justify-between">
          <button className="btn btn-g" disabled={d.step === 0 || busy} onClick={() => go(d.step - 1)}>Back</button>
          {d.step < 6 ? <button className="btn btn-p" onClick={next}>Next</button> : <button className="btn btn-p" disabled={busy} onClick={submit}>{busy && <Loader2 className="animate-spin" size={18} />}Submit Project Request</button>}
        </div>
      </div>
    </section>
  );
}
