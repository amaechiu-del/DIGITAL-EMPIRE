"use client";

import Image from "next/image";
import { ShoppingCart, Star, CheckCircle, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categoryLabels: Record<string, string> = {
  courses: "Course",
  training: "Training",
  software: "Software",
  "digital-products": "Digital Product",
};

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  function handleAddToCart() {
    addToCart(product);
    toast.success(`"${product.name}" added to cart`);
  }

  function handleBuyNow() {
    addToCart(product);
    router.push("/checkout");
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl bg-slate-100 aspect-[4/3]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-white">NEW</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-brand-gold text-white">FEATURED</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {categoryLabels[product.category] ?? product.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-slate-200 text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  Save {discount}%
                </Badge>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>

          {/* CTA */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Long Description & Features */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            About this Product
          </h2>
          <p className="leading-relaxed text-slate-600">{product.longDescription}</p>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            What&apos;s Included
          </h2>
          <ul className="space-y-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
