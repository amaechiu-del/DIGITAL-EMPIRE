import Link from "next/link";
import { Zap, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">DIGITAL EMPIRE</span>
            </Link>
            <p className="mb-4 text-sm text-slate-300">
              DOMISLINK INTERNATIONAL — empowering Nigerian businesses and
              entrepreneurs with world-class digital products, courses, software,
              and training.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-md p-2 text-slate-300 transition-colors hover:bg-brand-accent hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Products
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                { label: "All Products", href: "/products" },
                { label: "Courses", href: "/products?category=courses" },
                { label: "Training", href: "/products?category=training" },
                { label: "Software", href: "/products?category=software" },
                {
                  label: "Digital Products",
                  href: "/products?category=digital-products",
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="mailto:support@domislink.com" className="hover:text-white">
                  support@domislink.com
                </a>
              </li>
              <li>
                <a href="tel:+2348000000000" className="hover:text-white">
                  +234 800 000 0000
                </a>
              </li>
              <li className="text-slate-500">
                Mon – Fri, 9am – 6pm WAT
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-accent pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} DOMISLINK INTERNATIONAL. All rights
          reserved. Digital Empire is a product of DOMISLINK INTERNATIONAL.
        </div>
      </div>
    </footer>
  );
}
