import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductTable } from "./product-table";
import { getProducts } from "./actions";

export default async function DashboardProductPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <ProductTable
        products={products}
        title={
          <>
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-secondary">Kelola Produk</h1>
          </>
        }
      />
    </div>
  );
}
