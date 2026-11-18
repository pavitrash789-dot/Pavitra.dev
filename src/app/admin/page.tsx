"use client";
import { useCallback, useEffect, useState } from "react";
import { CONFIG_HINT, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { statuses } from "@/lib/site";
type R = any;
export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null); const [em, setEm] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  const [tab, setTab] = useState<"requests"|"enquiries"|"portfolio">("requests");
  const [reqs, setReqs] = useState<R[]>([]); const [enq, setEnq] = useState<R[]>([]); const [pf, setPf] = useState<R[]>([]);
  const [sel, setSel] = useState<R | null>(null); const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  const [np, setNp] = useState({ title:"", category:"", description:"", tech:"", demo_url:"", image_url:"" });
  const load = useCallback(async () => {
    const [a, b, c] = await Promise.all([supabase.from("requests").select("*").order("created_at", { ascending:false }), supabase.from("enquiries").select("*").order("created_at", { ascending:false }), supabase.from("portfolio_projects").select("*").order("created_at", { ascending:false })]);
    setReqs(a.data ?? []); setEnq(b.data ?? []); setPf(c.data ?? []);
  }, []);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { setAuthed(!!data.session); if (data.session) load(); }); }, [load]);
  const login = async (e: React.FormEvent) => { e.preventDefault(); setErr(""); const { error } = await supabase.auth.signInWithPassword({ email:em, password:pw }); if (error) return setErr("Invalid credentials."); setAuthed(true); load(); };
  const open = async (r: R) => { setSel(r); const out: { name: string; url: string }[] = [];
    for (const f of r.files ?? []) { const { data } = await supabase.storage.from("uploads").createSignedUrl(f.path, 600); if (data) out.push({ name:f.name, url:data.signedUrl }); } setLinks(out); };
  const save = async (patch: R) => { if (!sel) return; await supabase.from("requests").update(patch).eq("id", sel.id); setSel({ ...sel, ...patch }); load(); };
  const addP = async (e: React.FormEvent) => { e.preventDefault(); await supabase.from("portfolio_projects").insert({ ...np, tech:np.tech.split(",").map(t => t.trim()).filter(Boolean) }); setNp({ title:"", category:"", description:"", tech:"", demo_url:"", image_url:"" }); load(); };
  if (!isSupabaseConfigured) return <main className="grid min-h-screen place-items-center px-5"><div className="glass w-full max-w-md space-y-2 rounded-2xl p-8">
    <h1 className="font-display text-2xl font-bold">Admin unavailable</h1><p role="alert" className="text-sm text-amber-200">{CONFIG_HINT}</p></div></main>;
  if (authed === null) return <p className="p-10">Loading…</p>;
  if (!authed) return <main className="grid min-h-screen place-items-center px-5"><form onSubmit={login} className="glass w-full max-w-sm space-y-3 rounded-2xl p-8">
    <h1 className="font-display text-2xl font-bold">Admin sign in</h1><input className="inp" type="email" placeholder="Email" value={em} onChange={e => setEm(e.target.value)} required /><input className="inp" type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} required />
    {err && <p role="alert" className="text-red-300">{err}</p>}<button className="btn btn-p w-full justify-center">Sign in</button></form></main>;
  return <main className="mx-auto max-w-6xl px-5 py-10">
    <div className="mb-6 flex items-center justify-between"><h1 className="font-display text-2xl font-bold">Dashboard</h1><button className="btn btn-g" onClick={async () => { await supabase.auth.signOut(); setAuthed(false); }}>Sign out</button></div>
    <div className="mb-6 flex gap-2">{(["requests", "enquiries", "portfolio"] as const).map(t => <button key={t} aria-pressed={tab === t} className="chip capitalize" onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab === "requests" && <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
      <ul className="space-y-2">{reqs.map(r => <li key={r.id}><button onClick={() => open(r)} className={`card w-full p-4 text-left ${sel?.id === r.id ? "!border-brand" : ""}`}><b>{r.name}</b> <span className="text-xs text-brand-2">{r.status}</span><br /><span className="text-sm text-white/60">{r.category} · {new Date(r.created_at).toLocaleDateString()}</span></button></li>)}{!reqs.length && <p className="text-white/50">No requests yet.</p>}</ul>
      {sel && <div className="glass space-y-3 rounded-2xl p-6">
        <h2 className="font-display text-xl">{sel.name} {sel.business && `· ${sel.business}`}</h2>
        <p className="text-sm text-white/70">{sel.email} · {sel.whatsapp} · <a className="text-brand underline" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${String(sel.whatsapp).replace(/\D/g, "")}`}>WhatsApp</a></p>
        <p><b>Type:</b> {sel.category} · <b>Design:</b> {sel.design}</p><p><b>Purpose:</b> {sel.purpose}</p><p><b>Pages:</b> {sel.pages?.join(", ")}</p><p><b>Features:</b> {sel.features?.join(", ")}</p>
        <p><b>Details:</b> {sel.description || "—"}</p><p><b>Budget:</b> {sel.budget || "—"} · <b>Timeline:</b> {sel.timeline || "—"} · <b>Ref:</b> {sel.reference_url || "—"}</p>
        {!!links.length && <p><b>Files:</b> {links.map(l => <a key={l.url} className="mr-3 text-brand underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</p>}
        <select className="inp" value={sel.status} onChange={e => save({ status:e.target.value })}>{statuses.map(s => <option key={s} className="text-black">{s}</option>)}</select>
        <textarea className="inp min-h-24" placeholder="Notes" defaultValue={sel.notes} key={sel.id} onBlur={e => save({ notes:e.target.value })} /></div>}</div>}
    {tab === "enquiries" && <ul className="space-y-3">{enq.map(e => <li key={e.id} className="card p-4"><b>{e.name}</b> · {e.email} <span className="text-xs text-white/40">{new Date(e.created_at).toLocaleString()}</span><p className="mt-1 text-white/70">{e.message}</p></li>)}{!enq.length && <p className="text-white/50">No enquiries yet.</p>}</ul>}
    {tab === "portfolio" && <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={addP} className="glass space-y-3 rounded-2xl p-6">{(["title", "category", "description", "tech", "demo_url", "image_url"] as const).map(k => <input key={k} className="inp" placeholder={k === "tech" ? "tech (comma separated)" : k} value={np[k]} onChange={e => setNp({ ...np, [k]:e.target.value })} required={k === "title"} />)}<button className="btn btn-p">Add project</button></form>
      <ul className="space-y-2">{pf.map(p => <li key={p.id} className="card flex items-center justify-between p-4">{p.title}<button className="text-red-300" onClick={async () => { await supabase.from("portfolio_projects").delete().eq("id", p.id); load(); }}>Delete</button></li>)}</ul></div>}
  </main>;
}
