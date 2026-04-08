"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { checkoutSchema, CheckoutFormData } from "@/lib/validators";
import { initializePaystackPayment, generatePaymentReference } from "@/lib/paystack";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const total = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.displayName ?? "",
      email: user?.email ?? "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-24 w-24 text-slate-200" />
        <h1 className="mb-2 text-2xl font-bold text-slate-800">
          Your cart is empty
        </h1>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  function onSubmit(data: CheckoutFormData) {
    setProcessing(true);
    const reference = generatePaymentReference();

    initializePaystackPayment({
      email: data.email,
      amount: total,
      reference,
      onSuccess: (ref) => {
        clearCart();
        toast.success("Payment successful! Thank you for your order.");
        router.push(`/dashboard?ref=${ref}`);
      },
      onClose: () => {
        setProcessing(false);
        toast.info("Payment window closed.");
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Customer Information
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Chukwuemeka Obi"
                {...register("fullName")}
                className="mt-1"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08012345678"
                {...register("phone")}
                className="mt-1"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={processing}
            >
              {processing ? "Processing…" : `Pay ${formatPrice(total)} with Paystack`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-slate-600">
                <span className="max-w-[220px] truncate">
                  {product.name} × {quantity}
                </span>
                <span className="font-medium">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900 text-base">
            <span>Total</span>
            <span className="text-brand">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Secure payment powered by Paystack. Your data is encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
