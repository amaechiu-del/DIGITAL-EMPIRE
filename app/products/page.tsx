import { Suspense } from "react";
import type { Metadata } from "next";
import { products } from "@/lib/products-data";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import { Product, ProductCategory } from "@/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all digital products, courses, training, and software.",
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

function filterAndSort(params: ProductsPageProps["searchParams"]): Product[] {
  let result = [...products];

  if (params.category) {
    result = result.filter((p) => p.category === (params.category as ProductCategory));
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (params.minPrice) {
    result = result.filter((p) => p.price >= Number(params.minPrice));
  }

  if (params.maxPrice) {
    result = result.filter((p) => p.price <= Number(params.maxPrice));
  }

  switch (params.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  return result;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const filtered = filterAndSort(searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          All Products
        </h1>
        <p className="mt-1 text-slate-500">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <div className="w-full shrink-0 lg:w-60">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-slate-100" />}>
            <ProductFilters />
          </Suspense>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
