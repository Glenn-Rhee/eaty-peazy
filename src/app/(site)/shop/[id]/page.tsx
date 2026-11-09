import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCart } from "@/components/shop/add-to-cart";

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: { stock: true, images: true },
  });

  if (!product) notFound();

  const soldOut = (product.stock?.quantity ?? 0) === 0;
  const gallery = product.images?.length
    ? (product.images
        .map((image) => resolveProductImage(product.name, image.url))
        .filter(Boolean) as string[])
    : [resolveProductImage(product.name, product.imageUrl)];
  const primaryImage = gallery[0] || "/seed/products/default-product.svg";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-neutral-900 lg:px-6">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-base font-black text-[#f39a1e] hover:underline"
      >
        <span aria-hidden="true">←</span>
        Kembali ke produk
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[22px] bg-[#f5f3ee] p-3 shadow-inner ring-1 ring-black/10">
          <div className="flex aspect-[1.18/1] items-center justify-center overflow-hidden rounded-[18px] bg-[#f3e8d9]">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-brand-700">Foto utama produk</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.length > 0 ? (
              gallery.slice(0, 4).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="flex aspect-square items-center justify-center overflow-hidden rounded-[14px] border border-[#d5d0c8] bg-[#efe9e1]"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex aspect-square items-center justify-center rounded-[14px] border border-[#d5d0c8] bg-[#efe9e1] text-xs text-muted-foreground"
                >
                  {n}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[18px] bg-[#f3f1ee] p-5 shadow-[0_4px_0_rgba(0,0,0,0.08)] ring-1 ring-black/10">
            <h1 className="text-3xl font-black text-[#2d2d2d]">{product.name}</h1>
            <p className="mt-4 text-3xl font-black text-[#f39a1e]">
              {formatRupiah(Number(product.price))}
            </p>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              {product.description ?? "Tidak ada deskripsi."}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">Stok:</span>
              {soldOut ? (
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                  Habis
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  Tersedia ({product.stock?.quantity ?? 0})
                </span>
              )}
            </div>
          </div>

          <AddToCart
            productId={product.id}
            name={product.name}
            price={Number(product.price)}
            maxQuantity={product.stock?.quantity ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
