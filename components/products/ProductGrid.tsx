import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white">
      <div className="aspect-[16/9] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
        <div className="h-5 w-1/2 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-8 flex-1 rounded bg-slate-200" />
          <div className="h-8 w-20 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-semibold text-slate-600">No products found</p>
        <p className="mt-2 text-sm text-slate-400">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
