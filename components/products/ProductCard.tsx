"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  courses: "Course",
  training: "Training",
  software: "Software",
  "digital-products": "Digital",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);
    toast.success(`"${product.name}" added to cart`);
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-green-500 text-white text-[10px]">NEW</Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-brand-gold text-white text-[10px]">
              FEATURED
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-orange-500 text-white text-[10px]">
              -{discount}%
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        {/* Category */}
        <div className="flex items-center gap-1">
          <Tag className="h-3 w-3 text-slate-400" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {categoryLabels[product.category] ?? product.category}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-gold">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="line-clamp-2 flex-1 text-xs text-slate-500">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-slate-400">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 px-4 pb-4 pt-0">
        <Button
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1 h-3 w-3" /> Add to Cart
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/products/${product.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
