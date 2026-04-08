"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const total = getTotal();

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="font-semibold text-slate-900">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag className="h-16 w-16 text-slate-200" />
              <p className="text-slate-500">Your cart is empty</p>
              <Button onClick={onClose} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-slate-200 p-3"
                >
                  {/* Image */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-brand">
                      {formatPrice(product.price)}
                    </p>
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        disabled={quantity <= 1}
                        className="rounded p-0.5 hover:bg-slate-100 disabled:opacity-40"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1)
                        }
                        className="rounded p-0.5 hover:bg-slate-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="self-start rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 px-4 py-4 space-y-3">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>Subtotal</span>
              <span className="font-bold text-brand">{formatPrice(total)}</span>
            </div>
            <Button asChild className="w-full" onClick={onClose}>
              <Link href="/checkout">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full" onClick={onClose}>
              <Link href="/cart">View Full Cart</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
