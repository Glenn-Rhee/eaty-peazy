import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah, products } from "@/components/lib/mock-data";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: ganti dengan query Prisma (prisma.product.findUnique)
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  const soldOut = product.stock === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/shop"
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        ← Kembali ke produk
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* Galeri */}
        <div>
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-brand-50 text-sm text-brand-700">
            Foto utama produk
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex aspect-square items-center justify-center rounded-lg border border-border bg-neutral-50 text-xs text-muted-foreground"
              >
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-col gap-1">
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <p className="text-2xl font-bold text-brand-700">
                {formatRupiah(product.price)}
              </p>
            </CardHeader>
            <CardDescription>{product.description}</CardDescription>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Stok:</span>
              {soldOut ? (
                <span className="rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-semibold text-error-800">
                  Habis
                </span>
              ) : (
                <span className="rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-semibold text-success-800">
                  Tersedia ({product.stock})
                </span>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle>Jumlah</CardTitle>
            {/* TODO: sambungkan ke state keranjang */}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="h-9 w-9 rounded-lg border border-border text-lg hover:bg-muted"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">1</span>
              <button
                type="button"
                className="h-9 w-9 rounded-lg border border-border text-lg hover:bg-muted"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={soldOut}
              className="mt-5 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tambah ke Keranjang
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
