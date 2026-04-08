import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Digital Empire | DOMISLINK INTERNATIONAL",
    template: "%s | Digital Empire",
  },
  description:
    "Nigeria's premier digital marketplace for courses, training programs, software, and digital products. Empowering businesses and entrepreneurs.",
  keywords: ["digital marketplace", "Nigeria", "courses", "software", "training", "DOMISLINK"],
  openGraph: {
    title: "Digital Empire | DOMISLINK INTERNATIONAL",
    description:
      "Nigeria's premier digital marketplace for courses, training, software, and digital products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
