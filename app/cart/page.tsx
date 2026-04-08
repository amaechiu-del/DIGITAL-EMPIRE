"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-24 w-24 text-slate-200" />
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="mb-6 text-slate-500">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-brand-gold line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-brand">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    disabled={quantity <= 1}
                    className="rounded border border-slate-200 p-1 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="rounded border border-slate-200 p-1 hover:bg-slate-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <span className="ml-auto text-sm text-slate-500">
                    Subtotal: {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <Button variant="outline" asChild>
              <Link href="/products">← Continue Shopping</Link>
            </Button>
            <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600">
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <div className="space-y-2 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-slate-600">
                <span className="truncate max-w-[180px]">
                  {product.name} × {quantity}
                </span>
                <span>{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
            <span>Total</span>
            <span className="text-brand">{formatPrice(total)}</span>
          </div>

          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
