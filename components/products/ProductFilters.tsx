"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { value: "", label: "All Products" },
  { value: "courses", label: "Courses" },
  { value: "training", label: "Training" },
  { value: "software", label: "Software" },
  { value: "digital-products", label: "Digital Products" },
];

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "latest";
  const currentSearch = searchParams.get("search") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function updateSearchDebounced(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 400);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters =
    currentCategory || currentSearch || currentMinPrice || currentMaxPrice;

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-brand-gold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search products..."
            defaultValue={currentSearch}
            onChange={(e) => updateSearchDebounced(e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Category
        </label>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParam("category", cat.value)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm transition-colors",
                currentCategory === cat.value
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Price Range (₦)
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className="w-full"
          />
          <span className="text-slate-400">–</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Sort By
        </label>
        <div className="flex flex-col gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("sort", opt.value)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm transition-colors",
                currentSort === opt.value
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Reset Filters
      </Button>
    </aside>
  );
}
