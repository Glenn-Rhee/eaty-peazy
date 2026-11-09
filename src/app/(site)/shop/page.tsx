import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { StorefrontAvailability } from "@/components/layout/store-status-toggle";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function resolveProductImage(name: string, imageUrl?: string | null) {
  if (imageUrl) {
    return imageUrl.replace(/\.(jpg|jpeg|png)$/i, ".svg");
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `/seed/products/${slug || "default-product"}.svg`;
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { stock: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <StorefrontAvailability>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary">Semua Produk</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilih produk favorit Anda dan tambahkan ke keranjang.
            </p>
          </div>

          <input
            type="search"
            placeholder="Cari produk..."
            className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 sm:w-64"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const soldOut = (product.stock?.quantity ?? 0) === 0;
            const imageUrl = resolveProductImage(product.name, product.imageUrl);

            return (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="block h-full"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-brand-50">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    {soldOut && (
                      <span className="absolute left-3 top-3 rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-semibold text-error-800">
                        Stok habis
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {product.description ?? "Tidak ada deskripsi."}
                  </CardDescription>
                  <p className="mt-3 font-bold text-brand-700">
                    {formatRupiah(Number(product.price))}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </StorefrontAvailability>
  );
}
