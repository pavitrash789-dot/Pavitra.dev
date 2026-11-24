"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  Calculator,
  ShieldCheck,
  Info,
  Clock,
  Zap,
  Layers,
  Sliders,
  Send,
  CheckCircle2,
  X,
  ArrowRight,
  Flame,
  AlertTriangle,
  Building,
  Server,
  FileCheck,
  ChevronDown,
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
import { categories as siteCategories, site } from "@/lib/site";
import { useDraft } from "@/lib/store";
import Tilt3D from "@/components/3d/Tilt3D";

export default function Pricing() {
  const { d, set } = useDraft();
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Active selections
  const [selectedCategory, setSelectedCategory] = useState<string>("landing");
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>("professional");
  const [pages, setPages] = useState<number>(7);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "whatsapp_integration",
    "seo_optimization",
  ]);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  // Quote modal state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteBusiness, setQuoteBusiness] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  // Sync category with global draft if already picked
  useEffect(() => {
    if (d.category) {
      const match = config.categories.find((c) => c.id === d.category);
      if (match) setSelectedCategory(d.category);
    }
  }, [d.category, config.categories]);

  // Fetch dynamic pricing config from server (admin can change without code edits)
  useEffect(() => {
    let isMounted = true;
    fetch("/api/pricing")
      .then((res) => (res.ok ? res.json() : DEFAULT_PRICING_CONFIG))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.categories)) {
          setConfig(data);
        }
      })
      .catch((err) => {
        console.warn("Using default pricing config:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingConfig(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update page count default when package changes
  const handlePackageSelect = (pkgId: PackageTier) => {
    setSelectedPackage(pkgId);
    const pkg = PACKAGES.find((p) => p.id === pkgId);
    if (pkg && pages < pkg.maxPages) {
      setPages(pkg.maxPages);
    }
  };

  // Toggle feature
  const toggleFeature = (featId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featId) ? prev.filter((id) => id !== featId) : [...prev, featId]
    );
  };

  // Toggle special requirement
  const toggleRequirement = (reqId: string) => {
    setSelectedRequirements((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  // Calculate live breakdown
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

  // Current category data
  const currentCategoryData = useMemo(() => {
    return (
      config.categories.find((c) => c.id === selectedCategory) || config.categories[0]
    );
  }, [selectedCategory, config.categories]);

  // Action: Choose this plan & scroll to customizer
  const handleChoosePlan = (pkgId: PackageTier) => {
    handlePackageSelect(pkgId);
    const updatedBreakdown = calculatePricingBreakdown(
      {
        categoryId: selectedCategory,
        packageId: pkgId,
        pages: Math.max(pages, PACKAGES.find((p) => p.id === pkgId)?.maxPages || 3),
        selectedFeatureIds: selectedFeatures,
        selectedRequirementIds: selectedRequirements,
      },
      config
    );

    // Save into global draft store
    set({
      category: selectedCategory,
      package: pkgId,
      pricing_breakdown: updatedBreakdown,
      budget: `${formatINR(updatedBreakdown.estimatedTotal)} (Estimated)`,
      step: 1, // Advance into purpose / customization step
    });

    // Smooth scroll down to interactive calculator or project customizer
    const customizerEl = document.getElementById("price-calculator");
    if (customizerEl) {
      customizerEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submit formal quotation request with breakdown
  const submitCustomQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteError("");

    if (!quoteName.trim()) {
      return setQuoteError("Please enter your name.");
    }
    if (!/^\S+@\S+\.\S+$/.test(quoteEmail)) {
      return setQuoteError("Please enter a valid email address.");
    }
    if (quotePhone.replace(/\D/g, "").length < 10) {
      return setQuoteError("Please enter a valid 10-digit WhatsApp or phone number.");
    }

    setSubmittingQuote(true);

    try {
      const payload = {
        name: quoteName.trim(),
        email: quoteEmail.trim(),
        whatsapp: quotePhone.trim(),
        business: quoteBusiness.trim() || undefined,
        category: breakdown.categoryName,
        package: breakdown.packageName,
        purpose: `Official quotation enquiry for ${breakdown.categoryName} (${breakdown.packageName} package, ${breakdown.selectedPages} pages). Estimated: ${formatINR(breakdown.estimatedTotal)}. Notes: ${quoteNotes.trim() || "No extra notes"}`,
        design: "Modern",
        pages: [`${breakdown.selectedPages} Pages (${breakdown.packageName} tier)`],
        features: breakdown.selectedFeatures.map((f) => f.name),
        budget: `${formatINR(breakdown.estimatedTotal)} (Estimated)`,
        timeline: selectedRequirements.includes("express_delivery") ? "Express 5-7 Days" : "Standard 2-3 Weeks",
        pricing_breakdown: breakdown,
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));

      const res = await fetch("/api/submit", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit quotation enquiry.");

      setQuoteSuccess(true);
    } catch (err: any) {
      setQuoteError(err.message || "Failed to send enquiry. Please try WhatsApp directly.");
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 -translate-x-1/2 blur-3xl opacity-20">
        <div className="h-96 w-[50rem] rounded-full bg-gradient-to-tr from-brand to-brand-2" />
      </div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full bg-brand-2/10 border border-brand-2/30 px-3.5 py-1 text-xs font-semibold text-brand-2 mb-4"
        >
          <Sparkles size={14} />
          <span>Transparent & Scalable Pricing</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-extrabold sm:text-5xl tracking-tight text-white"
        >
          Predictable Investments, <span className="grad">Zero Surprises</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-white/70"
        >
          All starting prices listed in Indian Rupees (₹). Select your category to view tailored
          packages or build a live quotation with our dynamic price calculator.
        </motion.p>
      </div>

      {/* Category Starting Prices Quick Switcher Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-1.5">
            <Layers size={14} className="text-brand-2" />
            Website Categories &amp; Starting Prices
          </span>
          <span className="text-xs text-white/40 hidden sm:inline">
            Click any category to compare packages &amp; calculate live prices
          </span>
        </div>

        {/* Horizontal scrollable pills with Starting From ₹ */}
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
          {config.categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`snap-start shrink-0 rounded-2xl border px-4 py-2.5 text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-brand/20 border-brand text-white shadow-[0_0_20px_rgba(139,123,255,0.4)]"
                    : "glass border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                <div className="text-xs font-semibold">{cat.name}</div>
                <div className="mt-0.5 text-xs font-bold text-brand-2">
                  Starting From {formatINR(cat.startingPrice)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Package Tier System: 3 Cards for Selected Category */}
      <div className="mb-20">
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl font-bold text-white">
            Packages for <span className="text-brand-2">{currentCategoryData.name}</span>
          </h3>
          <p className="text-sm text-white/60 mt-1">
            Carefully curated tiers with defined deliverables, responsiveness, and speed guarantees.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {PACKAGES.map((pkg, idx) => {
            const isPopular = pkg.popular;
            const isSelected = selectedPackage === pkg.id;
            const price = currentCategoryData.packages[pkg.id] ?? currentCategoryData.startingPrice;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full flex"
              >
                <Tilt3D
                  maxAngle={8}
                  scale={1.02}
                  className={`card relative w-full p-7 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? "border-brand-2/50 ring-1 ring-brand-2/40 shadow-[0_0_40px_rgba(56,225,198,0.25)] bg-gradient-to-b from-brand/10 to-transparent"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Top Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-white/60">
                        {pkg.name}
                      </span>
                      {isPopular && (
                        <span className="flex items-center gap-1 rounded-full bg-brand-2/20 border border-brand-2/40 px-2.5 py-1 text-xs font-semibold text-brand-2 shadow-sm">
                          <Flame size={12} />
                          {pkg.badge}
                        </span>
                      )}
                      {!isPopular && pkg.badge && (
                        <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/60">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    {/* Price in INR */}
                    <div className="mb-4">
                      <div className="text-xs text-white/50 mb-1">Starting From</div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                          {formatINR(price)}
                        </span>
                        <span className="text-xs text-white/50 font-medium">/ project</span>
                      </div>
                      <div className="mt-1 text-xs text-brand-2 font-medium">
                        Includes up to {pkg.maxPages} bespoke pages
                      </div>
                    </div>

                    <p className="text-xs text-white/65 leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-2.5 mb-8">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
                        What&apos;s Included:
                      </div>
                      {pkg.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-xs text-white/80">
                          <div className="grid h-4 w-4 place-items-center rounded-full bg-brand-2/20 text-brand-2 mt-0.5 shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Choose This Plan CTA */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleChoosePlan(pkg.id)}
                      className={`btn w-full justify-center !py-3 text-sm font-semibold transition-all ${
                        isPopular ? "btn-p" : "btn-g"
                      } ${isSelected ? "ring-2 ring-brand-2" : ""}`}
                    >
                      <span>Choose This Plan</span>
                      <ArrowRight size={16} />
                    </button>
                    <div className="mt-2 text-center text-xs text-white/40">
                      Zero upfront charge · Instant quote calculation
                    </div>
                  </div>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>

        {/* Complex Project Notice (SaaS & Custom Apps) */}
        {currentCategoryData.isComplex && (
          <div className="mt-6 glass rounded-2xl p-4 border border-brand/30 flex items-start gap-3 bg-brand/5">
            <Info size={18} className="text-brand-2 shrink-0 mt-0.5" />
            <div className="text-xs text-white/70 leading-relaxed">
              <strong className="text-white font-semibold">Specialized Architecture Note: </strong>
              {currentCategoryData.notes ||
                "SaaS and custom web applications involve tailored database modeling, authentication systems, and cloud architecture. Exact milestones and scope are finalized through technical discovery."}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Live Price Calculator */}
      <div id="price-calculator" className="relative scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-white/75 mb-3">
            <Calculator size={13} className="text-brand-2" />
            Interactive Estimation Tool
          </div>
          <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
            Dynamic <span className="grad">Price Calculator</span>
          </h3>
          <p className="text-sm text-white/60 mt-2">
            Configure your exact website scope in real-time. Review line-item charges and generate
            an estimated investment proposal.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 glass rounded-3xl p-6 sm:p-8 border border-white/10">
            {/* Step 1: Website Category */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-white/60 mb-2">
                1. Select Website Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand appearance-none"
                >
                  {config.categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                      {c.name} — Starting From {formatINR(c.startingPrice)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
                />
              </div>
            </div>

            {/* Step 2: Package Tier */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-white/60 mb-2">
                2. Select Package Tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PACKAGES.map((pkg) => {
                  const active = selectedPackage === pkg.id;
                  const tierPrice =
                    currentCategoryData.packages[pkg.id] ?? currentCategoryData.startingPrice;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        active
                          ? "bg-brand/25 border-brand text-white shadow-[0_0_15px_rgba(139,123,255,0.3)]"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold">{pkg.name}</div>
                      <div className="text-xs text-brand-2 mt-0.5">{formatINR(tierPrice)}</div>
                      <div className="text-xs text-white/40 mt-0.5">Up to {pkg.maxPages} pgs</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Number of Pages Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-bold tracking-wider text-white/60">
                  3. Total Number of Pages
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">
                    Included: <strong className="text-white">{breakdown.includedPages}</strong>
                  </span>
                  <span className="rounded-lg bg-brand/20 border border-brand/40 px-2.5 py-1 text-xs font-bold text-brand">
                    {pages} Pages
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="25"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full accent-brand h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>1 Page (Single Page/Landing)</span>
                <span>12 Pages (Standard)</span>
                <span>25 Pages (Large Site)</span>
              </div>

              {breakdown.extraPages > 0 ? (
                <div className="mt-2 text-xs text-brand-2 bg-brand-2/10 border border-brand-2/20 rounded-lg px-3 py-1.5 flex items-center justify-between">
                  <span>
                    +{breakdown.extraPages} extra pages (beyond {breakdown.includedPages} included)
                  </span>
                  <span className="font-semibold">
                    +{formatINR(breakdown.extraPagesCost)} ({formatINR(config.extraPageRate)}/pg)
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-xs text-white/50">
                  All {pages} pages included in {breakdown.packageName} package tier without extra charges.
                </div>
              )}
            </div>

            {/* Step 4: Additional Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-bold tracking-wider text-white/60">
                  4. Additional Features &amp; Modules
                </label>
                <span className="text-xs text-white/40">Select all that apply</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {config.features.map((feat) => {
                  const checked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      className={`flex items-start justify-between gap-2 rounded-xl border p-3 text-left transition-all ${
                        checked
                          ? "bg-brand/20 border-brand/60 text-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`grid h-4 w-4 place-items-center rounded border mt-0.5 shrink-0 ${
                            checked
                              ? "bg-brand border-brand text-white"
                              : "border-white/30 bg-white/5"
                          }`}
                        >
                          {checked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{feat.name}</div>
                          <div className="text-xs text-white/50 line-clamp-1">
                            {feat.description}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-brand-2">
                        +{formatINR(feat.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Special Requirements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-bold tracking-wider text-white/60">
                  5. Special Requirements &amp; Addons
                </label>
                <span className="text-xs text-white/40">Optional execution boosters</span>
              </div>

              <div className="space-y-2">
                {config.specialRequirements.map((req) => {
                  const checked = selectedRequirements.includes(req.id);
                  return (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                        checked
                          ? "bg-brand-2/15 border-brand-2/50 text-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`grid h-4 w-4 place-items-center rounded border shrink-0 ${
                            checked
                              ? "bg-brand-2 border-brand-2 text-black"
                              : "border-white/30 bg-white/5"
                          }`}
                        >
                          {checked && <Check size={11} strokeWidth={3} className="text-black" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold">{req.name}</span>
                          <span className="text-xs text-white/50 ml-2 hidden sm:inline">
                            — {req.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-2">
                        +{formatINR(req.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Breakdown Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="card p-6 sm:p-7 border border-white/15 shadow-2xl relative overflow-hidden bg-gradient-to-b from-white/[0.07] to-white/[0.02]">
              {/* Estimated Price Label */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-2 flex items-center gap-1.5">
                    <Sliders size={13} />
                    Live Quotation Estimate
                  </span>
                  <h4 className="font-display text-lg font-bold text-white mt-0.5">
                    {breakdown.categoryName}
                  </h4>
                </div>
                <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  Estimated Price
                </span>
              </div>

              {/* Total Figure Display */}
              <div className="py-5 border-b border-white/10">
                <div className="text-xs text-white/50 mb-1">Estimated Total Investment</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {formatINR(breakdown.estimatedTotal)}
                  </span>
                  <span className="text-xs text-white/50">INR</span>
                </div>
                <p className="mt-2 text-xs text-amber-300/90 flex items-center gap-1.5">
                  <AlertTriangle size={12} className="shrink-0" />
                  Estimated price based on selected options, not a final binding quotation.
                </p>
              </div>

              {/* Itemized Line items */}
              <div className="py-4 space-y-2.5 text-xs text-white/75 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-white/60">Starting Category Base:</span>
                  <span className="font-medium">{formatINR(breakdown.startingPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">
                    Selected Package ({breakdown.packageName}):
                  </span>
                  <span className="font-medium">{formatINR(breakdown.selectedPackagePrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">
                    Pages ({breakdown.selectedPages} total / {breakdown.extraPages} extra):
                  </span>
                  <span className="font-medium">
                    {breakdown.extraPagesCost > 0
                      ? `+${formatINR(breakdown.extraPagesCost)}`
                      : "Included"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">
                    Additional Features ({breakdown.selectedFeatures.length}):
                  </span>
                  <span className="font-medium">
                    {breakdown.featuresCost > 0 ? `+${formatINR(breakdown.featuresCost)}` : "₹0"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Special Requirements:</span>
                  <span className="font-medium">
                    {breakdown.specialRequirementsCost > 0
                      ? `+${formatINR(breakdown.specialRequirementsCost)}`
                      : "₹0"}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-white/5 font-semibold text-white">
                  <span>Subtotal (Project Scope):</span>
                  <span>{formatINR(breakdown.subtotal)}</span>
                </div>
              </div>

              {/* Domain, Hosting & Third-Party Notice (Mandatory Rule) */}
              <div className="py-4 space-y-2 text-xs text-white/60 border-b border-white/10 bg-white/[0.02] -mx-7 px-7">
                <div className="font-semibold text-white/80 uppercase tracking-wider text-xs">
                  Third-Party Services &amp; Taxes Shown Separately:
                </div>
                <div className="flex items-start gap-1.5">
                  <Server size={12} className="text-brand-2 shrink-0 mt-0.5" />
                  <span>
                    <strong>Domain &amp; Cloud Hosting:</strong> Not included in development; billed
                    directly at actual provider costs (~₹899/yr for .com/.in + ~₹1,999/yr hosting).
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Building size={12} className="text-brand-2 shrink-0 mt-0.5" />
                  <span>
                    <strong>Applicable Taxes:</strong> Applicable GST (18%) shown separately on tax
                    invoices ({formatINR(breakdown.taxAmount)} approx).
                  </span>
                </div>
              </div>

              {/* Explicit Payment & Safety Guarantee */}
              <div className="pt-4 pb-2 text-xs text-emerald-400/90 flex items-start gap-2">
                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Auto-Debits:</strong> You are never charged automatically. No payment
                  is ever processed without explicit milestone review and client approval.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="btn btn-p w-full justify-center !py-3 text-sm font-semibold shadow-lg shadow-brand/20"
                >
                  <Send size={15} />
                  <span>Request Official Quotation</span>
                </button>

                <a
                  href={`${site.wa}&text=Hi%20Pavitra%2C%20I%20used%20your%20pricing%20calculator%20for%20a%20${encodeURIComponent(
                    breakdown.categoryName
                  )}%20(${breakdown.packageName}%20package%2C%20${
                    breakdown.selectedPages
                  }%20pages).%20Estimated%20Total%3A%20${encodeURIComponent(
                    formatINR(breakdown.estimatedTotal)
                  )}.%20Can%20we%20discuss%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-g w-full justify-center !py-2.5 text-xs font-semibold"
                >
                  <span>Discuss via WhatsApp Instantly →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Quotation Modal / Dialog */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => {
                  setShowQuoteModal(false);
                  setQuoteSuccess(false);
                  setQuoteError("");
                }}
                className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                aria-label="Close quote modal"
              >
                <X size={16} />
              </button>

              {quoteSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-white">Quotation Request Sent!</h4>
                  <p className="mt-2 text-sm text-white/70">
                    Thank you, {quoteName}! We have saved your custom pricing breakdown ({formatINR(breakdown.estimatedTotal)}). Pavitra will reach out to you within 4-6 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuoteModal(false);
                      setQuoteSuccess(false);
                    }}
                    className="btn btn-p mt-6 !px-6 !py-2.5 text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submitCustomQuotation} className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-2">
                      Custom Quotation Request
                    </span>
                    <h4 className="font-display text-xl font-bold text-white mt-1">
                      {breakdown.categoryName} ({breakdown.packageName})
                    </h4>
                    <p className="text-xs text-white/60">
                      Estimated: <strong className="text-white">{formatINR(breakdown.estimatedTotal)}</strong> ({breakdown.selectedPages} pages + {breakdown.selectedFeatures.length} features)
                    </p>
                  </div>

                  {quoteError && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-200">
                      {quoteError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={quotePhone}
                        onChange={(e) => setQuotePhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Business / Brand Name</label>
                    <input
                      type="text"
                      value={quoteBusiness}
                      onChange={(e) => setQuoteBusiness(e.target.value)}
                      placeholder="e.g. Apex Legal Solutions"
                      className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Project Notes or Specifics</label>
                    <textarea
                      rows={3}
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      placeholder="Share reference websites, target deadlines, or any specific workflows..."
                      className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none resize-none"
                    />
                  </div>

                  <div className="text-xs text-white/50 space-y-1">
                    <div>✓ Complete pricing breakdown is automatically attached to this enquiry.</div>
                    <div>✓ No automatic billing. Quotations are strictly estimates until contract signing.</div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submittingQuote}
                      className="btn btn-p w-full justify-center !py-3 text-sm font-semibold shadow-md"
                    >
                      {submittingQuote ? "Sending Quotation Request..." : "Submit Quotation Request"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
