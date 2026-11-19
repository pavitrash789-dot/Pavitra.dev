"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, Check, ExternalLink, FolderKanban, Inbox, Loader2, LogOut, Mail, MessageCircle,
  Pencil, Plus, RefreshCw, Save, Search, Trash2, X, KeyRound, ShieldCheck
} from "lucide-react";
import { CONFIG_HINT, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { statuses } from "@/lib/site";

type FileRef = { path: string; name: string };
type Request = {
  id: string; created_at: string; status: string; category: string | null; purpose: string | null; design: string | null;
  pages: string[] | null; features: string[] | null; name: string | null; business: string | null; email: string | null;
  whatsapp: string | null; description: string | null; reference_url: string | null; budget: string | null;
  timeline: string | null; files: FileRef[] | null; notes: string | null;
};
type Enquiry = { id: string; created_at: string; name: string | null; email: string | null; message: string | null };
type Project = {
  id: string; created_at: string; title: string | null; category: string | null; description: string | null;
  tech: string[] | null; demo_url: string | null; image_url: string | null;
};
type Tab = "requests" | "enquiries" | "portfolio";

const EMPTY_PROJECT = { title: "", category: "", description: "", tech: "", demo_url: "", image_url: "" };
const digits = (v: string | null | undefined) => String(v ?? "").replace(/\D/g, "");
const day = (v: string) => new Date(v).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const when = (v: string) => new Date(v).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const ACTIVE = ["Contacted", "Discussion", "Quotation Sent", "In Progress"];

const STATUS_TONE: Record<string, string> = {
  "New Enquiry": "bg-brand-2/15 text-brand-2 border-brand-2/30",
  Contacted: "bg-sky-400/10 text-sky-200 border-sky-400/30",
  Discussion: "bg-indigo-400/10 text-indigo-200 border-indigo-400/30",
  "Quotation Sent": "bg-amber-400/10 text-amber-200 border-amber-400/30",
  "In Progress": "bg-brand/20 text-brand border-brand/40",
  Completed: "bg-emerald-400/10 text-emerald-200 border-emerald-400/30",
  Cancelled: "bg-red-400/10 text-red-200 border-red-400/30",
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[status] ?? "bg-white/5 text-white/70 border-white/15"}`}>{status}</span>;
}

function Stat({ label, value, hint, icon }: { label: string; value: number; hint?: string; icon: React.ReactNode }) {
  return <div className="card p-5">
    <div className="flex items-center justify-between text-white/50"><span className="text-xs uppercase tracking-wider">{label}</span>{icon}</div>
    <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
  </div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="glass grid place-items-center rounded-2xl p-10 text-center text-sm text-white/50">{children}</div>;
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string>("");
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("requests");
  const [reqs, setReqs] = useState<Request[]>([]);
  const [enq, setEnq] = useState<Enquiry[]>([]);
  const [pf, setPf] = useState<Project[]>([]);
  const [loadErr, setLoadErr] = useState("");
  const [sel, setSel] = useState<Request | null>(null);
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  const [notes, setNotes] = useState(""); const [savedNote, setSavedNote] = useState(false);
  const [q, setQ] = useState(""); const [statusFilter, setStatusFilter] = useState("all");
  const [np, setNp] = useState(EMPTY_PROJECT); const [editing, setEditing] = useState<string | null>(null);

  const loadData = useCallback(async (jwtToken: string) => {
    try {
      // 1. Try server-side admin data API (bypasses RLS)
      const res = await fetch("/api/admin/data", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (res.ok) {
        const j = await res.json();
        setReqs(j.requests || []);
        setEnq(j.enquiries || []);
        setPf(j.portfolio || []);
        return;
      }
    } catch {}

    // 2. Direct client fallback
    const [a, b, c] = await Promise.all([
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_projects").select("*").order("created_at", { ascending: false }),
    ]);
    const failure = a.error || b.error || c.error;
    setLoadErr(failure ? `${failure.message}` : "");
    setReqs((a.data ?? []) as Request[]);
    setEnq((b.data ?? []) as Enquiry[]);
    setPf((c.data ?? []) as Project[]);
  }, []);

  const load = useCallback(() => {
    if (token) loadData(token);
  }, [token, loadData]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthed(false);
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) {
          setAuthed(true);
          setEmail(data.session.user.email ?? "");
          setToken(data.session.access_token);
          loadData(data.session.access_token);
        } else {
          setAuthed(false);
        }
      })
      .catch(() => setAuthed(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthed(true);
        setEmail(session.user.email ?? "");
        setToken(session.access_token);
        loadData(session.access_token);
      } else {
        setAuthed(false);
        setToken("");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadData]);

  const loginWith = async (targetEmail: string, targetPass: string) => {
    setErr("");
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: targetPass,
    });
    setBusy(false);
    if (error || !data.session) {
      return setErr(
        error?.message === "Invalid login credentials"
          ? "Invalid email or password."
          : error?.message || "Sign in failed"
      );
    }
    setAuthed(true);
    setEmail(targetEmail);
    setToken(data.session.access_token);
    loadData(data.session.access_token);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    loginWith(em, pw);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setToken("");
    setSel(null);
    setReqs([]);
    setEnq([]);
    setPf([]);
  };

  const open = async (r: Request) => {
    setSel(r); setNotes(r.notes ?? ""); setSavedNote(false); setLinks([]);
    const out: { name: string; url: string }[] = [];
    const fileList: FileRef[] = Array.isArray(r.files)
      ? r.files
      : typeof r.files === "string"
      ? (() => { try { return JSON.parse(r.files); } catch { return []; } })()
      : [];
    for (const f of fileList) {
      if (f && f.path) {
        const { data } = await supabase.storage.from("uploads").createSignedUrl(f.path, 600);
        if (data) out.push({ name: f.name || "File", url: data.signedUrl });
      }
    }
    setLinks(out);
  };

  const patchRequest = async (id: string, patch: Partial<Request>) => {
    setReqs(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));
    setSel(s => (s && s.id === id ? { ...s, ...patch } : s));

    try {
      const res = await fetch("/api/admin/data", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, patch }),
      });
      if (!res.ok) {
        const j = await res.json();
        setLoadErr(j.error || "Update failed");
      }
    } catch {
      const { error } = await supabase.from("requests").update(patch).eq("id", id);
      if (error) setLoadErr(error.message);
    }
  };

  const saveNotes = async () => {
    if (sel) {
      await patchRequest(sel.id, { notes });
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 2000);
    }
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...np, tech: np.tech.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "portfolio_save", payload, id: editing }),
      });
      if (!res.ok) {
        const j = await res.json();
        setLoadErr(j.error || "Failed to save project");
      }
    } catch {
      const { error } = editing
        ? await supabase.from("portfolio_projects").update(payload).eq("id", editing)
        : await supabase.from("portfolio_projects").insert(payload);
      if (error) return setLoadErr(error.message);
    }

    setNp(EMPTY_PROJECT);
    setEditing(null);
    load();
  };

  const editProject = (p: Project) => {
    setEditing(p.id);
    setNp({
      title: p.title ?? "",
      category: p.category ?? "",
      description: p.description ?? "",
      tech: (p.tech ?? []).join(", "),
      demo_url: p.demo_url ?? "",
      image_url: p.image_url ?? "",
    });
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm("Delete this portfolio project?")) return;
    try {
      const res = await fetch(`/api/admin/data?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const j = await res.json();
        setLoadErr(j.error || "Delete failed");
      }
    } catch {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
      if (error) return setLoadErr(error.message);
    }

    if (editing === id) {
      setEditing(null);
      setNp(EMPTY_PROJECT);
    }
    load();
  };

  const filteredReqs = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return reqs.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!needle) return true;
      return [r.name, r.business, r.email, r.whatsapp, r.category, r.purpose].some(v => String(v ?? "").toLowerCase().includes(needle));
    });
  }, [reqs, q, statusFilter]);

  const filteredEnq = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return enq;
    return enq.filter(e => [e.name, e.email, e.message].some(v => String(v ?? "").toLowerCase().includes(needle)));
  }, [enq, q]);

  const stats = useMemo(() => ({
    newRequests: reqs.filter(r => r.status === "New Enquiry").length,
    active: reqs.filter(r => ACTIVE.includes(r.status)).length,
    completed: reqs.filter(r => r.status === "Completed").length,
    enquiries: enq.length,
    portfolio: pf.length,
  }), [reqs, enq, pf]);

  if (!isSupabaseConfigured) {
    return <main className="grid min-h-screen place-items-center px-5">
      <div className="glass w-full max-w-md space-y-2 rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold">Admin unavailable</h1>
        <p role="alert" className="text-sm text-amber-200">{CONFIG_HINT}</p>
      </div>
    </main>;
  }

  if (authed === null) {
    return <main className="grid min-h-screen place-items-center px-5 text-white/60">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-brand-2" size={32} />
        <span className="text-sm">Connecting to Admin Portal...</span>
      </div>
    </main>;
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="glass w-full max-w-md space-y-5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/30 to-brand-2/20 text-brand-2 border border-white/10 shadow-md">
              <ShieldCheck size={26} />
            </div>
            <p className="text-xs uppercase tracking-widest text-white/40">Pavitra<span className="grad">.dev</span></p>
            <h1 className="font-display text-2xl font-bold text-white mt-1">Admin Dashboard</h1>
            <p className="text-sm text-white/60 mt-1">Enter your Admin ID and Password to continue.</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs uppercase font-semibold text-white/50 block mb-1.5">Admin ID / Email</label>
              <input
                className="inp"
                type="email"
                placeholder="admin@example.com"
                autoComplete="username"
                value={em}
                onChange={e => setEm(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-white/50 block mb-1.5">Password</label>
              <input
                className="inp"
                type="password"
                placeholder="••••••••••••"
                autoComplete="current-password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
              />
            </div>

            {err && (
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-400/10 p-3 text-xs text-red-300 border border-red-400/30">
                <AlertCircle size={14} className="shrink-0" />
                <span>{err}</span>
              </p>
            )}

            <button className="btn btn-p w-full justify-center !py-3 font-semibold shadow-lg" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "requests", label: "Requests", count: reqs.length },
    { id: "enquiries", label: "Enquiries", count: enq.length },
    { id: "portfolio", label: "Portfolio", count: pf.length },
  ];

  return <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6">
    <header className="glass sticky top-3 z-30 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3 border border-white/10 shadow-lg">
      <div className="flex items-center gap-3">
        <a href="/" className="font-display font-bold hover:text-brand-2 transition-colors">
          Pavitra<span className="grad">.dev</span>
        </a>
        <span className="rounded-full bg-brand/20 border border-brand/40 px-2.5 py-0.5 text-[11px] font-semibold text-brand uppercase tracking-wider">
          Admin Portal
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-g !px-3 !py-2 text-sm" onClick={load} aria-label="Refresh data">
          <RefreshCw size={15} />
        </button>
        <span className="hidden text-xs text-white/60 md:inline bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {email}
        </span>
        <button className="btn btn-g !px-3 !py-2 text-sm hover:text-red-300" onClick={logout}>
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </header>

    {loadErr && <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
      <AlertCircle size={16} className="mt-0.5 shrink-0" /><span className="flex-1">{loadErr}</span>
      <button onClick={() => setLoadErr("")} aria-label="Dismiss"><X size={16} /></button></div>}

    <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Stat label="New requests" value={stats.newRequests} hint="Awaiting first reply" icon={<Inbox size={18} />} />
      <Stat label="Active projects" value={stats.active} hint="Contacted → In progress" icon={<FolderKanban size={18} />} />
      <Stat label="Completed" value={stats.completed} hint="Delivered projects" icon={<Check size={18} />} />
      <Stat label="Enquiries" value={stats.enquiries} hint="From the contact form" icon={<Mail size={18} />} />
      <Stat label="Portfolio" value={stats.portfolio} hint="Live on the site" icon={<ExternalLink size={18} />} />
    </section>

    <div className="mb-5 flex flex-wrap items-center gap-2">
      {tabs.map(t => <button key={t.id} className="chip capitalize" aria-pressed={tab === t.id} onClick={() => { setTab(t.id); setQ(""); }}>
        {t.label} <span className="ml-1 text-xs text-white/40">{t.count}</span></button>)}
    </div>

    {tab !== "portfolio" && <div className="mb-5 flex flex-wrap gap-3">
      <label className="relative flex-1 min-w-56"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input className="inp !pl-9" placeholder={tab === "requests" ? "Search name, email, category…" : "Search enquiries…"} value={q} onChange={e => setQ(e.target.value)} /></label>
      {tab === "requests" && <select className="inp max-w-52" aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="all" className="text-black">All statuses</option>
        {statuses.map(s => <option key={s} className="text-black">{s}</option>)}</select>}
    </div>}

    {tab === "requests" && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="space-y-2">
        {filteredReqs.map(r => <button key={r.id} onClick={() => open(r)} className={`card w-full p-4 text-left ${sel?.id === r.id ? "!border-brand ring-2 ring-brand/30" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{r.name || "Unnamed"}{r.business ? <span className="font-normal text-white/50"> · {r.business}</span> : null}</p>
              <p className="mt-0.5 truncate text-sm text-white/50">{r.category || "—"} · {r.budget || "No budget"} · {day(r.created_at)}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
        </button>)}
        {!filteredReqs.length && <Empty>{reqs.length ? "No requests match your filters." : "No project requests yet."}</Empty>}
      </div>

      {sel ? <div className="glass h-fit space-y-4 rounded-2xl p-6 lg:sticky lg:top-24 border border-white/10 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-display text-xl font-bold">{sel.name}{sel.business ? <span className="font-normal text-white/50"> · {sel.business}</span> : null}</h2>
            <p className="text-xs text-white/40">Submitted {when(sel.created_at)}</p></div>
          <button onClick={() => setSel(null)} aria-label="Close details" className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sel.email && <a className="btn btn-g !px-3 !py-1.5 text-sm" href={`mailto:${sel.email}`}><Mail size={14} />Email</a>}
          {digits(sel.whatsapp) && <a className="btn btn-g !px-3 !py-1.5 text-sm" href={`https://wa.me/${digits(sel.whatsapp)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />WhatsApp</a>}
          {sel.reference_url && <a className="btn btn-g !px-3 !py-1.5 text-sm" href={sel.reference_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} />Reference</a>}
        </div>

        <div className="space-y-1 text-sm text-white/70">
          {sel.email && <p>{sel.email}</p>}{sel.whatsapp && <p>{sel.whatsapp}</p>}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-white/50" htmlFor="status">Status</label>
          <select id="status" className="inp max-w-56" value={sel.status} onChange={e => patchRequest(sel.id, { status: e.target.value })}>
            {statuses.map(s => <option key={s} className="text-black">{s}</option>)}</select>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {([["Type", sel.category], ["Design", sel.design], ["Budget", sel.budget], ["Timeline", sel.timeline]] as const).map(([k, v]) =>
            <div key={k}><dt className="text-xs uppercase tracking-wider text-white/40">{k}</dt><dd>{v || "—"}</dd></div>)}
        </dl>

        {!!sel.purpose && <div><p className="text-xs uppercase tracking-wider text-white/40">Purpose</p><p className="mt-1 text-sm text-white/80">{sel.purpose}</p></div>}
        {!!sel.description && <div><p className="text-xs uppercase tracking-wider text-white/40">Notes from client</p><p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{sel.description}</p></div>}
        {!!sel.pages?.length && <div><p className="text-xs uppercase tracking-wider text-white/40">Pages</p><div className="mt-1 flex flex-wrap gap-1.5">{sel.pages.map(p => <span key={p} className="rounded-full bg-white/8 px-2 py-0.5 text-xs">{p}</span>)}</div></div>}
        {!!sel.features?.length && <div><p className="text-xs uppercase tracking-wider text-white/40">Features</p><div className="mt-1 flex flex-wrap gap-1.5">{sel.features.map(f => <span key={f} className="rounded-full bg-white/8 px-2 py-0.5 text-xs">{f}</span>)}</div></div>}
        {!!links.length && <div><p className="text-xs uppercase tracking-wider text-white/40">Files</p><ul className="mt-1 space-y-1 text-sm">{links.map(l => <li key={l.url}><a className="text-brand underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.name}</a></li>)}</ul></div>}

        <div>
          <label className="text-xs uppercase tracking-wider text-white/40" htmlFor="notes">Internal notes</label>
          <textarea id="notes" className="inp mt-1 min-h-24" placeholder="Call summary, quote sent, next step…" value={notes} onChange={e => { setNotes(e.target.value); setSavedNote(false); }} />
          <div className="mt-2 flex items-center gap-3">
            <button className="btn btn-p !px-4 !py-2 text-sm" onClick={saveNotes}><Save size={15} />Save notes</button>
            {savedNote && <span role="status" className="flex items-center gap-1 text-sm text-brand-2"><Check size={14} />Saved</span>}
          </div>
        </div>
      </div> : <Empty>Select a request to see its details.</Empty>}
    </div>}

    {tab === "enquiries" && <div className="space-y-3">
      {filteredEnq.map(e => <article key={e.id} className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><b>{e.name || "Unknown"}</b>{e.email && <span className="text-white/50"> · {e.email}</span>}</div>
          <span className="text-xs text-white/40">{when(e.created_at)}</span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/70">{e.message}</p>
        {e.email && <a className="btn btn-g mt-3 !px-3 !py-1.5 text-sm" href={`mailto:${e.email}?subject=Re: your enquiry`}><Mail size={14} />Reply</a>}
      </article>)}
      {!filteredEnq.length && <Empty>{enq.length ? "No enquiries match your search." : "No enquiries yet."}</Empty>}
    </div>}

    {tab === "portfolio" && <div className="grid gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <form onSubmit={saveProject} className="glass h-fit space-y-3 rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="font-display text-lg font-bold">{editing ? "Edit project" : "Add project"}</h2>
        <input className="inp" placeholder="Title" value={np.title} onChange={e => setNp({ ...np, title: e.target.value })} required />
        <input className="inp" placeholder="Category (e.g. E-commerce)" value={np.category} onChange={e => setNp({ ...np, category: e.target.value })} />
        <input className="inp" placeholder="Tech (comma separated)" value={np.tech} onChange={e => setNp({ ...np, tech: e.target.value })} />
        <input className="inp" placeholder="Demo URL" value={np.demo_url} onChange={e => setNp({ ...np, demo_url: e.target.value })} />
        <input className="inp" placeholder="Image URL" value={np.image_url} onChange={e => setNp({ ...np, image_url: e.target.value })} />
        <textarea className="inp min-h-24" placeholder="Description" value={np.description} onChange={e => setNp({ ...np, description: e.target.value })} />
        <div className="flex gap-2">
          <button className="btn btn-p !px-4 !py-2 text-sm">{editing ? <><Save size={15} />Save changes</> : <><Plus size={15} />Add project</>}</button>
          {editing && <button type="button" className="btn btn-g !px-4 !py-2 text-sm" onClick={() => { setEditing(null); setNp(EMPTY_PROJECT); }}>Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {pf.map(p => <article key={p.id} className="card flex items-start gap-4 p-4">
          {p.image_url ? <img src={p.image_url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
            : <div className="grid h-16 w-24 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand/30 to-brand-2/20 text-xs text-white/50">No image</div>}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{p.title}</p>
            <p className="truncate text-sm text-white/50">{p.category || "—"}{p.tech?.length ? ` · ${p.tech.join(", ")}` : ""}</p>
            {p.demo_url && <a className="mt-1 inline-flex items-center gap-1 text-xs text-brand underline" href={p.demo_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} />Live demo</a>}
          </div>
          <div className="flex shrink-0 gap-1">
            <button className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label={`Edit ${p.title}`} onClick={() => editProject(p)}><Pencil size={16} /></button>
            <button className="rounded-lg p-2 text-red-300/80 hover:bg-red-400/10 hover:text-red-200" aria-label={`Delete ${p.title}`} onClick={() => deleteProject(p.id)}><Trash2 size={16} /></button>
          </div>
        </article>)}
        {!pf.length && <Empty>No portfolio projects yet. Add your first one.</Empty>}
      </div>
    </div>}
  </main>;
}
