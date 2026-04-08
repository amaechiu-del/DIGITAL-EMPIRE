import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductById } from "@/lib/products-data";
import ProductDetail from "@/components/products/ProductDetail";
import ProductGrid from "@/components/products/ProductGrid";

interface ProductPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Related Products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
