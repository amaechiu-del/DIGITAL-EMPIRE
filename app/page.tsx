import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Monitor, Package, Zap, Star, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductGrid from "@/components/products/ProductGrid";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { getFeaturedProducts } from "@/lib/products-data";

const categories = [
  {
    label: "Courses",
    description: "Master in-demand skills with expert-led video courses.",
    href: "/products?category=courses",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Training",
    description: "Hands-on training programs for career & business growth.",
    href: "/products?category=training",
    icon: Users,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Software",
    description: "Professional software built for Nigerian businesses.",
    href: "/products?category=software",
    icon: Monitor,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Digital Products",
    description: "Instant-download templates, assets, and resources.",
    href: "/products?category=digital-products",
    icon: Package,
    color: "bg-orange-50 text-orange-600",
  },
];

const testimonials = [
  {
    name: "Chukwuemeka Obi",
    role: "Digital Entrepreneur, Lagos",
    text: "The Digital Marketing Masterclass transformed my business. Revenue grew by 300% in 6 months. Best investment I've ever made!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop",
  },
  {
    name: "Amaka Nwosu",
    role: "Freelancer, Abuja",
    text: "The Social Media Content Pack saved me hours every week. My clients are so impressed with the quality of content I deliver now.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=80&auto=format&fit=crop",
  },
  {
    name: "Biodun Adeyemi",
    role: "SME Owner, Ibadan",
    text: "The Business Accounting Software is a game-changer. I can finally track my finances without paying an accountant every month.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-sm text-brand-gold">
            <Zap className="h-3 w-3" /> DOMISLINK INTERNATIONAL
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Empowering Digital
            <br />
            <span className="text-brand-gold">Excellence</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Nigeria&apos;s #1 digital marketplace for premium courses, expert
            training, powerful software, and ready-to-use digital assets. Level
            up your business today.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-brand-gold text-white hover:bg-brand-gold/90" asChild>
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { value: "500+", label: "Products", icon: ShoppingBag },
              { value: "10,000+", label: "Customers", icon: Users },
              { value: "4", label: "Categories", icon: Package },
              { value: "4.8★", label: "Average Rating", icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <span className="text-2xl font-extrabold text-brand">{value}</span>
                <span className="text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Featured Products
              </h2>
              <p className="mt-1 text-slate-500">
                Handpicked by our team for maximum impact
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-slate-500">
              Find exactly what you need to grow
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href}>
                <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${cat.color}`}>
                      <cat.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{cat.label}</h3>
                    <p className="text-sm text-slate-500">{cat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="mb-3 flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-slate-600 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────── */}
      <section className="bg-brand py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            Stay Ahead of the Curve
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-slate-300">
            Subscribe for exclusive deals, new product launches, and digital
            business tips delivered straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
