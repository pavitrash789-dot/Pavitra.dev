"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  MessageCircle,
  Mail,
  Linkedin,
  Github,
  Loader2,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Palette,
  Layout,
  Server,
  ShoppingCart,
  Smartphone,
  RefreshCw,
  Wrench,
  Cpu,
  TrendingUp,
  Building,
  CheckCircle,
} from "lucide-react";
import { site, stack } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import Tilt3D from "@/components/3d/Tilt3D";

// ----------------------------------------------------
// Navigation
// ----------------------------------------------------
export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    ["Choose", "#choose"],
    ["Pricing", "#pricing"],
    ["Customize", "#customize"],
    ["Services", "#services"],
    ["Work", "#portfolio"],
    ["Process", "#how"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="glass fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <a href="#" className="font-display text-lg font-bold tracking-tight text-white">
        Pavitra<span className="grad font-black">.dev</span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden gap-6 text-sm font-medium text-white/75 md:flex">
        {links.map(([l, h]) => (
          <a
            key={h}
            href={h}
            className="transition-colors hover:text-white hover:text-brand-2"
          >
            {l}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a href="#choose" className="btn btn-p !px-4 !py-2 text-xs md:text-sm font-semibold shadow-md">
          Start Project
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white md:hidden hover:bg-white/10"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass absolute top-16 inset-x-0 rounded-2xl p-5 border border-white/15 shadow-2xl flex flex-col gap-3 md:hidden"
          >
            {links.map(([l, h]) => (
              <a
                key={h}
                href={h}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ----------------------------------------------------
// Services Section with 3D Tilt
// ----------------------------------------------------
const serviceDetails = [
  { name: "Website Design", icon: Palette, desc: "Modern, bespoke Figma-to-code interfaces with high aesthetic fidelity." },
  { name: "Frontend Development", icon: Layout, desc: "Ultra-fast React & Next.js client experiences with fluid transitions." },
  { name: "Backend Development", icon: Server, desc: "Secure APIs, authentication, relational schemas, and serverless logic." },
  { name: "E-commerce Development", icon: ShoppingCart, desc: "High-converting online storefronts with cart and payment gateways." },
  { name: "Responsive Development", icon: Smartphone, desc: "Pixel-perfect rendering across mobile, tablet, laptop, and 4K screens." },
  { name: "Website Redesign", icon: RefreshCw, desc: "Transform outdated sites into blazing, modern digital experiences." },
  { name: "Website Maintenance", icon: Wrench, desc: "Bug fixes, speed audits, security updates, and regular backups." },
  { name: "Custom Web Applications", icon: Cpu, desc: "Tailored SaaS tools, CRM dashboards, and database applications." },
  { name: "SEO-Friendly Development", icon: TrendingUp, desc: "Semantic markup, OpenGraph meta, schema data, and 99+ Lighthouse." },
  { name: "Business Website Development", icon: Building, desc: "Credible corporate web presences that capture qualified leads." },
];

export function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-2">
          Capabilities
        </span>
        <h2 className="mt-1 font-display text-3xl font-bold md:text-5xl">
          Engineered for <span className="grad">Performance</span>
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-white/60">
          Everything from initial brand concept to full-stack cloud deployment, engineered with precision.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceDetails.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: (i % 3) * 0.06 }}
              className="h-full"
            >
              <Tilt3D
                maxAngle={12}
                scale={1.03}
                glare={true}
                className="card h-full p-6 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/25 to-brand-2/15 border border-white/10"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <Icon size={22} className="text-brand-2" />
                  </div>
                  <h3
                    className="font-display text-lg font-bold text-white"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {s.name}
                  </h3>
                  <p
                    className="mt-2 text-sm text-white/60 leading-relaxed"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {s.desc}
                  </p>
                </div>
                <div
                  className="mt-4 flex items-center gap-1 text-xs text-brand-2 font-medium"
                  style={{ transform: "translateZ(22px)" }}
                >
                  <CheckCircle size={13} />
                  <span>Available for immediate booking</span>
                </div>
              </Tilt3D>
            </motion.div>
          );
        })}
      </div>

      {/* Tech Stack Bar */}
      <div className="glass mt-12 rounded-2xl p-6 border border-white/10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
          Core Technologies &amp; Tooling
        </p>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {stack.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/80 hover:border-brand/40 hover:text-white transition-colors"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// Portfolio with 3D Tilt Cards
// ----------------------------------------------------
type ProjectItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  demo_url: string | null;
  image_url: string | null;
};

const defaultPortfolio: ProjectItem[] = [
  {
    id: "p0",
    title: "Pavitra Sharma Portfolio",
    category: "Portfolio & Personal Brand",
    description: "Modern developer portfolio showcasing bespoke UI design, full-stack architectures, interactive 3D elements, and real-time project solutions.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    demo_url: "https://my-portfolio-beta-ochre-netty7ie4y.vercel.app/",
    image_url: null,
  },
  {
    id: "p1",
    title: "Aura Luxe E-Commerce",
    category: "E-commerce & Payments",
    description: "High-end luxury jewelry storefront featuring real-time inventory, Razorpay & Stripe integration, and sub-second cart checkout.",
    tech: ["Next.js 14", "Tailwind CSS", "Supabase", "Stripe API"],
    demo_url: "https://example.com/ecommerce-demo",
    image_url: null,
  },
  {
    id: "p2",
    title: "Apex Media Creative Portfolio",
    category: "Portfolio & 3D Interactive",
    description: "Interactive agency showcase with WebGL 3D depth tilt, case-study micro-animations, and dynamic blog CMS.",
    tech: ["Next.js", "WebGL / Canvas", "Framer Motion", "Tailwind"],
    demo_url: "https://example.com/portfolio-demo",
    image_url: null,
  },
  {
    id: "p3",
    title: "Zenith Clinic Booking System",
    category: "Web App & Online Booking",
    description: "Appointment booking platform with automated WhatsApp notifications, customer portal, and admin doctor scheduling dashboard.",
    tech: ["React", "Node.js", "Supabase Auth", "PostgreSQL"],
    demo_url: "https://example.com/booking-demo",
    image_url: null,
  },
];

export function Portfolio() {
  const [items, setItems] = useState<ProjectItem[]>(defaultPortfolio);

  useEffect(() => {
    supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const hasPavitra = data.some((p: any) => p.demo_url && (p.demo_url.includes("my-portfolio-beta-ochre-netty7ie4y") || p.demo_url.includes("my-portfolio-pavitra6")));
          if (!hasPavitra) {
            setItems([defaultPortfolio[0], ...(data as ProjectItem[])]);
          } else {
            setItems(data as ProjectItem[]);
          }
        }
      });
  }, []);

  return (
    <section id="portfolio" className="relative mx-auto max-w-7xl px-5 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            Showcase
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold md:text-5xl">
            Selected <span className="grad">Work &amp; Case Studies</span>
          </h2>
          <p className="mt-2 text-white/60">
            A glimpse into recent full-stack applications, interactive experiences, and commercial websites.
          </p>
        </div>
        <div className="text-xs text-white/40">
          Interactive 3D Project Cards
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: idx * 0.1 }}
            className="h-full"
          >
            <Tilt3D
              maxAngle={12}
              scale={1.03}
              glare={true}
              className="card h-full overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* 3D Preview Image / Banner */}
                <div
                  className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-brand/35 via-brand/15 to-brand-2/25 border-b border-white/10"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={`${p.title} preview`}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="relative h-full w-full grid place-items-center p-6 text-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30" />
                      <div className="relative z-10">
                        <span className="inline-block rounded-full bg-brand/25 border border-brand/40 px-3 py-1 text-xs font-semibold text-brand-2 mb-2">
                          {p.category}
                        </span>
                        <p className="font-display text-lg font-bold text-white">{p.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider text-brand-2"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {p.category}
                  </p>
                  <h3
                    className="mt-1 font-display text-xl font-bold text-white"
                    style={{ transform: "translateZ(25px)" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="mt-2 text-sm text-white/65 leading-relaxed"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {p.description}
                  </p>

                  {/* Tech stack badges */}
                  <div
                    className="mt-4 flex flex-wrap gap-1.5"
                    style={{ transform: "translateZ(18px)" }}
                  >
                    {p.tech?.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div
                className="p-6 pt-0 border-t border-white/5 mt-4"
                style={{ transform: "translateZ(24px)" }}
              >
                {p.demo_url ? (
                  <a
                    href={p.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-g w-full justify-center !py-2 text-xs font-semibold"
                  >
                    <ExternalLink size={14} />
                    <span>View Live Project</span>
                  </a>
                ) : (
                  <span className="inline-block text-xs text-white/40">
                    Live demo link available upon request
                  </span>
                )}
              </div>
            </Tilt3D>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// Process / How It Works
// ----------------------------------------------------
export function How() {
  const stepsData = [
    {
      title: "Choose Your Website Foundation",
      desc: "Pick from E-commerce, Business, Custom Web App, or Portfolio. Every base comes ready for rapid customization.",
    },
    {
      title: "Customize Specifications & Needs",
      desc: "Specify exact pages, payment gateways, custom animations, design style, timeline, and reference inspirations.",
    },
    {
      title: "Submit & Project Scoping Call",
      desc: "I review your specifications, prepare the architecture, and contact you with a transparent quote and delivery schedule.",
    },
    {
      title: "Design, Develop, Test & Launch",
      desc: "Iterative development with live staging previews, rigorous cross-device QA, speed optimization, and seamless deployment.",
    },
  ];

  return (
    <section id="how" className="relative mx-auto max-w-4xl px-5 py-24">
      <div className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-2">
          Methodology
        </span>
        <h2 className="mt-1 font-display text-3xl font-bold md:text-5xl">
          How It <span className="grad">Works</span>
        </h2>
        <p className="mt-3 text-white/60">
          A seamless 4-step workflow from your initial idea to live production.
        </p>
      </div>

      <ol className="relative space-y-10 border-l border-white/15 pl-8 md:pl-10">
        {stepsData.map((item, i) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            {/* 3D Illuminated Step Bubble */}
            <span className="absolute -left-[3.35rem] md:-left-[3.85rem] grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 font-display font-extrabold text-black shadow-[0_0_20px_rgba(139,123,255,0.4)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="card p-6 border border-white/10 hover:border-brand/40">
              <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{item.desc}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

// ----------------------------------------------------
// Contact & Inquiry
// ----------------------------------------------------
export function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [st, setSt] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSt("busy");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setSt("ok");
      setF({ name: "", email: "", message: "" });
    } catch (x: any) {
      setMsg(x.message || "Could not send message. Please try WhatsApp directly.");
      setSt("err");
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-5 py-24">
      <div className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          Get in Touch
        </span>
        <h2 className="mt-1 font-display text-3xl font-bold md:text-5xl">
          Let&apos;s Build Something <span className="grad">Extraordinary</span>
        </h2>
        <p className="mt-3 text-white/60">
          Have an idea, project, or question? Send a message or chat directly on WhatsApp.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Contact info column */}
        <div className="space-y-6">
          <div className="card p-6 border border-white/10">
            <h3 className="font-display text-xl font-bold text-white mb-2">Direct Communication</h3>
            <p className="text-sm text-white/60 mb-6">
              I typically reply within a few hours. For immediate project discussions, WhatsApp is fastest.
            </p>

            <div className="space-y-3">
              <a
                className="btn btn-p w-full justify-center !py-3 text-sm font-semibold shadow-lg"
                href={site.wa}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp ({site.phone})</span>
              </a>

              <a
                className="btn btn-g w-full justify-center !py-3 text-sm"
                href={`mailto:${site.email}`}
              >
                <Mail size={18} />
                <span>{site.email}</span>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/40">Location: {site.city}</span>
              <div className="flex gap-3">
                <a
                  aria-label="LinkedIn Profile"
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  aria-label="GitHub Profile"
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form column */}
        <form
          onSubmit={send}
          className="glass space-y-4 rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl"
        >
          <h3 className="font-display text-xl font-bold text-white">Send a Quick Message</h3>

          <div>
            <label className="text-xs uppercase font-semibold text-white/50 block mb-1">
              Your Name
            </label>
            <input
              required
              className="inp"
              placeholder="e.g. John Doe"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs uppercase font-semibold text-white/50 block mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              className="inp"
              placeholder="name@company.com"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs uppercase font-semibold text-white/50 block mb-1">
              Message
            </label>
            <textarea
              required
              minLength={10}
              className="inp min-h-32"
              placeholder="Tell me about your project, timeline, or requirements..."
              value={f.message}
              onChange={(e) => setF({ ...f, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-p w-full justify-center !py-3 text-sm font-semibold"
            disabled={st === "busy"}
          >
            {st === "busy" ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Message</span>
            )}
          </button>

          {st === "ok" && (
            <p role="status" className="rounded-xl bg-brand-2/15 p-3 text-center text-sm font-medium text-brand-2 border border-brand-2/30">
              ✓ Message received! I will get back to you shortly.
            </p>
          )}

          {st === "err" && (
            <p role="alert" className="rounded-xl bg-red-400/15 p-3 text-center text-sm text-red-200 border border-red-400/30">
              {msg}
            </p>
          )}
        </form>
      </div>

      <footer className="mt-20 border-t border-white/10 pt-8 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} {site.name} · All rights reserved.</p>
        <p className="mt-1 text-xs text-white/30">
          Crafted with Next.js, TypeScript, Tailwind CSS &amp; 3D WebGL Canvas
        </p>
      </footer>
    </section>
  );
}

// ----------------------------------------------------
// WhatsApp Floating CTA
// ----------------------------------------------------
export function WhatsAppFloat() {
  return (
    <a
      href={site.wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat directly on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-black shadow-[0_4px_25px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
      <MessageCircle size={26} className="relative z-10" />
    </a>
  );
}
