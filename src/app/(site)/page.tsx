import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StorefrontAvailability } from "@/components/layout/store-status-toggle";

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

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const features = [
  {
    icon: "🛒",
    title: "Pesan dengan Mudah",
    description:
      "Pilih produk, isi data pemesan, dan pesanan Anda langsung tercatat tanpa ribet.",
  },
  {
    icon: "🚚",
    title: "Antar atau Ambil Sendiri",
    description:
      "Pilih metode pengiriman sesuai kebutuhan: diantar ke alamat atau ambil langsung di toko.",
  },
  {
    icon: "✅",
    title: "Kualitas Terjaga",
    description:
      "Setiap produk dibuat dengan bahan pilihan dan diproses sesuai periode pemesanan.",
  },
];

export default async function LandingPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { stock: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const featured = products.map((product) => ({
    ...product,
    price: Number(product.price),
    image: resolveProductImage(product.name, product.imageUrl),
  }));

  return (
    <StorefrontAvailability>
      {/* Hero */}
      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700">
              Pemesanan sedang dibuka
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-secondary md:text-5xl">
              Judul utama toko Anda ditulis di sini
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Deskripsi singkat tentang toko Anda, apa yang dijual, dan mengapa
              pelanggan harus memesan dari Anda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary-hover"
              >
                Belanja Sekarang
              </Link>
              <Link
                href="#produk-unggulan"
                className="rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-muted"
              >
                Lihat Produk Unggulan
              </Link>
            </div>
          </div>

          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <img
              src="/seed/products/lapis-legit.svg"
              alt="Produk unggulan"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-secondary">
            Kenapa Memilih Kami
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tiga alasan utama pelanggan kembali memesan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-xl">
                  {feature.icon}
                </span>
                <CardTitle className="mt-2 text-base">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Produk unggulan */}
      <section id="produk-unggulan" className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary">
                Produk Unggulan
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pilihan favorit pelanggan kami.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`}>
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  <div className="mb-4 overflow-hidden rounded-lg bg-brand-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {product.description ?? "Tidak ada deskripsi."}
                  </CardDescription>
                  <p className="mt-3 font-bold text-brand-700">
                    {formatRupiah(product.price)}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold">Siap memesan?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-secondary-200">
            Lihat semua produk kami dan buat pesanan Anda hari ini.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary-hover"
          >
            Mulai Belanja
          </Link>
        </div>
      </section>
    </StorefrontAvailability>
  );
}
