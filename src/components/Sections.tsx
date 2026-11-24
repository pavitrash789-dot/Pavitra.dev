"use client";
import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  Mail,
  MessageCircle,
  Menu,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { site } from "@/lib/site";

// ----------------------------------------------------
// Header / Navigation: Quiet, Tiny, Restrained
// ----------------------------------------------------
export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileOpen]);

  // Live Kota (IST) Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch {
        setLocalTime("IST");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    ["Work", "#work"],
    ["Services", "#services"],
    ["How It Works", "#how"],
    ["About", "#about"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#F5F6F2]/95 border-b border-stone">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Wordmark */}
        <div className="flex items-baseline gap-2.5">
          <a
            href="#"
            className="font-serif-heading text-xl font-medium tracking-tight text-ink hover:text-slate transition-colors"
          >
            Pavitra Sharma
          </a>
          <span className="hidden sm:inline text-xs text-slate font-sans border-l border-stone pl-2.5">
            Web Developer · Kota, RJ
          </span>
        </div>

        {/* Nav Links + Minimal Kota Clock */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm text-slate">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="hover:text-ink transition-colors font-medium text-xs uppercase tracking-wider"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Live Kota Clock (IST) at right - Steady calm dot */}
          <div className="flex items-center gap-2 text-xs text-slate border-l border-stone pl-6 tabular-numbers">
            <span className="h-2 w-2 rounded-full bg-[#25D366]" />
            <span>Kota, India · {localTime || "IST"}</span>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <span className="text-xs text-slate tabular-numbers font-medium">
            {localTime}
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-ink hover:text-slate"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-[65px] bg-ink/10 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative md:hidden border-t border-stone bg-[#F5F6F2] px-5 py-5 space-y-3 shadow-md">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-ink hover:text-slate py-1.5 font-serif-heading"
              >
                {label}
              </a>
            ))}
            <div className="pt-3 text-xs text-slate border-t border-stone flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#25D366]" />
              <span>Kota, Rajasthan · {localTime || "IST"}</span>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

// ----------------------------------------------------
// Services Section: Architectural Capability Ledger
// ----------------------------------------------------
const CORE_SERVICES = [
  {
    name: "Landing page",
    desc: "A fast, focused single-page site for a campaign, product launch, or lead generation.",
    price: "₹2,999",
    scope: "1 page · 3–5 days",
  },
  {
    name: "Portfolio / personal site",
    desc: "Clean showcase for consultants, designers, educators, and independent professionals.",
    price: "₹3,999",
    scope: "Up to 3 pages · 5–7 days",
  },
  {
    name: "Business site",
    desc: "Multi-page website for shops, clinics, coaching institutes, and local services.",
    price: "₹5,999",
    scope: "Up to 7 pages · 1–2 weeks",
  },
  {
    name: "Online store",
    desc: "Product catalogue, shopping cart, and UPI/card checkout for Indian customers.",
    price: "₹11,999",
    scope: "Catalogue & cart · 2–3 weeks",
  },
  {
    name: "Booking site",
    desc: "Online appointment scheduling with automated WhatsApp notifications and calendar.",
    price: "₹7,999",
    scope: "Calendar & slots · 1–2 weeks",
  },
  {
    name: "Custom web app",
    desc: "Database workflows, customer portals, internal tools, and tailored logic built for your specific process.",
    price: "₹19,999",
    scope: "Tailored workflows · 3–4 weeks",
  },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24 border-t border-stone">
      <div className="max-w-2xl mb-14">
        <h2 className="font-serif-heading text-3xl font-medium md:text-4xl text-ink tracking-tight">
          Services
        </h2>
        <p className="mt-3 text-slate text-pretty leading-relaxed">
          Straightforward website development for businesses in India. Upfront pricing with no
          hidden costs, agency markups, or technical confusion.
        </p>
      </div>

      <div className="divide-y divide-stone border-t border-b border-stone">
        {CORE_SERVICES.map((item) => (
          <div
            key={item.name}
            className="group py-6 grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr] items-baseline gap-2 md:gap-6 hover:bg-white/80 transition-all duration-150 px-4 -mx-4 rounded-xl"
          >
            <div>
              <div className="font-serif-heading text-lg md:text-xl font-medium text-ink group-hover:text-indigo transition-colors">
                {item.name}
              </div>
              <div className="text-xs text-slate mt-0.5">
                {item.scope}
              </div>
            </div>
            <div className="text-sm text-slate leading-relaxed">
              {item.desc}
            </div>
            <div className="text-sm md:text-base font-semibold text-ink md:text-right tabular-numbers">
              Starts at {item.price}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate gap-3">
        <span>
          Need something specific? Other categories (Gym, Restaurant, Real Estate, SaaS) are
          available in the quote builder.
        </span>
        <a href="#quote-builder" className="text-indigo font-medium hover:underline inline-flex items-center gap-1 shrink-0">
          <span>Build a custom quote</span>
          <ArrowRight size={13} />
        </a>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// Work / Portfolio Section: Plain Index Archive + Project Dossier
// ----------------------------------------------------
type ProjectItem = {
  id: string;
  title: string;
  type: string;
  year: string;
  stack: string;
  url: string | null;
  status: "live" | "concept";
  description: string;
  highlights: string[];
};

const REAL_PROJECTS: ProjectItem[] = [
  {
    id: "pavitra-portfolio",
    title: "Pavitra Sharma Portfolio",
    type: "Personal Developer Portfolio",
    year: "2026",
    stack: "Next.js, TypeScript, Tailwind CSS, Framer Motion",
    url: "https://my-portfolio-beta-ochre-netty7ie4y.vercel.app/",
    status: "live",
    description: "Personal web portfolio showcasing freelance web development capabilities, transparent upfront pricing, dynamic quote calculations, and direct WhatsApp client enquiry flows.",
    highlights: [
      "Dynamic real-time quotation calculator",
      "Direct WhatsApp enquiry integration",
      "Fast static generation & editorial layout",
    ],
  },
  {
    id: "aura-luxe",
    title: "Aura Luxe Storefront",
    type: "Online Store & UPI Checkout",
    year: "2025",
    stack: "Next.js, Supabase, Tailwind CSS",
    url: null,
    status: "concept",
    description: "E-commerce architecture prototype designed for Indian retail and apparel shops with streamlined mobile cart checkout, UPI payments, and order confirmation on WhatsApp.",
    highlights: [
      "Mobile-optimized product catalogue",
      "Instant UPI QR & card checkout flow",
      "Automated WhatsApp order confirmation",
    ],
  },
  {
    id: "zenith-clinic",
    title: "Zenith Clinic Booking",
    type: "Appointment Scheduling System",
    year: "2025",
    stack: "React, Node.js, PostgreSQL",
    url: null,
    status: "concept",
    description: "Doctor appointment management platform for private clinics with automated WhatsApp booking reminders, schedule slot management, and patient intake records.",
    highlights: [
      "Real-time slot availability picker",
      "WhatsApp automated booking reminders",
      "Doctor daily schedule dashboard",
    ],
  },
  {
    id: "apex-media",
    title: "Apex Media Studio",
    type: "Creative Portfolio & Agency Site",
    year: "2024",
    stack: "Next.js, Tailwind CSS",
    url: null,
    status: "concept",
    description: "Content showcase for media studios with high-performance responsive layout, case study archives, and fluid responsive grid typography.",
    highlights: [
      "Editorial case study archive layout",
      "High-performance responsive image galleries",
      "Accessible left-aligned composition",
    ],
  },
];

export function Portfolio() {
  const [activeProject, setActiveProject] = useState<ProjectItem>(REAL_PROJECTS[0]);

  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24 border-t border-stone">
      <div className="max-w-2xl mb-14">
        <h2 className="font-serif-heading text-3xl font-medium md:text-4xl text-ink tracking-tight">
          Selected work
        </h2>
        <p className="mt-3 text-slate text-pretty leading-relaxed">
          A plain index of live projects and working concepts. Real links only; concept projects are
          clearly labeled.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1.1fr] items-start">
        {/* Plain Index Archive Table */}
        <div className="divide-y divide-stone border-t border-b border-stone">
          {REAL_PROJECTS.map((project) => {
            const isActive = activeProject.id === project.id;
            return (
              <div
                key={project.id}
                onMouseEnter={() => setActiveProject(project)}
                onFocus={() => setActiveProject(project)}
                onClick={() => setActiveProject(project)}
                tabIndex={0}
                className={`py-5 px-4 -mx-4 rounded-xl cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-white border border-stone shadow-xs"
                    : "hover:bg-white/60 border border-transparent"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif-heading text-base md:text-lg font-medium text-ink">
                      {project.title}
                    </span>
                    <span className="text-xs text-slate">({project.year})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate hidden sm:inline">{project.type}</span>
                    {project.status === "live" && project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo font-medium inline-flex items-center gap-1 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                        <span>Live</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate font-medium text-xs bg-[#ECEFEA] px-2.5 py-1 rounded-full">
                        Concept
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-1 text-xs text-slate truncate">
                  {project.stack}
                </div>
              </div>
            );
          })}
        </div>

        {/* Focus Preview Frame: Architectural Project Dossier */}
        <div className="border border-stone bg-white rounded-xl sticky top-24 overflow-hidden shadow-xs p-6 md:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-stone pb-4">
            <span className="text-xs text-slate font-medium uppercase tracking-wider">
              {activeProject.type} · {activeProject.year}
            </span>
            {activeProject.status === "live" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D5E37] bg-[#EEF5F1] px-2.5 py-1 rounded-full border border-[#C5DFD0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                <span>Live Project</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-slate bg-[#ECEFEA] px-2.5 py-1 rounded-full">
                Concept Prototype
              </span>
            )}
          </div>

          <div>
            <h3 className="font-serif-heading text-2xl font-medium text-ink">
              {activeProject.title}
            </h3>
            <p className="mt-2 text-sm text-slate leading-relaxed">
              {activeProject.description}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate uppercase tracking-wider">
              Key Features
            </div>
            <ul className="space-y-1.5 text-xs text-ink">
              {activeProject.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-indigo shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-stone space-y-1.5">
            <div className="text-xs font-semibold text-slate uppercase tracking-wider">
              Technology Stack
            </div>
            <div className="text-xs font-medium text-ink">
              {activeProject.stack}
            </div>
          </div>

          <div className="pt-2">
            {activeProject.status === "live" && activeProject.url ? (
              <a
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-p w-full !py-3 text-xs font-semibold justify-center"
              >
                <span>Visit live website</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <div className="text-xs text-slate italic p-3 bg-[#F8F9F7] border border-stone rounded-lg text-center">
                Interactive prototype built as client demo.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// Process: Connected Architectural Milestone Flow
// ----------------------------------------------------
const PROCESS_STEPS = [
  {
    phase: "Phase 1",
    timeframe: "Days 1–2",
    title: "Scope & quote",
    desc: "We discuss your business needs, determine the exact pages and features, and agree on a transparent price and timeline before any work begins.",
    deliverable: "Fixed quote & written scope",
  },
  {
    phase: "Phase 2",
    timeframe: "Days 3–5",
    title: "Design & draft",
    desc: "I share layout wireframes and structure for your review. We adjust everything until you are completely satisfied with how it will look.",
    deliverable: "Approved design drafts",
  },
  {
    phase: "Phase 3",
    timeframe: "Days 6–10",
    title: "Development & content",
    desc: "I write clean, fast code and integrate your contact forms, WhatsApp links, and payment systems. Everything is tested on real mobile phones.",
    deliverable: "Fully responsive website code",
  },
  {
    phase: "Phase 4",
    timeframe: "Days 11–14",
    title: "Testing & launch",
    desc: "We do a final walkthrough together, connect your domain name, configure search engine indexing, and make your website live.",
    deliverable: "Live custom domain & Google index",
  },
];

export function How() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-24 border-t border-stone">
      <div className="max-w-2xl mb-14">
        <h2 className="font-serif-heading text-3xl font-medium md:text-4xl text-ink tracking-tight">
          How It Works
        </h2>
        <p className="mt-3 text-slate text-pretty leading-relaxed">
          A predictable 4-step process from our first message to a live website. Clear milestones
          and direct communication throughout.
        </p>
      </div>

      {/* Connected Architectural Milestone Flow */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((item, idx) => (
          <div
            key={item.phase}
            className="p-6 border border-stone bg-white rounded-xl flex flex-col justify-between hover:border-slate/60 transition-all duration-150 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-stone/60 pb-3">
                <span className="font-serif-heading text-lg font-medium text-ink">
                  0{idx + 1}
                </span>
                <span className="text-xs font-medium bg-[#ECEFEA] text-slate px-2.5 py-1 rounded-full">
                  {item.timeframe}
                </span>
              </div>
              <h3 className="font-serif-heading text-lg font-medium text-ink mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-stone/50 text-xs text-slate font-medium">
              Deliverable: {item.deliverable}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// About: Studio Colophon & Honest Story
// ----------------------------------------------------
export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 border-t border-stone">
      <div className="grid gap-12 md:grid-cols-[280px_1fr] items-start">
        {/* Studio Colophon Plaque */}
        <div className="p-6 border border-stone bg-[#ECEFEA] rounded-xl flex flex-col items-center text-center space-y-4 shadow-xs">
          {/* Author SVG Studio Seal Monogram */}
          <div className="h-20 w-20 rounded-full bg-white border border-stone grid place-items-center text-ink shadow-2xs relative">
            <svg
              className="w-16 h-16 text-ink"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="46" stroke="#D9DED7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="41" stroke="#2C4036" strokeWidth="1" />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontSize="26"
                fontWeight="500"
                fill="#17201B"
              >
                PS
              </text>
            </svg>
          </div>

          <div>
            <div className="font-serif-heading text-lg font-medium text-ink">
              Pavitra Sharma
            </div>
            <div className="text-xs text-slate mt-0.5">
              Independent Web Developer
            </div>
          </div>

          <div className="text-xs text-slate border-t border-stone/60 pt-3 w-full space-y-1.5 text-left">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-slate shrink-0" />
              <span className="font-medium text-ink">Kota, Rajasthan</span>
            </div>
            <div className="text-xs text-slate pl-4">
              25.2138° N, 75.8648° E
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Clock size={13} className="text-slate shrink-0" />
              <span>09:00 – 21:00 IST (Mon–Sat)</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="h-2 w-2 rounded-full bg-[#25D366] shrink-0" />
              <span className="text-[#1D5E37] font-medium">Available for new projects</span>
            </div>
          </div>
        </div>

        {/* Honest First-Person Story & Commitments */}
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="font-serif-heading text-3xl font-medium md:text-4xl text-ink tracking-tight">
              About me
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed">
            <p className="text-ink font-serif-heading text-xl md:text-2xl font-normal text-pretty">
              Practical websites that bring real customers to your business, built by an independent developer you can reach directly.
            </p>
            <p className="text-slate text-pretty leading-relaxed text-sm sm:text-base">
              I&apos;m Pavitra Sharma, an independent web developer based in Kota, Rajasthan. I build
              dependable websites for small businesses—shops, medical clinics, coaching institutes, and
              restaurants—who want a clear online presence without technical confusion or agency markups.
            </p>
            <p className="text-slate text-pretty leading-relaxed text-sm sm:text-base">
              When you work with me, there are no account managers, sales intermediaries, or junior
              handoffs. I handle design, code, and deployment personally, and remain available on WhatsApp
              whenever you need updates or advice.
            </p>
          </div>

          {/* 3 Studio Commitments */}
          <div className="pt-6 border-t border-stone grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-ink text-sm">Direct Developer</div>
              <div className="text-slate leading-relaxed">Talk straight to the person writing the code.</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-ink text-sm">Fixed Pricing</div>
              <div className="text-slate leading-relaxed">Clear upfront quotation with itemized deliverables.</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-ink text-sm">Long-Term Care</div>
              <div className="text-slate leading-relaxed">Direct WhatsApp support whenever you need help.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// Contact: WhatsApp First, then Email, then Short Form
// ----------------------------------------------------
export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus("error");
      setFeedbackMessage("Please enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus("error");
      setFeedbackMessage("Please enter a valid email address.");
      return;
    }
    if (form.message.trim().length < 10) {
      setStatus("error");
      setFeedbackMessage("Please write a message with at least 10 characters so I know how to help.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setFeedbackMessage(err.message || "Could not send message. Please message me directly on WhatsApp.");
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 border-t border-stone">
      <div className="max-w-2xl mb-14">
        <h2 className="font-serif-heading text-3xl font-medium md:text-4xl text-ink tracking-tight">
          Contact
        </h2>
        <p className="mt-3 text-slate text-pretty leading-relaxed">
          Reach out directly to discuss your website. WhatsApp is usually the fastest way to get a
          response.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 items-start">
        {/* Contact direct channels: WhatsApp first, then Email */}
        <div className="space-y-6">
          <div className="border border-stone bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="font-serif-heading text-xl font-medium text-ink mb-2">
                Direct conversation
              </h3>
              <p className="text-sm text-slate leading-relaxed">
                For project questions, quotations, or timeline discussions, send me a message on
                WhatsApp. I usually reply within a few hours.
              </p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp First */}
              <a
                href={site.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-[#17201B] w-full !py-3.5 text-sm font-semibold justify-center"
              >
                <MessageCircle size={18} />
                <span>Message on WhatsApp ({site.phone})</span>
              </a>

              {/* Email Second */}
              <a
                href={`mailto:${site.email}`}
                className="btn btn-g w-full !py-3.5 text-sm justify-center"
              >
                <Mail size={18} />
                <span>{site.email}</span>
              </a>
            </div>

            <div className="pt-4 border-t border-stone text-xs text-slate space-y-1">
              <div className="font-medium text-ink">Pavitra Sharma · Independent Studio</div>
              <div>Location: Kota, Rajasthan · Operating in Indian Standard Time (IST)</div>
              <div>Typical response time: Under 2 hours during daytime.</div>
            </div>
          </div>
        </div>

        {/* Short Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-stone bg-white rounded-xl p-6 md:p-8 space-y-4 shadow-xs"
        >
          <h3 className="font-serif-heading text-xl font-medium text-ink">
            Send an enquiry
          </h3>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Your name *
            </label>
            <input
              required
              className="inp text-sm"
              placeholder="e.g. Amit Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Email address *
            </label>
            <input
              required
              type="email"
              className="inp text-sm"
              placeholder="e.g. amit@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Message *
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              className="inp text-sm"
              placeholder="Tell me briefly about your business and what kind of website you need..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn btn-p w-full !py-3.5 text-sm font-semibold justify-center"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Sending enquiry...</span>
              </>
            ) : (
              <span>Send enquiry</span>
            )}
          </button>

          {status === "success" && (
            <div
              role="status"
              className="p-3 bg-[#EEF5F1] border border-[#C5DFD0] text-[#1D5E37] rounded-md text-xs flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Enquiry received. I will reply to you shortly.</span>
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="p-3 bg-[#FBF0EE] border border-[#F2C4BE] text-[#9A281E] rounded-md text-xs flex items-center gap-2"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </form>
      </div>

      {/* Quiet Restrained Footer */}
      <footer className="mt-24 border-t border-stone pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate gap-4">
        <div>
          © {new Date().getFullYear()} {site.name} · Kota, Rajasthan. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-5">
          <a
            href={site.wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${site.email}`}
            className="hover:text-ink transition-colors"
          >
            Email
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="hover:text-ink transition-colors text-slate"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}

// ----------------------------------------------------
// Quiet, Small Floating WhatsApp Button
// ----------------------------------------------------
export function WhatsAppFloat() {
  return (
    <a
      href={site.wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message on WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-[#17201B] border border-[#1ea952] shadow-sm hover:opacity-95 active:scale-95 transition-all"
    >
      <MessageCircle size={22} />
    </a>
  );
}
