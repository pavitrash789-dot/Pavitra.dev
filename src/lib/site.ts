export const site = {
  name: "Pavitra Sharma",
  email: "pavitrash789@gmail.com",
  phone: "+917665534302",
  wa: "https://wa.me/917665534302?text=Hi%20Pavitra%2C%20I%27d%20like%20a%20website",
  linkedin: "https://www.linkedin.com/in/pavitra-sharma-031b77317",
  github: "https://github.com/pavitrash789-dot",
  city: "Kota, Rajasthan",
};

export const stack = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Flask",
  "Python",
  "Supabase",
  "Git & GitHub",
];

export const services = [
  "Website Design",
  "Frontend Development",
  "Backend Development",
  "E-commerce Development",
  "Responsive Website Development",
  "Website Redesign",
  "Website Maintenance",
  "Custom Web Applications",
  "SEO-Friendly Website Development",
  "Business Website Development",
];

export const common = [
  "Contact Forms",
  "WhatsApp Integration",
  "SEO Optimization",
  "Analytics",
  "Custom Animations",
  "Google Maps",
];

export const pagesList = [
  "Home",
  "About Us",
  "Services",
  "Products",
  "Portfolio",
  "Contact",
  "Blog",
  "FAQ",
  "Pricing",
  "Testimonials",
  "Custom Pages",
];

export const designs = [
  "Minimal",
  "Modern",
  "Luxury",
  "Corporate",
  "Creative",
  "Bold",
  "Elegant",
  "Futuristic",
];

export const allFeatures = [
  "Contact Forms",
  "WhatsApp Integration",
  "Payment Gateway",
  "User Login / Signup",
  "Admin Dashboard",
  "Product Management",
  "Shopping Cart",
  "Online Booking",
  "Search Functionality",
  "SEO Optimization",
  "Google Maps",
  "Analytics",
  "Email Notifications",
  "Database Integration",
  "Custom Animations",
  "AI Integration",
];

export const statuses = [
  "New Enquiry",
  "Contacted",
  "Discussion",
  "Quotation Sent",
  "In Progress",
  "Completed",
  "Cancelled",
];

export interface Category {
  id: string;
  name: string;
  icon: string;
  desc: string;
  startingPrice: number;
  ex: string[];
  feat: string[];
}

export const categories: Category[] = [
  {
    id: "landing",
    name: "Landing Page",
    icon: "Rocket",
    desc: "High-converting single page designed for campaigns, product launches & lead generation.",
    startingPrice: 2999,
    ex: ["Hero Section", "Lead Capture Form", "Call-to-Action", "Social Proof"],
    feat: ["Contact Forms", "WhatsApp Integration", "SEO Optimization", "Email Notifications"],
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    icon: "Briefcase",
    desc: "Showcase creative work, case studies, client reviews, and your personal resume with flair.",
    startingPrice: 3999,
    ex: ["Project Gallery", "Case Studies", "Interactive Resume", "Contact"],
    feat: ["Admin Dashboard", "Custom Animations", "SEO Optimization"],
  },
  {
    id: "personal_brand",
    name: "Personal Brand Website",
    icon: "User",
    desc: "Build authority and credibility as a creator, coach, consultant, or executive leader.",
    startingPrice: 4999,
    ex: ["Bio & Story", "Offerings", "Newsletter", "Booking Link"],
    feat: ["Contact Forms", "WhatsApp Integration", "SEO Optimization", "Analytics"],
  },
  {
    id: "business",
    name: "Business / Corporate Website",
    icon: "Building2",
    desc: "Professional web presence engineered for companies, firms, and service agencies.",
    startingPrice: 5999,
    ex: ["Company Services", "Leadership Team", "Lead Capture", "Client Logos"],
    feat: ["Admin Dashboard", "Database Integration", "Email Notifications", "SEO Optimization"],
  },
  {
    id: "cms",
    name: "CMS Website",
    icon: "FileText",
    desc: "Easily update content, manage articles, media, and pages with a modern headless admin.",
    startingPrice: 7999,
    ex: ["Dynamic Pages", "Rich Text Editor", "Media Library", "Categories"],
    feat: ["Admin Dashboard", "Database Integration", "Search Functionality", "Email Notifications"],
  },
  {
    id: "restaurant",
    name: "Restaurant Website",
    icon: "UtensilsCrossed",
    desc: "Digital menu cards, table reservations, location map, and appetizing visual galleries.",
    startingPrice: 4999,
    ex: ["Interactive Menu", "Table Booking", "Special Offers", "Chef Specials"],
    feat: ["Online Booking", "Email Notifications", "Admin Dashboard", "Google Maps"],
  },
  {
    id: "gym",
    name: "Gym & Fitness Website",
    icon: "Dumbbell",
    desc: "Membership tiers, workout schedules, personal trainer profiles, and class registrations.",
    startingPrice: 4999,
    ex: ["Membership Plans", "Class Timetable", "Trainer Roster", "Trial Signup"],
    feat: ["Online Booking", "Payment Gateway", "User Login / Signup", "Admin Dashboard"],
  },
  {
    id: "blog",
    name: "Blog / News Website",
    icon: "Newspaper",
    desc: "Fast article publishing, category filtering, search index, and newsletter subscriptions.",
    startingPrice: 5999,
    ex: ["Featured Posts", "Search & Filters", "Newsletter", "Social Share"],
    feat: ["Search Functionality", "Admin Dashboard", "Database Integration", "Email Notifications"],
  },
  {
    id: "agency",
    name: "Agency Website",
    icon: "Sparkles",
    desc: "Modern agency showcase highlighting capabilities, client case studies, and team ethos.",
    startingPrice: 6999,
    ex: ["Client Case Studies", "Service Pillars", "Pitch Deck", "Lead Funnel"],
    feat: ["Admin Dashboard", "Custom Animations", "Email Notifications", "Analytics"],
  },
  {
    id: "education",
    name: "Education Website",
    icon: "GraduationCap",
    desc: "Academic institutions, courses, batch schedules, admission enquiries, and student portal.",
    startingPrice: 7999,
    ex: ["Course Catalog", "Admissions Flow", "Faculty Directory", "Student Login"],
    feat: ["User Login / Signup", "Admin Dashboard", "Payment Gateway", "Database Integration", "Email Notifications"],
  },
  {
    id: "realestate",
    name: "Real Estate Website",
    icon: "Home",
    desc: "Showcase property listings, price filters, virtual tours, and instant lead capture forms.",
    startingPrice: 9999,
    ex: ["Property Listings", "Search & Filters", "Floor Plans", "Schedule Visit"],
    feat: ["Search Functionality", "Admin Dashboard", "Database Integration", "Online Booking"],
  },
  {
    id: "hotel",
    name: "Hotel & Travel Website",
    icon: "Plane",
    desc: "Room types, itinerary packages, direct booking engine, and destination showcases.",
    startingPrice: 9999,
    ex: ["Room Showcase", "Package Deals", "Date Availability", "Guest Reviews"],
    feat: ["Online Booking", "Payment Gateway", "Search Functionality", "Admin Dashboard", "Email Notifications"],
  },
  {
    id: "event",
    name: "Event Website",
    icon: "PartyPopper",
    desc: "Conferences, festivals, and summits with interactive schedules, speakers, and RSVP.",
    startingPrice: 5999,
    ex: ["Speaker Lineup", "Session Timeline", "Pass Registration", "Sponsors"],
    feat: ["Online Booking", "Payment Gateway", "Email Notifications", "Admin Dashboard"],
  },
  {
    id: "booking",
    name: "Booking Website",
    icon: "CalendarCheck",
    desc: "Appointment scheduling for doctors, consultants, salons, and service professionals.",
    startingPrice: 7999,
    ex: ["Calendar Slots", "SMS Reminders", "Deposit Payments", "Client Portal"],
    feat: ["Online Booking", "Payment Gateway", "Email Notifications", "Admin Dashboard", "User Login / Signup"],
  },
  {
    id: "ecommerce",
    name: "E-commerce Website",
    icon: "ShoppingCart",
    desc: "Full online store with catalog, shopping cart, UPI/card checkout, and order management.",
    startingPrice: 11999,
    ex: ["Product Catalog", "Cart & Checkout", "Order Tracking", "Inventory"],
    feat: ["Payment Gateway", "Shopping Cart", "Product Management", "User Login / Signup", "Admin Dashboard", "Search Functionality", "Email Notifications", "Database Integration"],
  },
  {
    id: "saas",
    name: "SaaS Website",
    icon: "Cloud",
    desc: "Subscription SaaS web presence with feature breakdowns, interactive pricing, and auth.",
    startingPrice: 14999,
    ex: ["Feature Grids", "Tiered Pricing", "App Auth Screen", "Documentation"],
    feat: ["User Login / Signup", "Payment Gateway", "Admin Dashboard", "Database Integration", "AI Integration"],
  },
  {
    id: "custom",
    name: "Custom Web Application",
    icon: "Wand2",
    desc: "Complex bespoke web applications, internal tools, customer portals, and tailored logic.",
    startingPrice: 19999,
    ex: ["Bespoke Architecture", "Multi-Role Portals", "REST/GraphQL APIs", "Automation"],
    feat: allFeatures,
  },
];

export const steps = [
  "Type",
  "Purpose",
  "Design",
  "Pages",
  "Features",
  "Details",
  "Review",
];
