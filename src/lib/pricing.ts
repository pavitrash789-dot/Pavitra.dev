export type PackageTier = "starter" | "professional" | "premium";

export interface PackageDetails {
  id: PackageTier;
  name: string;
  badge?: string;
  description: string;
  maxPages: number;
  features: string[];
  popular?: boolean;
}

export interface CategoryPricing {
  id: string;
  name: string;
  startingPrice: number;
  packages: {
    starter: number;
    professional: number;
    premium: number;
  };
  isComplex?: boolean;
  notes?: string;
}

export interface FeatureAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: "core" | "ecommerce" | "interactive" | "integrations";
}

export interface SpecialRequirement {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PricingConfig {
  categories: CategoryPricing[];
  extraPageRate: number; // in INR
  features: FeatureAddon[];
  specialRequirements: SpecialRequirement[];
  taxRate: number; // percentage, e.g. 18 for 18% GST
  currency: string;
  lastUpdated: string;
}

export interface PricingBreakdown {
  categoryId: string;
  categoryName: string;
  packageId: PackageTier;
  packageName: string;
  startingPrice: number;
  selectedPackagePrice: number;
  includedPages: number;
  selectedPages: number;
  extraPages: number;
  extraPageRate: number;
  extraPagesCost: number;
  selectedFeatures: { id: string; name: string; price: number }[];
  featuresCost: number;
  selectedSpecialRequirements: { id: string; name: string; price: number }[];
  specialRequirementsCost: number;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  estimatedTotal: number;
  isEstimate: true;
  domainHostingNote: string;
  paymentNotice: string;
}

export const PACKAGES: PackageDetails[] = [
  {
    id: "starter",
    name: "STARTER",
    badge: "Essential",
    description: "Ideal for personal sites, MVPs and simple online presence.",
    maxPages: 3,
    features: [
      "Basic responsive design",
      "Up to 3 pages",
      "Basic SEO",
      "Contact form",
      "Mobile optimized layout",
      "Fast page load speed",
    ],
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    badge: "Most Popular",
    description: "Perfect for growing businesses seeking strong conversions.",
    maxPages: 7,
    features: [
      "Up to 7 pages",
      "Premium UI/UX",
      "Animations",
      "WhatsApp integration",
      "SEO optimization",
      "Interactive components",
      "Google Analytics setup",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "PREMIUM",
    badge: "Enterprise",
    description: "Full-scale custom engineering, backend logic and database.",
    maxPages: 12,
    features: [
      "Up to 12 pages",
      "Advanced UI/UX",
      "Backend functionality",
      "Database integration",
      "Advanced features",
      "Priority support",
      "Custom security headers",
    ],
  },
];

export const DEFAULT_CATEGORY_PRICING: CategoryPricing[] = [
  {
    id: "landing",
    name: "Landing Page",
    startingPrice: 2999,
    packages: { starter: 2999, professional: 4999, premium: 7999 },
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    startingPrice: 3999,
    packages: { starter: 3999, professional: 6499, premium: 9999 },
  },
  {
    id: "personal_brand",
    name: "Personal Brand Website",
    startingPrice: 4999,
    packages: { starter: 4999, professional: 7999, premium: 11999 },
  },
  {
    id: "business",
    name: "Business / Corporate Website",
    startingPrice: 5999,
    packages: { starter: 5999, professional: 9999, premium: 14999 },
  },
  {
    id: "cms",
    name: "CMS Website",
    startingPrice: 7999,
    packages: { starter: 7999, professional: 12999, premium: 18999 },
  },
  {
    id: "restaurant",
    name: "Restaurant Website",
    startingPrice: 4999,
    packages: { starter: 4999, professional: 7999, premium: 12499 },
  },
  {
    id: "gym",
    name: "Gym & Fitness Website",
    startingPrice: 4999,
    packages: { starter: 4999, professional: 7999, premium: 12499 },
  },
  {
    id: "blog",
    name: "Blog / News Website",
    startingPrice: 5999,
    packages: { starter: 5999, professional: 9499, premium: 14499 },
  },
  {
    id: "agency",
    name: "Agency Website",
    startingPrice: 6999,
    packages: { starter: 6999, professional: 10999, premium: 16999 },
  },
  {
    id: "education",
    name: "Education Website",
    startingPrice: 7999,
    packages: { starter: 7999, professional: 12999, premium: 19999 },
  },
  {
    id: "realestate",
    name: "Real Estate Website",
    startingPrice: 9999,
    packages: { starter: 9999, professional: 15999, premium: 23999 },
  },
  {
    id: "hotel",
    name: "Hotel & Travel Website",
    startingPrice: 9999,
    packages: { starter: 9999, professional: 15999, premium: 23999 },
  },
  {
    id: "event",
    name: "Event Website",
    startingPrice: 5999,
    packages: { starter: 5999, professional: 8999, premium: 13999 },
  },
  {
    id: "booking",
    name: "Booking Website",
    startingPrice: 7999,
    packages: { starter: 7999, professional: 12999, premium: 18999 },
  },
  {
    id: "ecommerce",
    name: "E-commerce Website",
    startingPrice: 11999,
    packages: { starter: 11999, professional: 18999, premium: 27999 },
  },
  {
    id: "saas",
    name: "SaaS Website",
    startingPrice: 14999,
    packages: { starter: 14999, professional: 24999, premium: 39999 },
    isComplex: true,
    notes: "Engineered SaaS architecture, custom authentication flows, and API integration options.",
  },
  {
    id: "custom",
    name: "Custom Web Application",
    startingPrice: 19999,
    packages: { starter: 19999, professional: 34999, premium: 54999 },
    isComplex: true,
    notes: "Bespoke full-stack web application development tailored to unique organizational requirements.",
  },
];

export const DEFAULT_FEATURE_ADDONS: FeatureAddon[] = [
  { id: "payment_gateway", name: "Payment Gateway", price: 2499, description: "Razorpay, Stripe, or Cashfree integration with webhook security.", category: "ecommerce" },
  { id: "user_auth", name: "User Login / Signup", price: 2999, description: "Secure authentication, session management, and profile dashboards.", category: "core" },
  { id: "admin_dashboard", name: "Admin Dashboard", price: 3499, description: "Manage content, leads, products, or bookings from a private backoffice.", category: "core" },
  { id: "shopping_cart", name: "Shopping Cart & Checkout", price: 1999, description: "Interactive drawer cart, coupon discounts, and order summary flow.", category: "ecommerce" },
  { id: "product_management", name: "Product Management", price: 2499, description: "Catalog filters, variants, stock management, and image galleries.", category: "ecommerce" },
  { id: "online_booking", name: "Online Booking System", price: 2499, description: "Real-time calendar slot reservation and automated scheduling.", category: "interactive" },
  { id: "search_filter", name: "Search & Advanced Filters", price: 1499, description: "Instant client-side / server-side fuzzy search and taxonomy filters.", category: "interactive" },
  { id: "custom_animations", name: "Custom Animations & 3D", price: 1999, description: "Fluid Framer Motion physics, 3D tilt effects, and micro-interactions.", category: "interactive" },
  { id: "ai_integration", name: "AI Integration", price: 3999, description: "Custom AI assistant chatbot, OpenAI / Gemini smart query assistant.", category: "integrations" },
  { id: "email_sms", name: "Email Notifications", price: 1299, description: "Automated transactional email receipts via Resend or SendGrid.", category: "integrations" },
  { id: "database_integration", name: "Database Integration", price: 2499, description: "Relational PostgreSQL / Supabase storage with Row-Level Security.", category: "core" },
  { id: "speed_optimization", name: "Speed Optimization (95+)", price: 1499, description: "Image optimization, code splitting, edge caching, and Core Web Vitals.", category: "core" },
];

export const DEFAULT_SPECIAL_REQUIREMENTS: SpecialRequirement[] = [
  { id: "express_delivery", name: "Express 5-Day Delivery", price: 3499, description: "Accelerated development sprint with daily deployment updates." },
  { id: "annual_maintenance", name: "1-Year Maintenance & Support", price: 4999, description: "Regular security patches, software updates, monthly backups, and bug fixes." },
  { id: "content_writing", name: "Copywriting & Content Creation", price: 2499, description: "Engaging, conversion-focused headlines and body text tailored to your niche." },
  { id: "seo_booster", name: "Advanced SEO & Schema Booster", price: 1999, description: "Rich snippets, JSON-LD structured schema, XML sitemap, and Google Search Console submission." },
  { id: "custom_api", name: "Custom Third-Party API Integration", price: 3999, description: "Connect to ERP, CRM (HubSpot/Salesforce), WhatsApp Cloud API, or external endpoints." },
];

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  categories: DEFAULT_CATEGORY_PRICING,
  extraPageRate: 500,
  features: DEFAULT_FEATURE_ADDONS,
  specialRequirements: DEFAULT_SPECIAL_REQUIREMENTS,
  taxRate: 18,
  currency: "₹",
  lastUpdated: new Date().toISOString(),
};

/**
 * Format numbers according to Indian Currency format (e.g. ₹2,999 or ₹1,49,999)
 */
export function formatINR(val: number | null | undefined): string {
  const num = Math.round(Number(val) || 0);
  return "₹" + num.toLocaleString("en-IN");
}

/**
 * Live calculation engine for Dynamic Price Calculator
 */
export function calculatePricingBreakdown(
  params: {
    categoryId: string;
    packageId: PackageTier;
    pages: number;
    selectedFeatureIds: string[];
    selectedRequirementIds: string[];
  },
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): PricingBreakdown {
  const cat = config.categories.find((c) => c.id === params.categoryId) || config.categories[0];
  const pkg = PACKAGES.find((p) => p.id === params.packageId) || PACKAGES[0];

  const startingPrice = cat.startingPrice;
  const packagePrice = cat.packages[params.packageId] ?? startingPrice;

  // Pages
  const includedPages = pkg.maxPages;
  const selectedPages = Math.max(1, params.pages || includedPages);
  const extraPages = Math.max(0, selectedPages - includedPages);
  const extraPageRate = config.extraPageRate;
  const extraPagesCost = extraPages * extraPageRate;

  // Features
  const selectedFeatures = config.features
    .filter((f) => params.selectedFeatureIds.includes(f.id))
    .map((f) => ({ id: f.id, name: f.name, price: f.price }));
  const featuresCost = selectedFeatures.reduce((acc, f) => acc + f.price, 0);

  // Special Requirements
  const selectedRequirements = config.specialRequirements
    .filter((r) => params.selectedRequirementIds.includes(r.id))
    .map((r) => ({ id: r.id, name: r.name, price: r.price }));
  const specialRequirementsCost = selectedRequirements.reduce((acc, r) => acc + r.price, 0);

  // Subtotal
  const subtotal = packagePrice + extraPagesCost + featuresCost + specialRequirementsCost;
  const taxPercent = config.taxRate || 18;
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  const estimatedTotal = subtotal; // Subtotal is the service price; tax is shown separately

  return {
    categoryId: cat.id,
    categoryName: cat.name,
    packageId: pkg.id,
    packageName: pkg.name,
    startingPrice,
    selectedPackagePrice: packagePrice,
    includedPages,
    selectedPages,
    extraPages,
    extraPageRate,
    extraPagesCost,
    selectedFeatures,
    featuresCost,
    selectedSpecialRequirements: selectedRequirements,
    specialRequirementsCost,
    subtotal,
    taxPercent,
    taxAmount,
    estimatedTotal,
    isEstimate: true,
    domainHostingNote: "Domain (~₹899/yr) & Cloud Hosting (~₹1,999/yr) are third-party services and billed at actuals.",
    paymentNotice: "Never charged automatically. Payments are processed only with explicit milestone agreements.",
  };
}
