"use client";
import React, { useState, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { categories, common, allFeatures, pagesList, designs, steps } from "@/lib/site";
import { useDraft } from "@/lib/store";

const toggle = (a: string[], v: string) =>
  a.includes(v) ? a.filter((x) => x !== v) : [...a, v];

const Chips = ({
  items,
  sel,
  on,
  multi = true,
}: {
  items: string[];
  sel: string[];
  on: (v: string) => void;
  multi?: boolean;
}) => (
  <div className="flex flex-wrap gap-2.5" role={multi ? "group" : "radiogroup"}>
    {items.map((i) => {
      const isSelected = sel.includes(i);
      return (
        <button
          type="button"
          key={i}
          aria-pressed={isSelected}
          className={`chip transition-all duration-200 ${
            isSelected
              ? "!border-brand !bg-brand/25 shadow-[0_0_15px_rgba(139,123,255,0.3)] text-white font-medium"
              : "hover:border-white/30 text-white/80"
          }`}
          onClick={() => on(i)}
        >
          {i} {isSelected && "✓"}
        </button>
      );
    })}
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
    {children}
  </label>
);

export default function Wizard() {
  const { d, set, reset } = useDraft();
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cat = categories.find((c) => c.id === d.category);
  const defaultFeats =
    cat?.id === "custom"
      ? allFeatures
      : allFeatures.filter((f) => common.includes(f) || cat?.feat.includes(f));
  const feats = showAllFeatures ? allFeatures : defaultFeats;

  const validate = (s: number): string => {
    if (s === 0 && !cat) return "Please choose a website type to get started.";
    if (s === 1 && d.purpose.trim().length < 10)
      return "Tell me a little about the purpose (at least 10 characters).";
    if (s === 2 && !d.design) return "Choose a preferred design style.";
    if (s === 3 && d.pages.length === 0) return "Select at least one page you need.";
    if (s === 5) {
      if (!d.name.trim()) return "Your name is required.";
      if (!/^\S+@\S+\.\S+$/.test(d.email)) return "Enter a valid email address.";
      if (d.whatsapp.replace(/\D/g, "").length < 10)
        return "Enter a valid WhatsApp number (at least 10 digits).";
      if (d.reference_url && !/^https?:\/\/\S+\.\S+/.test(d.reference_url))
        return "Reference URL must start with http:// or https://";
    }
    return "";
  };

  const go = (n: number) => {
    setErr("");
    set({ step: n });
  };

  const next = () => {
    const e = validate(d.step);
    if (e) return setErr(e);
    go(d.step + 1);
  };

  const addFiles = (list: FileList | null) => {
    const f = [...(list ?? [])];
    if (f.some((x) => x.size > 10 * 1024 * 1024)) {
      return setErr("Each file must be under 10 MB.");
    }
    if (files.length + f.length > 5) {
      return setErr("You can upload up to 5 files in total.");
    }
    setErr("");
    setFiles((prev) => [...prev, ...f]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, j) => j !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async () => {
    for (const s of [0, 1, 2, 3, 5]) {
      const e = validate(s);
      if (e) {
        setErr(e);
        set({ step: s });
        return;
      }
    }
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(d));
      files.forEach((f) => fd.append("files", f));
      const r = await fetch("/api/submit", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setDone(true);
      reset();
      setFiles([]);
    } catch (e: any) {
      setErr(e.message || "Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <section id="customize" className="relative mx-auto max-w-3xl px-5 py-24">
        <div
          className="glass rounded-3xl p-10 text-center border border-brand-2/30 shadow-[0_0_80px_-20px_rgba(56,225,198,0.3)]"
          role="status"
        >
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-2/20 text-brand-2 shadow-lg">
            <CheckCircle2 size={38} />
          </div>
          <h2 className="font-display text-3xl font-bold text-white">Project Request Received!</h2>
          <p className="mt-3 text-white/70 max-w-md mx-auto leading-relaxed">
            Thank you! I will review all your requirements, design preferences, and assets, then contact
            you directly via WhatsApp or email with a tailored roadmap and quotation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              className="btn btn-p"
              onClick={() => {
                setDone(false);
                go(0);
              }}
            >
              Start Another Request
            </button>
            <a href="#portfolio" className="btn btn-g">
              View My Portfolio
            </a>
          </div>
        </div>
      </section>
    );
  }

  const review: [string, string, number][] = [
    ["Website Type", cat?.name ?? "—", 0],
    ["Package Tier", d.package ? d.package.toUpperCase() : "STARTER", 0],
    ["Purpose", d.purpose || "—", 1],
    ["Design Style", d.design || "—", 2],
    ["Selected Pages", d.pages.join(", ") || "None", 3],
    ["Features", d.features.join(", ") || "Standard basic package", 4],
    [
      "Contact Details",
      `${d.name} · ${d.business || "Individual / No Business Name"} · ${d.email} · ${d.whatsapp}`,
      5,
    ],
    [
      "Budget & Timeline",
      `Budget: ${d.pricing_breakdown ? `₹${d.pricing_breakdown.estimatedTotal?.toLocaleString("en-IN")} (Estimated)` : (d.budget || "Starting From Category Base")} · Timeline: ${d.timeline || "Flexible"} · Ref: ${d.reference_url || "None"} · Files: ${files.length} attached`,
      5,
    ],
  ];

  return (
    <section id="customize" className="relative mx-auto max-w-3xl px-5 py-24">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          Step 2 · Configuration
        </span>
        <h2 className="mt-1 font-display text-3xl font-bold md:text-5xl">
          Customize your <span className="grad">website</span>
        </h2>
        <p className="mt-2 text-white/60">
          Tailor your vision step by step. I will handle the architecture, design, and code.
        </p>
      </div>

      {/* Progress Bar & Indicators */}
      <ol className="mt-6 flex gap-2" aria-label="Project customization progress">
        {steps.map((s, i) => (
          <li key={s} className="flex-1">
            <button
              type="button"
              onClick={() => i < d.step && go(i)}
              disabled={i > d.step}
              className="w-full text-left cursor-pointer disabled:cursor-default"
              aria-label={`Go to step ${i + 1}: ${s}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  i <= d.step
                    ? "bg-gradient-to-r from-brand to-brand-2 shadow-[0_0_12px_rgba(139,123,255,0.5)]"
                    : "bg-white/10"
                }`}
              />
              <span
                className={`mt-1.5 hidden text-xs transition-colors sm:block ${
                  i === d.step ? "text-brand-2 font-semibold" : "text-white/40"
                }`}
              >
                {s}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Main Glass Card Form */}
      <div className="glass mt-8 rounded-3xl p-6 md:p-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        {/* Step 0: Category Selection */}
        {d.step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold">Select Website Type</h3>
              {cat && (
                <span className="text-xs text-brand-2 font-medium">
                  Currently selected: {cat.name}
                </span>
              )}
            </div>
            <p className="text-sm text-white/60">
              Pick the category that fits your vision best:
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2 pt-2">
              {categories.map((c) => {
                const isSelected = d.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set({ category: c.id, features: [] })}
                    className={`card p-4 text-left flex items-start justify-between gap-3 transition-all ${
                      isSelected
                        ? "!border-brand bg-brand/15 shadow-[0_0_20px_rgba(139,123,255,0.3)]"
                        : "hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p className="font-display font-semibold text-white">{c.name}</p>
                      <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{c.desc}</p>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 text-brand text-xs font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Purpose */}
        {d.step === 1 && (
          <div className="space-y-3">
            <h3 className="font-display text-2xl font-bold">What is this website for?</h3>
            <p className="text-sm text-white/60">
              Describe your primary objective, target audience, or what you want visitors to do.
            </p>
            <Field label="Website Purpose &amp; Goals">
              <textarea
                className="inp min-h-36 leading-relaxed"
                value={d.purpose}
                onChange={(e) => set({ purpose: e.target.value })}
                placeholder="e.g. A luxury online store for handmade silver jewellery in India, featuring razorpay checkout, customer accounts, and fast mobile browsing..."
              />
            </Field>
          </div>
        )}

        {/* Step 2: Design Style */}
        {d.step === 2 && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">Choose your design aesthetic</h3>
            <p className="text-sm text-white/60">
              Select the mood and visual direction you want your visitors to experience.
            </p>
            <Chips
              multi={false}
              items={designs}
              sel={[d.design]}
              on={(v) => set({ design: v })}
            />
          </div>
        )}

        {/* Step 3: Pages Needed */}
        {d.step === 3 && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">Which pages do you need?</h3>
            <p className="text-sm text-white/60">
              Select all pages to include in the sitemap. You can choose multiple.
            </p>
            <Chips
              items={pagesList}
              sel={d.pages}
              on={(v) => set({ pages: toggle(d.pages, v) })}
            />
          </div>
        )}

        {/* Step 4: Required Features */}
        {d.step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold">Required Features &amp; Modules</h3>
                <p className="text-sm text-white/60 mt-1">
                  Select the capabilities your website needs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="text-xs text-brand underline cursor-pointer hover:text-white"
              >
                {showAllFeatures ? "Show Recommended" : "Show All Features"}
              </button>
            </div>

            <Chips
              items={feats}
              sel={d.features}
              on={(v) => set({ features: toggle(d.features, v) })}
            />
          </div>
        )}

        {/* Step 5: Contact & Specifications */}
        {d.step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display text-2xl font-bold">Your Details &amp; Scope</h3>
              <p className="text-sm text-white/60">
                Where should I reach out to you with your proposal and quotation?
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your Name *">
                <input
                  required
                  className="inp"
                  value={d.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  autoComplete="name"
                />
              </Field>

              <Field label="Business or Brand Name">
                <input
                  className="inp"
                  value={d.business}
                  onChange={(e) => set({ business: e.target.value })}
                  placeholder="e.g. Aurelia Designs"
                />
              </Field>

              <Field label="Email Address *">
                <input
                  type="email"
                  required
                  className="inp"
                  value={d.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="WhatsApp Number *">
                <input
                  type="tel"
                  required
                  className="inp"
                  value={d.whatsapp}
                  onChange={(e) => set({ whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Additional Project Details or Notes">
                  <textarea
                    className="inp min-h-24"
                    value={d.description}
                    onChange={(e) => set({ description: e.target.value })}
                    placeholder="Specific integrations, competitor inspirations, or brand colors..."
                  />
                </Field>
              </div>

              <Field label="Reference Website URL">
                <input
                  className="inp"
                  value={d.reference_url}
                  onChange={(e) => set({ reference_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </Field>

              <Field label="Expected Budget">
                <select
                  className="inp"
                  value={d.budget}
                  onChange={(e) => set({ budget: e.target.value })}
                >
                  <option value="">Select budget range</option>
                  {[
                    "Under ₹10,000",
                    "₹10,000–₹25,000",
                    "₹25,000–₹50,000",
                    "₹50,000+",
                    "Flexible / Not sure yet",
                  ].map((o) => (
                    <option key={o} value={o} className="text-black">
                      {o}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Delivery Timeline">
                <select
                  className="inp"
                  value={d.timeline}
                  onChange={(e) => set({ timeline: e.target.value })}
                >
                  <option value="">Select delivery timeline</option>
                  {[
                    "Urgent / ASAP (under 1 week)",
                    "1–2 weeks",
                    "2–4 weeks",
                    "1–2 months",
                    "Flexible",
                  ].map((o) => (
                    <option key={o} value={o} className="text-black">
                      {o}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Logos, Brand Assets or Docs (Max 5 files, 10MB each)">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="inp file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/30"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </Field>

              {files.length > 0 && (
                <div className="sm:col-span-2 rounded-xl bg-white/5 p-3 border border-white/5">
                  <p className="text-xs uppercase font-semibold text-white/40 mb-2">
                    Attached Files ({files.length}/5):
                  </p>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span className="truncate max-w-xs">{f.name}</span>
                        <button
                          type="button"
                          className="text-red-300 hover:text-red-200 underline font-medium ml-2 cursor-pointer"
                          onClick={() => removeFile(i)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {d.step === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-2xl font-bold">Review Your Project</h3>
              <p className="text-sm text-white/60">
                Please double-check your requirements before sending.
              </p>
            </div>

            <dl className="space-y-3 pt-2">
              {review.map(([k, v, s]) => (
                <div
                  key={k}
                  className="flex items-start justify-between gap-4 border-b border-white/10 pb-3"
                >
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      {k}
                    </dt>
                    <dd className="mt-0.5 break-words text-sm text-white/90">{v}</dd>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-brand font-medium underline hover:text-white shrink-0 mt-1 cursor-pointer"
                    onClick={() => go(s)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Error notification */}
        {err && (
          <div
            role="alert"
            className="mt-6 flex items-center gap-2.5 rounded-xl border border-red-400/30 bg-red-400/10 p-3.5 text-sm text-red-200"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{err}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            className="btn btn-g"
            disabled={d.step === 0 || busy}
            onClick={() => go(d.step - 1)}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {d.step < 6 ? (
            <button type="button" className="btn btn-p" onClick={next}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-p"
              disabled={busy}
              onClick={submit}
            >
              {busy ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Submitting Project Request...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Submit Project Request</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
