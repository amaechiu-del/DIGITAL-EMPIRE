import { Product } from "@/types";

export const products: Product[] = [
  // ─── COURSES ───────────────────────────────────────────────
  {
    id: "course-001",
    name: "Digital Marketing Masterclass",
    slug: "digital-marketing-masterclass",
    description:
      "Master digital marketing strategies to grow any business online in Nigeria and beyond.",
    longDescription:
      "This comprehensive Digital Marketing Masterclass covers everything from SEO, social media marketing, email campaigns, paid advertising, and analytics. Designed specifically for Nigerian entrepreneurs and business owners who want to dominate their online presence. You will learn how to run profitable Facebook and Instagram ads, grow organic traffic, and convert visitors into loyal customers.",
    price: 35000,
    originalPrice: 65000,
    category: "courses",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop",
    features: [
      "12 hours of HD video content",
      "SEO & Content Marketing modules",
      "Facebook & Instagram Ads mastery",
      "Email marketing automation",
      "Analytics & reporting",
      "Certificate of completion",
      "Lifetime access + free updates",
    ],
    tags: ["marketing", "digital", "SEO", "ads", "social media"],
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 312,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "course-002",
    name: "Web Development Bootcamp",
    slug: "web-development-bootcamp",
    description:
      "Learn full-stack web development from scratch and launch your tech career.",
    longDescription:
      "A thorough full-stack web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and databases. Perfect for beginners and career-changers who want to break into Nigeria's booming tech industry. Build real-world projects, gain portfolio-worthy experience, and learn how to freelance or land a remote job.",
    price: 55000,
    originalPrice: 95000,
    category: "courses",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop",
    features: [
      "20+ hours of project-based learning",
      "HTML, CSS & JavaScript fundamentals",
      "React & Node.js",
      "Database design (MongoDB & PostgreSQL)",
      "Deployment & DevOps basics",
      "Career guidance & freelancing tips",
      "Private community access",
    ],
    tags: ["web dev", "coding", "javascript", "react", "fullstack"],
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 184,
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "course-003",
    name: "Crypto Investment Course",
    slug: "crypto-investment-course",
    description:
      "Understand blockchain, crypto trading, and how to invest safely in digital assets.",
    longDescription:
      "Navigate the volatile world of cryptocurrency with confidence. This course teaches you blockchain fundamentals, how to analyze crypto markets, risk management, DeFi protocols, and how to build a diversified crypto portfolio suited to Nigerian investors. Avoid common scams and make data-driven investment decisions.",
    price: 28000,
    originalPrice: 45000,
    category: "courses",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
    features: [
      "Blockchain fundamentals explained simply",
      "Technical & fundamental analysis",
      "Risk management strategies",
      "DeFi & staking opportunities",
      "Portfolio diversification",
      "Crypto tax & regulations in Nigeria",
    ],
    tags: ["crypto", "bitcoin", "investment", "blockchain", "DeFi"],
    isFeatured: false,
    isNew: true,
    rating: 4.6,
    reviewCount: 97,
    createdAt: "2024-04-10T00:00:00Z",
  },

  // ─── TRAINING ──────────────────────────────────────────────
  {
    id: "training-001",
    name: "SEO Training Program",
    slug: "seo-training-program",
    description:
      "Hands-on SEO training to rank websites on Google and drive free organic traffic.",
    longDescription:
      "A practical, hands-on SEO training program that takes you from beginner to proficient in search engine optimisation. Learn keyword research, on-page SEO, technical SEO, link building, and local SEO — all with tools like Ahrefs, SEMrush, and Google Search Console. Ideal for Nigerian business owners, bloggers, and freelancers.",
    price: 22000,
    originalPrice: 38000,
    category: "training",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    features: [
      "Keyword research & competitor analysis",
      "On-page & technical SEO",
      "Link building strategies",
      "Local SEO for Nigerian businesses",
      "Google Search Console & Analytics",
      "Monthly live Q&A sessions",
    ],
    tags: ["SEO", "Google", "traffic", "ranking", "keywords"],
    isFeatured: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 228,
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "training-002",
    name: "Social Media Management Training",
    slug: "social-media-management-training",
    description:
      "Become a professional social media manager and land clients across Africa.",
    longDescription:
      "This social media management training equips you with everything needed to manage brands on Instagram, Twitter/X, Facebook, TikTok, and LinkedIn. Learn content planning, community engagement, paid campaigns, analytics reporting, and client onboarding. Ideal for aspiring SMMs and virtual assistants in Nigeria.",
    price: 18000,
    originalPrice: 30000,
    category: "training",
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop",
    features: [
      "Multi-platform content strategy",
      "Content calendar & scheduling tools",
      "Community management best practices",
      "Analytics & monthly reporting",
      "Client acquisition & proposals",
      "Done-for-you templates",
    ],
    tags: ["social media", "Instagram", "TikTok", "management", "clients"],
    isFeatured: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 156,
    createdAt: "2024-01-25T00:00:00Z",
  },
  {
    id: "training-003",
    name: "Affiliate Marketing Training",
    slug: "affiliate-marketing-training",
    description:
      "Build a passive income stream through affiliate marketing with zero upfront product cost.",
    longDescription:
      "Learn how to earn commissions by promoting other people's products online. This training covers niche selection, building a blog or YouTube channel, driving traffic through SEO and social media, email list building, and scaling your income. Includes Nigerian-friendly affiliate networks and payment methods.",
    price: 15000,
    originalPrice: 25000,
    category: "training",
    image:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop",
    features: [
      "Niche & product selection",
      "Blog & YouTube channel setup",
      "SEO & social media traffic generation",
      "Email list building",
      "Nigerian-friendly affiliate programs",
      "Scaling to ₦500k/month",
    ],
    tags: ["affiliate", "passive income", "blogging", "commissions"],
    isFeatured: false,
    isNew: true,
    rating: 4.4,
    reviewCount: 89,
    createdAt: "2024-05-01T00:00:00Z",
  },

  // ─── SOFTWARE ──────────────────────────────────────────────
  {
    id: "software-001",
    name: "Business Accounting Software",
    slug: "business-accounting-software",
    description:
      "Comprehensive accounting software built for Nigerian SMEs with Naira support.",
    longDescription:
      "Manage your business finances effortlessly with our Business Accounting Software. Track income and expenses, generate invoices, manage payroll, compute taxes, and produce financial reports — all in Naira. Designed to comply with Nigerian FIRS requirements and suitable for sole traders, SMEs, and NGOs.",
    price: 85000,
    originalPrice: 120000,
    category: "software",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop",
    features: [
      "Naira-based double-entry bookkeeping",
      "Invoice & receipt generation",
      "Payroll management",
      "VAT & WHT computation",
      "Bank reconciliation",
      "Financial statements & reports",
      "1 year free updates & support",
    ],
    tags: ["accounting", "finance", "invoice", "payroll", "SME"],
    isFeatured: true,
    isNew: false,
    rating: 4.6,
    reviewCount: 74,
    createdAt: "2023-11-20T00:00:00Z",
  },
  {
    id: "software-002",
    name: "Inventory Management Software",
    slug: "inventory-management-software",
    description:
      "Real-time stock tracking and inventory control for retail and wholesale businesses.",
    longDescription:
      "Keep your stock under control with our Inventory Management Software. Track products across multiple warehouses, get low-stock alerts, manage purchase orders, and generate sales reports. Built for Nigerian retailers, wholesalers, and e-commerce businesses who need reliable stock visibility without expensive subscriptions.",
    price: 65000,
    originalPrice: 95000,
    category: "software",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop",
    features: [
      "Multi-warehouse stock tracking",
      "Barcode & QR code support",
      "Purchase order management",
      "Low-stock & reorder alerts",
      "Sales & profit reports",
      "Multi-user access control",
    ],
    tags: ["inventory", "stock", "retail", "warehouse", "POS"],
    isFeatured: false,
    isNew: false,
    rating: 4.3,
    reviewCount: 51,
    createdAt: "2023-12-05T00:00:00Z",
  },
  {
    id: "software-003",
    name: "HR Management Suite",
    slug: "hr-management-suite",
    description:
      "End-to-end HR software for employee records, leave management, and payroll.",
    longDescription:
      "Streamline your human resources operations with the HR Management Suite. Manage employee onboarding, digital records, leave & attendance tracking, performance appraisals, and monthly payroll — all in one place. Compliant with Nigerian Labour Act and NHF/NHIS/PAYE requirements for organisations of all sizes.",
    price: 95000,
    originalPrice: 150000,
    category: "software",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
    features: [
      "Employee onboarding & digital files",
      "Leave & attendance management",
      "Performance appraisal module",
      "Payroll with PAYE, NHF & NHIS",
      "Self-service employee portal",
      "HR analytics dashboard",
    ],
    tags: ["HR", "payroll", "employees", "attendance", "PAYE"],
    isFeatured: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 38,
    createdAt: "2024-04-15T00:00:00Z",
  },

  // ─── DIGITAL PRODUCTS ──────────────────────────────────────
  {
    id: "digital-001",
    name: "Business Plan Templates Bundle",
    slug: "business-plan-templates-bundle",
    description:
      "20 professionally crafted business plan templates for Nigerian entrepreneurs.",
    longDescription:
      "Kickstart your business with our premium Business Plan Templates Bundle. Includes 20 industry-specific templates — covering tech startups, agriculture, retail, food & beverage, real estate, and more — formatted to meet CBN, BOI, and investor requirements. Fully editable in Microsoft Word and Google Docs.",
    price: 8500,
    originalPrice: 15000,
    category: "digital-products",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
    features: [
      "20 industry-specific templates",
      "CBN & BOI compliant format",
      "Executive summary framework",
      "Financial projections spreadsheet",
      "Microsoft Word & Google Docs",
      "Instant download",
    ],
    tags: ["business plan", "templates", "entrepreneur", "startup", "CBN"],
    isFeatured: false,
    isNew: false,
    rating: 4.9,
    reviewCount: 403,
    createdAt: "2023-10-01T00:00:00Z",
  },
  {
    id: "digital-002",
    name: "Social Media Content Pack",
    slug: "social-media-content-pack",
    description:
      "500+ ready-to-post social media graphics and captions for Nigerian brands.",
    longDescription:
      "Save hours of content creation with our Social Media Content Pack. Includes 500+ Canva-editable graphics, caption templates, hashtag banks, and a 90-day content calendar — tailored for Nigerian audiences and trending topics. Compatible with Instagram, Facebook, Twitter/X, and LinkedIn.",
    price: 12000,
    originalPrice: 20000,
    category: "digital-products",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop",
    features: [
      "500+ Canva-editable graphics",
      "Caption & hashtag templates",
      "90-day content calendar",
      "Nigerian holidays & events included",
      "Multi-niche design packs",
      "Commercial use licence",
    ],
    tags: ["social media", "Canva", "graphics", "content", "templates"],
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 267,
    createdAt: "2024-02-14T00:00:00Z",
  },
  {
    id: "digital-003",
    name: "Logo Design Bundle",
    slug: "logo-design-bundle",
    description:
      "50 editable professional logo templates for startups and small businesses.",
    longDescription:
      "Launch your brand with confidence using our Logo Design Bundle. Contains 50 modern, fully editable logo templates across multiple industries — including fintech, fashion, food, real estate, and professional services. Delivered in AI, EPS, PNG, and SVG formats for versatile usage across print and digital media.",
    price: 7500,
    originalPrice: 14000,
    category: "digital-products",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop",
    features: [
      "50 editable logo templates",
      "AI, EPS, PNG & SVG formats",
      "Multiple industry niches",
      "Full commercial rights",
      "Adobe Illustrator & Canva compatible",
      "Instant download",
    ],
    tags: ["logo", "branding", "design", "templates", "startup"],
    isFeatured: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 189,
    createdAt: "2024-03-20T00:00:00Z",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
