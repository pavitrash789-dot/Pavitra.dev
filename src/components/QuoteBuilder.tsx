"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Check,
  Plus,
  Minus,
  Upload,
  X,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PACKAGES,
  DEFAULT_PRICING_CONFIG,
  type PricingConfig,
  type PackageTier,
  formatINR,
  calculatePricingBreakdown,
  type PricingBreakdown,
} from "@/lib/pricing";
import { categories as siteCategories, designs, site } from "@/lib/site";
import { useDraft } from "@/lib/store";

const PRIMARY_CATEGORY_IDS = [
  "landing",
  "portfolio",
  "business",
  "ecommerce",
  "booking",
  "custom",
];

export default function QuoteBuilder() {
  const { d, set, reset } = useDraft();
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Active selections
  const [selectedCategory, setSelectedCategory] = useState<string>("landing");
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>("professional");
  const [pages, setPages] = useState<number>(7);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "whatsapp_integration",
    "seo_optimization",
  ]);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  // Project details inputs
  const [purpose, setPurpose] = useState("");
  const [selectedDesign, setSelectedDesign] = useState("Modern");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientWhatsApp, setClientWhatsApp] = useState("");
  const [clientBusiness, setClientBusiness] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync category if global draft had one
  useEffect(() => {
    if (d.category) {
      setSelectedCategory(d.category);
    }
  }, [d.category]);

  // Load pricing config from API
  useEffect(() => {
    let active = true;
    fetch("/api/pricing")
      .then((res) => (res.ok ? res.json() : DEFAULT_PRICING_CONFIG))
      .then((data) => {
        if (active && data && Array.isArray(data.categories)) {
          setConfig(data);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_PRICING_CONFIG silently
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    set({ category: catId });
    setErrorMessage("");
  };

  const handlePackageSelect = (pkgId: PackageTier) => {
    setSelectedPackage(pkgId);
    const pkg = PACKAGES.find((p) => p.id === pkgId);
    if (pkg && pages < pkg.maxPages) {
      setPages(pkg.maxPages);
    }
  };

  const handlePagesChange = (delta: number) => {
    const pkg = PACKAGES.find((p) => p.id === selectedPackage);
    const minPages = pkg ? pkg.maxPages : 1;
    setPages((prev) => Math.max(minPages, Math.min(prev + delta, 30)));
  };

  const toggleFeature = (featId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featId) ? prev.filter((id) => id !== featId) : [...prev, featId]
    );
  };

  const toggleRequirement = (reqId: string) => {
    setSelectedRequirements((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  // Calculate live pricing breakdown
  const breakdown: PricingBreakdown = useMemo(() => {
    return calculatePricingBreakdown(
      {
        categoryId: selectedCategory,
        packageId: selectedPackage,
        pages,
        selectedFeatureIds: selectedFeatures,
        selectedRequirementIds: selectedRequirements,
      },
      config
    );
  }, [selectedCategory, selectedPackage, pages, selectedFeatures, selectedRequirements, config]);

  // File handlers
  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    if (incoming.some((f) => f.size > 10 * 1024 * 1024)) {
      setErrorMessage("Each file must be smaller than 10 MB.");
      return;
    }
    if (files.length + incoming.length > 5) {
      setErrorMessage("You can attach up to 5 files in total.");
      return;
    }
    setErrorMessage("");
    setFiles((prev) => [...prev, ...incoming]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = (): string => {
    if (!purpose.trim() || purpose.trim().length < 10) {
      return "Please write a short description of what your website needs (at least 10 characters).";
    }
    if (!clientName.trim()) {
      return "Please enter your name.";
    }
    if (!/^\S+@\S+\.\S+$/.test(clientEmail.trim())) {
      return "Please enter a valid email address.";
    }
    if (clientWhatsApp.replace(/\D/g, "").length < 10) {
      return "Please enter a valid 10-digit WhatsApp number so I can reach you.";
    }
    if (referenceUrl.trim() && !/^https?:\/\/\S+\.\S+/.test(referenceUrl.trim())) {
      return "The reference website URL must begin with http:// or https://";
    }
    return "";
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage("");
    setSubmitting(true);

    try {
      const payload = {
        name: clientName.trim(),
        email: clientEmail.trim(),
        whatsapp: clientWhatsApp.trim(),
        business: clientBusiness.trim() || undefined,
        category: breakdown.categoryName,
        package: breakdown.packageName,
        purpose: purpose.trim(),
        design: selectedDesign,
        pages: [`${breakdown.selectedPages} pages (${breakdown.packageName} tier)`],
        features: breakdown.selectedFeatures.map((f) => f.name),
        budget: `${formatINR(breakdown.estimatedTotal)} (Estimated)`,
        timeline: selectedRequirements.includes("express_delivery")
          ? "Express 5-7 days"
          : "Standard 2-3 weeks",
        reference_url: referenceUrl.trim() || undefined,
        notes: `Selected package: ${breakdown.packageName}, Total estimate: ${formatINR(breakdown.estimatedTotal)}`,
        pricing_breakdown: breakdown,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Could not submit your quote request. Please try again.");
      }

      setSubmitted(true);
      reset();
      setFiles([]);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to send request. You can also message me directly on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Generate WhatsApp message link with live quote
  const whatsappQuoteUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Hi Pavitra, I built a quote on your website for a ${breakdown.categoryName} (${breakdown.packageName} tier, ${breakdown.selectedPages} pages). Estimated: ${formatINR(breakdown.estimatedTotal)}. I'd like to discuss building this.`
    );
    const phoneDigits = (site.phone || "+917665534302").replace(/\D/g, "");
    return `https://wa.me/${phoneDigits}?text=${text}`;
  }, [breakdown]);

  const visibleCategories = showAllCategories
    ? config.categories
    : config.categories.filter((c) => PRIMARY_CATEGORY_IDS.includes(c.id));

  return (
    <section id="quote-builder" className="mx-auto max-w-6xl px-5 py-20 border-t border-stone">
      {/* Anchor targets to preserve compatibility with existing section IDs */}
      <div id="choose" className="sr-only" />
      <div id="customize" className="sr-only" />
      <div id="pricing" className="sr-only" />
      <div id="price-calculator" className="sr-only" />

      {/* Section Header */}
      <div className="max-w-2xl mb-12">
        <h2 className="font-serif-heading text-3xl font-medium md:text-4xl text-ink tracking-tight">
          Interactive quote builder
        </h2>
        <p className="mt-3 text-slate text-pretty leading-relaxed">
          Select what your business needs below to see an instant, itemized estimate. Every price is
          transparent, without agency markups, sales calls, or surprises.
        </p>
      </div>

      {submitted ? (
        <div className="panel p-8 md:p-12 text-center max-w-2xl mx-auto border-stone shadow-sm">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#E8ECE6] text-slate">
            <CheckCircle2 size={30} className="text-[#2C4036]" />
          </div>
          <h3 className="font-serif-heading text-2xl font-medium text-ink">
            Quote request received
          </h3>
          <p className="mt-3 text-slate text-pretty leading-relaxed max-w-lg mx-auto">
            Thank you, {clientName}. I will review your requirements and reply directly on WhatsApp
            ({clientWhatsApp}) or email within a few hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={whatsappQuoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-p"
            >
              <MessageCircle size={18} />
              <span>Message on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setPurpose("");
              }}
              className="btn btn-g"
            >
              Start another quote
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] items-start">
          {/* Main Customizer Column */}
          <form id="quote-builder-form" onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Choose Website Type */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-stone pb-3">
                <h3 className="font-serif-heading text-xl font-medium text-ink tracking-tight">
                  1. Choose your website type
                </h3>
                <span className="text-xs text-slate uppercase tracking-wider font-medium">
                  {selectedCategory ? "Selected" : "Step 1 of 3"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {visibleCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`relative text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                        isSelected
                          ? "bg-white border-2 border-indigo shadow-xs ring-1 ring-indigo/15 text-ink"
                          : "bg-white text-ink border-stone hover:border-slate/60 hover:bg-[#FAFBF9]"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-serif-heading text-sm md:text-base font-medium leading-snug">
                            {cat.name}
                          </span>
                          {isSelected && (
                            <span className="h-4 w-4 rounded-full bg-indigo text-white grid place-items-center shrink-0 mt-0.5">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-xs mt-3 pt-2 border-t tabular-numbers font-medium ${
                          isSelected
                            ? "text-slate border-indigo/20 font-semibold"
                            : "text-slate border-stone/50"
                        }`}
                      >
                        Starts at {formatINR(cat.startingPrice)}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Show more toggle */}
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-2 text-xs text-indigo hover:underline inline-flex items-center gap-1 font-medium transition-colors"
              >
                {showAllCategories ? (
                  <>
                    <ChevronUp size={14} /> Show primary categories only
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} /> See all 17 categories (Healthcare, Coaching, Restaurants, Gyms, SaaS, Real Estate...)
                  </>
                )}
              </button>
            </div>

            {/* Step 2: Package & Scale */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-stone pb-3">
                <h3 className="font-serif-heading text-xl font-medium text-ink tracking-tight">
                  2. Customize your package and features
                </h3>
                <span className="text-xs text-slate uppercase tracking-wider font-medium">
                  Step 2 of 3
                </span>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2.5">
                  Package Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    const currentCat = config.categories.find((c) => c.id === selectedCategory);
                    const pkgPrice = currentCat?.packages?.[pkg.id as PackageTier];
                    const isPro = pkg.id === "professional";

                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => handlePackageSelect(pkg.id as PackageTier)}
                        className={`relative text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                          isSelected
                            ? "bg-white border-2 border-indigo shadow-xs ring-1 ring-indigo/15 text-ink"
                            : "bg-white text-ink border-stone hover:border-slate/60 hover:bg-[#FAFBF9]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-serif-heading text-base font-semibold">
                              {pkg.name}
                            </span>
                            {isPro && (
                              <span className="text-xs font-sans font-medium tracking-wide px-2.5 py-1 rounded-full bg-[#ECEFEA] text-slate">
                                Standard
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate">
                            Up to {pkg.maxPages} pages included
                          </div>
                        </div>

                        <div
                          className={`text-sm mt-4 pt-2.5 border-t tabular-numbers font-medium ${
                            isSelected
                              ? "text-indigo font-semibold border-indigo/20"
                              : "text-ink border-stone/60"
                          }`}
                        >
                          {pkgPrice ? formatINR(pkgPrice) : "—"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page Counter */}
              <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone rounded-xl">
                <div>
                  <div className="text-sm font-semibold text-ink">Total page count</div>
                  <div className="text-xs text-slate mt-0.5">
                    Tier includes {PACKAGES.find((p) => p.id === selectedPackage)?.maxPages} pages. Additional pages calculated at ₹500/page.
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handlePagesChange(-1)}
                    aria-label="Decrease pages"
                    className="h-9 w-9 rounded-full border border-stone bg-[#F8F9F7] grid place-items-center text-ink hover:bg-stone transition-all active:scale-95 shadow-2xs"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-serif-heading text-xl font-semibold text-ink tabular-numbers">
                    {pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePagesChange(1)}
                    aria-label="Increase pages"
                    className="h-9 w-9 rounded-full border border-stone bg-[#F8F9F7] grid place-items-center text-ink hover:bg-stone transition-all active:scale-95 shadow-2xs"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Add-on Features */}
              <div>
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2.5">
                  Optional Add-on Features
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {config.features.slice(0, 8).map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    return (
                      <label
                        key={feat.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer text-xs transition-all duration-150 select-none ${
                          isChecked
                            ? "bg-white border-2 border-indigo/80 shadow-xs ring-1 ring-indigo/15 text-ink font-medium"
                            : "bg-white border-stone text-ink hover:border-slate/60 hover:bg-[#FAFBF9]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFeature(feat.id)}
                            className="rounded border-stone text-indigo focus:ring-indigo h-4 w-4"
                          />
                          <span className="text-xs text-ink">{feat.name}</span>
                        </div>
                        <span className="text-slate tabular-numbers font-medium">
                          +{formatINR(feat.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2.5">
                  Delivery Speed &amp; Special Requirements
                </label>
                <div className="space-y-2">
                  {(config.specialRequirements || []).map((req) => {
                    const isChecked = selectedRequirements.includes(req.id);
                    return (
                      <label
                        key={req.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer text-xs transition-all duration-150 select-none ${
                          isChecked
                            ? "bg-white border-2 border-indigo/80 shadow-xs ring-1 ring-indigo/15 text-ink font-medium"
                            : "bg-white border-stone text-ink hover:border-slate/60 hover:bg-[#FAFBF9]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleRequirement(req.id)}
                            className="rounded border-stone text-indigo focus:ring-indigo h-4 w-4"
                          />
                          <span className="text-xs text-ink">{req.name}</span>
                        </div>
                        <span className="text-slate tabular-numbers font-medium">
                          +{formatINR(req.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Project Details & Contact */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-stone pb-3">
                <h3 className="font-serif-heading text-xl font-medium text-ink tracking-tight">
                  3. Project details and your contact
                </h3>
                <span className="text-xs text-slate uppercase tracking-wider font-medium">
                  Final step
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    What does your website need? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="E.g. A multi-page website for my coaching institute in Kota with course listings, student results, and WhatsApp enquiry button."
                    className="inp text-sm"
                  />
                  <div className="text-xs text-slate mt-1">
                    Describe your business and any specific pages or features you have in mind.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Preferred visual style
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {designs.slice(0, 5).map((style) => (
                      <button
                        type="button"
                        key={style}
                        onClick={() => setSelectedDesign(style)}
                        className={`chip text-xs ${
                          selectedDesign === style
                            ? "!bg-ink !border-ink !text-white font-medium"
                            : ""
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Your name *
                    </label>
                    <input
                      required
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="inp text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      WhatsApp number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={clientWhatsApp}
                      onChange={(e) => setClientWhatsApp(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="inp text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Email address *
                    </label>
                    <input
                      required
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="inp text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Business or shop name (optional)
                    </label>
                    <input
                      type="text"
                      value={clientBusiness}
                      onChange={(e) => setClientBusiness(e.target.value)}
                      placeholder="e.g. Verma Classes"
                      className="inp text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Reference website link (optional)
                  </label>
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="inp text-sm"
                  />
                </div>

                {/* File Upload Attachment */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Attach reference files or logos (optional, max 5 files, &lt;10 MB each)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => handleAddFiles(e.target.files)}
                      className="hidden"
                      id="quote-file-input"
                    />
                    <label
                      htmlFor="quote-file-input"
                      className="btn btn-g !py-2 !px-3.5 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>Choose files</span>
                    </label>
                    <span className="text-xs text-slate">
                      {files.length === 0 ? "No files selected" : `${files.length} attached`}
                    </span>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-white border border-stone rounded-md px-3 py-1.5 shadow-2xs"
                        >
                          <span className="truncate max-w-[240px] text-ink font-medium">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-slate hover:text-ink ml-2 p-1.5 rounded hover:bg-stone/30 transition-colors inline-flex items-center justify-center"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-3 bg-[#FBF0EE] border border-[#F2C4BE] text-[#9A281E] rounded-md text-xs flex items-center gap-2"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile submit action in form */}
            <div className="lg:hidden pt-4 space-y-3">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-[#17201B] w-full !py-3.5 text-sm font-semibold justify-center"
              >
                <MessageCircle size={17} />
                <span>Send quote to WhatsApp ({formatINR(breakdown.estimatedTotal)})</span>
              </a>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-g w-full !py-3 text-sm font-medium justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Submitting quote...</span>
                  </>
                ) : (
                  <span>Submit enquiry form</span>
                )}
              </button>
            </div>
          </form>

          {/* Sticky Total Column: Architectural Studio Voucher */}
          <div className="p-6 md:p-7 border border-stone sticky top-24 space-y-6 shadow-xs bg-white rounded-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate">
                  Studio Quotation
                </span>
                <span className="text-xs text-slate bg-[#ECEFEA] px-2.5 py-1 rounded-full font-medium">
                  Instant estimate
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-heading text-4xl sm:text-5xl font-medium text-ink tabular-numbers tracking-tight">
                  {formatINR(breakdown.estimatedTotal)}
                </span>
                <span className="text-xs text-slate font-medium">INR</span>
              </div>
              <p className="text-xs text-slate mt-1.5 leading-relaxed">
                Itemized calculation for {breakdown.categoryName} ({breakdown.packageName} tier).
              </p>
            </div>

            {/* Itemized Line Items */}
            <div className="border-t border-stone pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-ink">
                <span>{breakdown.categoryName} base</span>
                <span className="tabular-numbers font-medium">{formatINR(breakdown.startingPrice)}</span>
              </div>
              <div className="flex justify-between text-ink">
                <span>
                  {breakdown.packageName} tier ({breakdown.includedPages} pages)
                </span>
                <span className="tabular-numbers font-medium">
                  {formatINR(breakdown.selectedPackagePrice)}
                </span>
              </div>
              {breakdown.extraPages > 0 && (
                <div className="flex justify-between text-ink">
                  <span>{breakdown.extraPages} additional pages</span>
                  <span className="tabular-numbers font-medium text-slate">
                    +{formatINR(breakdown.extraPagesCost)}
                  </span>
                </div>
              )}
              {breakdown.featuresCost > 0 && (
                <div className="flex justify-between text-ink">
                  <span>{breakdown.selectedFeatures.length} features selected</span>
                  <span className="tabular-numbers font-medium text-slate">
                    +{formatINR(breakdown.featuresCost)}
                  </span>
                </div>
              )}
              {breakdown.specialRequirementsCost > 0 && (
                <div className="flex justify-between text-ink">
                  <span>Special delivery options</span>
                  <span className="tabular-numbers font-medium text-slate">
                    +{formatINR(breakdown.specialRequirementsCost)}
                  </span>
                </div>
              )}
            </div>

            {/* Error display on sticky panel */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3 bg-[#FBF0EE] border border-[#F2C4BE] text-[#9A281E] rounded-md text-xs flex items-center gap-2"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Call to action buttons */}
            <div className="pt-2 space-y-3">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-[#17201B] w-full !py-3.5 text-sm font-semibold justify-center"
              >
                <MessageCircle size={17} />
                <span>Send quote to WhatsApp</span>
              </a>

              <button
                type="submit"
                form="quote-builder-form"
                disabled={submitting}
                className="btn btn-g w-full !py-3 text-sm font-medium justify-center text-ink hover:text-ink hidden lg:inline-flex"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Submitting enquiry...</span>
                  </>
                ) : (
                  <span>Submit web enquiry</span>
                )}
              </button>
            </div>

            {/* Reassurance notes */}
            <div className="border-t border-stone pt-4 text-xs text-slate space-y-2">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-indigo shrink-0" />
                <span>Direct conversation with Pavitra Sharma.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-indigo shrink-0" />
                <span>No spam, sales calls, or agency overhead.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-indigo shrink-0" />
                <span>Fixed price confirmed before work begins.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
