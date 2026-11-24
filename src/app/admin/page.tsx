"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, Check, ExternalLink, FolderKanban, Inbox, Loader2, LogOut, Mail, MessageCircle,
  Pencil, Plus, RefreshCw, Save, Search, Trash2, X, KeyRound, ShieldCheck, Tag, Sliders, DollarSign
} from "lucide-react";
import { CONFIG_HINT, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { statuses } from "@/lib/site";
import { DEFAULT_PRICING_CONFIG, type PricingConfig, formatINR } from "@/lib/pricing";

type FileRef = { path: string; name: string };
type Request = {
  id: string; created_at: string; status: string; category: string | null; purpose: string | null; design: string | null;
  pages: string[] | null; features: string[] | null; name: string | null; business: string | null; email: string | null;
  whatsapp: string | null; description: string | null; reference_url: string | null; budget: string | null;
  timeline: string | null; files: FileRef[] | null; notes: string | null;
  package?: string | null;
  pricing_breakdown?: any;
};
type Enquiry = { id: string; created_at: string; name: string | null; email: string | null; message: string | null };
type Project = {
  id: string; created_at: string; title: string | null; category: string | null; description: string | null;
  tech: string[] | null; demo_url: string | null; image_url: string | null;
};
type Tab = "requests" | "enquiries" | "portfolio" | "pricing";

const EMPTY_PROJECT = { title: "", category: "", description: "", tech: "", demo_url: "", image_url: "" };
const digits = (v: string | null | undefined) => String(v ?? "").replace(/\D/g, "");
const day = (v: string) => new Date(v).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const when = (v: string) => new Date(v).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const ACTIVE = ["Contacted", "Discussion", "Quotation Sent", "In Progress"];

const STATUS_TONE: Record<string, string> = {
  "New Enquiry": "bg-[#EEF5F1] text-[#1D5E37] border-[#C5DFD0]",
  Contacted: "bg-sky-50 text-sky-800 border-sky-200",
  Discussion: "bg-indigo-50 text-indigo-800 border-indigo-200",
  "Quotation Sent": "bg-amber-50 text-amber-800 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-800 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Cancelled: "bg-red-50 text-red-800 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_TONE[status] ?? "bg-stone/20 text-slate border-stone"}`}>{status}</span>;
}

function Stat({ label, value, hint, icon }: { label: string; value: number; hint?: string; icon: React.ReactNode }) {
  return <div className="panel p-5 bg-white border border-stone">
    <div className="flex items-center justify-between text-slate"><span className="text-xs uppercase tracking-wider font-semibold">{label}</span>{icon}</div>
    <p className="mt-3 font-serif-heading text-3xl font-bold text-ink tabular-numbers">{value}</p>
    {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
  </div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="panel grid place-items-center rounded-xl p-10 text-center text-sm text-slate border border-stone bg-white">{children}</div>;
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
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

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
        if (j.pricing?.categories) setPricing(j.pricing);
        return;
      }
    } catch {}

    // Also fetch pricing config
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.categories)) setPricing(d);
      })
      .catch(() => {});

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

  const savePricing = async () => {
    setSavingPricing(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update pricing.");
      setPricingSavedToast(true);
      setTimeout(() => setPricingSavedToast(false), 3000);
    } catch (err: any) {
      alert(err.message || "Could not save pricing.");
    } finally {
      setSavingPricing(false);
    }
  };

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
    return <main className="grid min-h-screen place-items-center px-5 bg-chalk text-ink">
      <div className="panel w-full max-w-md space-y-2 rounded-2xl p-8 bg-white border border-stone shadow-sm">
        <h1 className="font-serif-heading text-2xl font-bold text-ink">Admin unavailable</h1>
        <p role="alert" className="text-sm text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-lg">{CONFIG_HINT}</p>
      </div>
    </main>;
  }

  if (authed === null) {
    return <main className="grid min-h-screen place-items-center px-5 text-slate bg-chalk">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-indigo" size={32} />
        <span className="text-sm font-medium">Connecting to Admin Portal...</span>
      </div>
    </main>;
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center px-5 bg-chalk text-ink">
        <div className="panel w-full max-w-md space-y-5 rounded-2xl p-8 border border-stone bg-white shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-chalk text-slate border border-stone">
              <ShieldCheck size={24} />
            </div>
            <p className="text-xs uppercase tracking-widest text-slate">Pavitra Sharma</p>
            <h1 className="font-serif-heading text-2xl font-bold text-ink mt-1">Admin Dashboard</h1>
            <p className="text-sm text-slate mt-1">Enter your Admin ID and Password to continue.</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs uppercase font-semibold text-slate block mb-1.5">Admin ID / Email</label>
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
              <label className="text-xs uppercase font-semibold text-slate block mb-1.5">Password</label>
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
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-[#FBF0EE] p-3 text-xs text-[#9A281E] border border-[#F2C4BE]">
                <AlertCircle size={14} className="shrink-0" />
                <span>{err}</span>
              </p>
            )}

            <button className="btn btn-p w-full justify-center !py-3 font-semibold" disabled={busy}>
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
    { id: "pricing", label: "Pricing Manager", count: pricing.categories.length },
  ];

  return <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 bg-chalk text-ink min-h-screen">
    <header className="sticky top-3 z-30 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3 border border-stone bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <a href="/" className="font-serif-heading text-lg font-bold text-ink hover:text-slate transition-colors">
          Pavitra Sharma
        </a>
        <span className="rounded-full bg-stone/40 border border-stone px-2.5 py-1 text-xs font-semibold text-slate uppercase tracking-wider">
          Admin Portal
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-g !px-3 !py-2 text-sm" onClick={load} aria-label="Refresh data">
          <RefreshCw size={15} />
        </button>
        <span className="hidden text-xs text-slate md:inline bg-chalk px-3 py-1 rounded-full border border-stone">
          {email}
        </span>
        <button className="btn btn-g !px-3 !py-2 text-sm hover:text-red-700" onClick={logout}>
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </header>

    {loadErr && <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-[#F2C4BE] bg-[#FBF0EE] p-4 text-sm text-[#9A281E]">
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
        {t.label} <span className="ml-1 text-xs text-slate">{t.count}</span></button>)}
    </div>

    {tab !== "portfolio" && tab !== "pricing" && <div className="mb-5 flex flex-wrap gap-3">
      <label className="relative flex-1 min-w-56"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
        <input className="inp !pl-9" placeholder={tab === "requests" ? "Search name, email, category…" : "Search enquiries…"} value={q} onChange={e => setQ(e.target.value)} /></label>
      {tab === "requests" && <select className="inp max-w-52" aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="all">All statuses</option>
        {statuses.map(s => <option key={s}>{s}</option>)}</select>}
    </div>}

    {tab === "requests" && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="space-y-2">
        {filteredReqs.map(r => <button key={r.id} onClick={() => open(r)} className={`panel w-full p-4 text-left border border-stone bg-white transition-colors hover:border-slate ${sel?.id === r.id ? "!border-indigo ring-2 ring-indigo/20" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{r.name || "Unnamed"}{r.business ? <span className="font-normal text-slate"> · {r.business}</span> : null}</p>
              <p className="mt-0.5 truncate text-sm text-slate">{r.category || "—"} · {r.budget || "No budget"} · {day(r.created_at)}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
        </button>)}
        {!filteredReqs.length && <Empty>{reqs.length ? "No requests match your filters." : "No project requests yet."}</Empty>}
      </div>

      {sel ? <div className="panel h-fit space-y-4 rounded-xl p-6 lg:sticky lg:top-24 border border-stone bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-serif-heading text-xl font-bold text-ink">{sel.name}{sel.business ? <span className="font-normal text-slate"> · {sel.business}</span> : null}</h2>
            <p className="text-xs text-slate">Submitted {when(sel.created_at)}</p></div>
          <button onClick={() => setSel(null)} aria-label="Close details" className="text-slate hover:text-ink"><X size={18} /></button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sel.email && <a className="btn btn-g !px-3 !py-1.5 text-sm" href={`mailto:${sel.email}`}><Mail size={14} />Email</a>}
          {digits(sel.whatsapp) && <a className="btn btn-g !px-3 !py-1.5 text-sm" href={`https://wa.me/${digits(sel.whatsapp)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />WhatsApp</a>}
          {sel.reference_url && <a className="btn btn-g !px-3 !py-1.5 text-sm" href={sel.reference_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} />Reference</a>}
        </div>

        <div className="space-y-1 text-sm text-slate">
          {sel.email && <p>{sel.email}</p>}{sel.whatsapp && <p>{sel.whatsapp}</p>}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate font-medium" htmlFor="status">Status</label>
          <select id="status" className="inp max-w-56" value={sel.status} onChange={e => patchRequest(sel.id, { status: e.target.value })}>
            {statuses.map(s => <option key={s}>{s}</option>)}</select>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {([["Type", sel.category], ["Design", sel.design], ["Budget", sel.budget], ["Timeline", sel.timeline]] as const).map(([k, v]) =>
            <div key={k}><dt className="text-xs uppercase tracking-wider text-slate font-semibold">{k}</dt><dd className="text-ink font-medium">{v || "—"}</dd></div>)}
        </dl>

        {!!sel.pricing_breakdown && (
          <div className="rounded-xl border border-stone bg-chalk p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-ink font-bold uppercase tracking-wider">
              <span>Saved Pricing Breakdown</span>
              <span className="text-ink text-sm tabular-numbers">{formatINR(sel.pricing_breakdown.estimatedTotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate pt-1 border-t border-stone">
              <div>Package: <strong className="text-ink">{sel.pricing_breakdown.packageName || sel.package}</strong></div>
              <div>Base Price: <strong className="text-ink tabular-numbers">{formatINR(sel.pricing_breakdown.selectedPackagePrice)}</strong></div>
              <div>Pages: <strong className="text-ink">{sel.pricing_breakdown.selectedPages} ({sel.pricing_breakdown.extraPagesCost > 0 ? `+${formatINR(sel.pricing_breakdown.extraPagesCost)}` : "Included"})</strong></div>
              <div>Features Cost: <strong className="text-ink tabular-numbers">{formatINR(sel.pricing_breakdown.featuresCost || 0)}</strong></div>
            </div>
            {sel.pricing_breakdown.selectedFeatures?.length > 0 && (
              <div className="text-slate">
                <span className="font-semibold text-ink">Features: </span>
                {sel.pricing_breakdown.selectedFeatures.map((f: any) => `${f.name} (+${formatINR(f.price)})`).join(", ")}
              </div>
            )}
            {sel.pricing_breakdown.selectedSpecialRequirements?.length > 0 && (
              <div className="text-slate">
                <span className="font-semibold text-ink">Addons: </span>
                {sel.pricing_breakdown.selectedSpecialRequirements.map((r: any) => `${r.name} (+${formatINR(r.price)})`).join(", ")}
              </div>
            )}
          </div>
        )}

        {!!sel.purpose && <div><p className="text-xs uppercase tracking-wider text-slate font-semibold">Purpose</p><p className="mt-1 text-sm text-ink">{sel.purpose}</p></div>}
        {!!sel.description && <div><p className="text-xs uppercase tracking-wider text-slate font-semibold">Notes from client</p><p className="mt-1 whitespace-pre-wrap text-sm text-ink">{sel.description}</p></div>}
        {!!sel.pages?.length && <div><p className="text-xs uppercase tracking-wider text-slate font-semibold">Pages</p><div className="mt-1 flex flex-wrap gap-1.5">{sel.pages.map(p => <span key={p} className="rounded-full bg-stone/40 border border-stone px-2.5 py-1 text-xs text-ink">{p}</span>)}</div></div>}
        {!!sel.features?.length && <div><p className="text-xs uppercase tracking-wider text-slate font-semibold">Features</p><div className="mt-1 flex flex-wrap gap-1.5">{sel.features.map(f => <span key={f} className="rounded-full bg-stone/40 border border-stone px-2.5 py-1 text-xs text-ink">{f}</span>)}</div></div>}
        {!!links.length && <div><p className="text-xs uppercase tracking-wider text-slate font-semibold">Files</p><ul className="mt-1 space-y-1 text-sm">{links.map(l => <li key={l.url}><a className="text-indigo underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.name}</a></li>)}</ul></div>}

        <div>
          <label className="text-xs uppercase tracking-wider text-slate font-semibold" htmlFor="notes">Internal notes</label>
          <textarea id="notes" className="inp mt-1 min-h-24" placeholder="Call summary, quote sent, next step…" value={notes} onChange={e => { setNotes(e.target.value); setSavedNote(false); }} />
          <div className="mt-2 flex items-center gap-3">
            <button className="btn btn-p !px-4 !py-2 text-sm" onClick={saveNotes}><Save size={15} />Save notes</button>
            {savedNote && <span role="status" className="flex items-center gap-1 text-sm text-emerald-700 font-medium"><Check size={14} />Saved</span>}
          </div>
        </div>
      </div> : <Empty>Select a request to see its details.</Empty>}
    </div>}

    {tab === "enquiries" && <div className="space-y-3">
      {filteredEnq.map(e => <article key={e.id} className="panel p-5 bg-white border border-stone">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><b className="text-ink">{e.name || "Unknown"}</b>{e.email && <span className="text-slate"> · {e.email}</span>}</div>
          <span className="text-xs text-slate">{when(e.created_at)}</span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate">{e.message}</p>
        {e.email && <a className="btn btn-g mt-3 !px-3 !py-1.5 text-sm" href={`mailto:${e.email}?subject=Re: your enquiry`}><Mail size={14} />Reply</a>}
      </article>)}
      {!filteredEnq.length && <Empty>{enq.length ? "No enquiries match your search." : "No enquiries yet."}</Empty>}
    </div>}

    {tab === "portfolio" && <div className="grid gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <form onSubmit={saveProject} className="panel h-fit space-y-3 rounded-xl p-6 border border-stone bg-white shadow-sm">
        <h2 className="font-serif-heading text-lg font-bold text-ink">{editing ? "Edit project" : "Add project"}</h2>
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
        {pf.map(p => <article key={p.id} className="panel flex items-start gap-4 p-4 bg-white border border-stone">
          {p.image_url ? <img src={p.image_url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
            : <div className="grid h-16 w-24 shrink-0 place-items-center rounded-lg bg-chalk text-xs text-slate border border-stone">No image</div>}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{p.title}</p>
            <p className="truncate text-sm text-slate">{p.category || "—"}{p.tech?.length ? ` · ${p.tech.join(", ")}` : ""}</p>
            {p.demo_url && <a className="mt-1 inline-flex items-center gap-1 text-xs text-indigo underline" href={p.demo_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} />Live demo</a>}
          </div>
          <div className="flex shrink-0 gap-1">
            <button className="rounded-lg p-2 text-slate hover:bg-stone/30 hover:text-ink" aria-label={`Edit ${p.title}`} onClick={() => editProject(p)}><Pencil size={16} /></button>
            <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${p.title}`} onClick={() => deleteProject(p.id)}><Trash2 size={16} /></button>
          </div>
        </article>)}
        {!pf.length && <Empty>No portfolio projects yet. Add your first one.</Empty>}
      </div>
    </div>}

    {tab === "pricing" && <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 panel p-6 rounded-xl border border-stone bg-white">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-ink">Pricing &amp; Quotation Engine</h2>
          <p className="text-xs text-slate mt-1">
            Update category starting prices, tier packaging, extra page rates, and feature addons without editing code. Changes apply immediately to public calculators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={savePricing}
            disabled={savingPricing}
            className="btn btn-p !px-5 !py-2.5 text-sm font-semibold"
          >
            <Save size={16} />
            <span>{savingPricing ? "Saving Changes..." : "Save Pricing Changes"}</span>
          </button>
          {pricingSavedToast && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <Check size={14} /> Saved &amp; Live!
            </span>
          )}
        </div>
      </div>

      {/* Global Computation Rates */}
      <div className="panel p-6 rounded-xl border border-stone bg-white">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
          Global Computation Rates
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-slate font-medium mb-1">Per Extra Page Charge (₹)</label>
            <input
              type="number"
              value={pricing.extraPageRate}
              onChange={(e) => setPricing({ ...pricing, extraPageRate: Number(e.target.value) || 0 })}
              className="inp"
            />
          </div>
          <div>
            <label className="block text-xs text-slate font-medium mb-1">Applicable GST Rate (%)</label>
            <input
              type="number"
              value={pricing.taxRate}
              onChange={(e) => setPricing({ ...pricing, taxRate: Number(e.target.value) || 0 })}
              className="inp"
            />
          </div>
          <div>
            <label className="block text-xs text-slate font-medium mb-1">Currency Code</label>
            <input
              type="text"
              disabled
              value={pricing.currency + " (INR)"}
              className="inp opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Categories & Tier Pricing */}
      <div className="panel p-6 rounded-xl border border-stone bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            Website Categories &amp; Package Tiers ({pricing.categories.length})
          </h3>
          <span className="text-xs text-slate">Starter price syncs with Starting From</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pricing.categories.map((cat, idx) => (
            <div key={cat.id} className="panel p-4 space-y-3 border border-stone bg-chalk/40">
              <div className="flex items-center justify-between border-b border-stone pb-2">
                <span className="font-semibold text-sm text-ink">{cat.name}</span>
                {cat.isComplex && (
                  <span className="text-xs bg-stone/50 text-slate px-2.5 py-1 rounded-full border border-stone font-medium">
                    Complex
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate mb-0.5">Starting From / Starter Tier (₹)</label>
                <input
                  type="number"
                  value={cat.startingPrice}
                  onChange={(e) => {
                    const updated = [...pricing.categories];
                    const val = Number(e.target.value) || 0;
                    updated[idx] = {
                      ...cat,
                      startingPrice: val,
                      packages: { ...cat.packages, starter: val },
                    };
                    setPricing({ ...pricing, categories: updated });
                  }}
                  className="inp !py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate mb-0.5">Professional (₹)</label>
                  <input
                    type="number"
                    value={cat.packages.professional}
                    onChange={(e) => {
                      const updated = [...pricing.categories];
                      updated[idx] = {
                        ...cat,
                        packages: { ...cat.packages, professional: Number(e.target.value) || 0 },
                      };
                      setPricing({ ...pricing, categories: updated });
                    }}
                    className="inp !py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate mb-0.5">Premium (₹)</label>
                  <input
                    type="number"
                    value={cat.packages.premium}
                    onChange={(e) => {
                      const updated = [...pricing.categories];
                      updated[idx] = {
                        ...cat,
                        packages: { ...cat.packages, premium: Number(e.target.value) || 0 },
                      };
                      setPricing({ ...pricing, categories: updated });
                    }}
                    className="inp !py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Addon Pricing */}
      <div className="panel p-6 rounded-xl border border-stone bg-white space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
          Feature Addon Pricing ({pricing.features.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.features.map((feat, fidx) => (
            <div key={feat.id} className="panel p-3 flex items-center justify-between gap-2 border border-stone bg-chalk/30">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-ink truncate">{feat.name}</div>
                <div className="text-xs text-slate truncate">{feat.description}</div>
              </div>
              <div className="w-24 shrink-0">
                <input
                  type="number"
                  value={feat.price}
                  onChange={(e) => {
                    const updated = [...pricing.features];
                    updated[fidx] = { ...feat, price: Number(e.target.value) || 0 };
                    setPricing({ ...pricing, features: updated });
                  }}
                  className="inp !py-1 !px-2 text-xs text-right"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Requirements */}
      <div className="panel p-6 rounded-xl border border-stone bg-white space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
          Special Requirements &amp; Boosters ({pricing.specialRequirements.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {pricing.specialRequirements.map((req, ridx) => (
            <div key={req.id} className="panel p-3 flex items-center justify-between gap-3 border border-stone bg-chalk/30">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-ink">{req.name}</div>
                <div className="text-xs text-slate">{req.description}</div>
              </div>
              <div className="w-28 shrink-0">
                <input
                  type="number"
                  value={req.price}
                  onChange={(e) => {
                    const updated = [...pricing.specialRequirements];
                    updated[ridx] = { ...req, price: Number(e.target.value) || 0 };
                    setPricing({ ...pricing, specialRequirements: updated });
                  }}
                  className="inp !py-1 !px-2 text-xs text-right"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>}
  </main>;
}
