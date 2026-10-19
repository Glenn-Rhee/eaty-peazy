"use client";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Data contoh untuk template. Ganti dengan query Prisma saat backend siap.

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
}

export type OrderStatus = "pending" | "process" | "completed" | "canceled";

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  requestedDate: string;
  deliveryMethod: "delivery" | "pickup";
  status: OrderStatus;
  totalAmount: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Kue Lapis Legit",
    price: 85000,
    stock: 24,
    description:
      "Lapis legit dengan tekstur lembut dan aroma rempah yang khas. Cocok untuk hampers dan acara keluarga.",
  },
  {
    id: "2",
    name: "Brownies Panggang",
    price: 55000,
    stock: 8,
    description:
      "Brownies panggang dengan cokelat pekat dan bagian atas yang renyah.",
  },
  {
    id: "3",
    name: "Bolu Pandan",
    price: 35000,
    stock: 40,
    description: "Bolu pandan lembut dengan aroma alami, dibuat setiap hari.",
  },
  {
    id: "4",
    name: "Nastar Premium",
    price: 120000,
    stock: 15,
    description: "Nastar isi selai nanas homemade dengan mentega pilihan.",
  },
  {
    id: "5",
    name: "Cheese Roll",
    price: 65000,
    stock: 0,
    description:
      "Roll keju gurih dengan lapisan renyah di luar dan lembut di dalam.",
  },
  {
    id: "6",
    name: "Donat Kentang",
    price: 45000,
    stock: 30,
    description: "Donat kentang empuk dengan berbagai pilihan topping.",
  },
];

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Budi Santoso",
    phoneNumber: "081234567890",
    requestedDate: "2026-10-22",
    deliveryMethod: "delivery",
    status: "pending",
    totalAmount: 170000,
  },
  {
    id: "ORD-002",
    customerName: "Siti Aminah",
    phoneNumber: "082198765432",
    requestedDate: "2026-10-23",
    deliveryMethod: "pickup",
    status: "process",
    totalAmount: 120000,
  },
  {
    id: "ORD-003",
    customerName: "Andi Wijaya",
    phoneNumber: "085212345678",
    requestedDate: "2026-10-18",
    deliveryMethod: "delivery",
    status: "completed",
    totalAmount: 255000,
  },
  {
    id: "ORD-004",
    customerName: "Dewi Lestari",
    phoneNumber: "081377788899",
    requestedDate: "2026-10-15",
    deliveryMethod: "pickup",
    status: "completed",
    totalAmount: 90000,
  },
  {
    id: "ORD-005",
    customerName: "Rudi Hartono",
    phoneNumber: "087855566677",
    requestedDate: "2026-10-12",
    deliveryMethod: "delivery",
    status: "canceled",
    totalAmount: 65000,
  },
];

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Menunggu",
  process: "Diproses",
  completed: "Selesai",
  canceled: "Dibatalkan",
};

export const orderStatusClass: Record<OrderStatus, string> = {
  pending: "bg-warning-100 text-warning-800",
  process: "bg-info-100 text-info-800",
  completed: "bg-success-100 text-success-800",
  canceled: "bg-error-100 text-error-800",
};

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

export default function LandingPage() {
  const featured = products.slice(0, 3);

  return (
    <>
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
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Belanja Sekarang
              </Link>
              <Link
                href="#produk-unggulan"
                className="rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Lihat Produk Unggulan
              </Link>
            </div>
          </div>

          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-white text-sm text-muted-foreground shadow-sm">
            Gambar hero
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
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="mb-4 flex aspect-square items-center justify-center rounded-lg bg-brand-50 text-sm text-brand-700">
                    Foto produk
                  </div>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {product.description}
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
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Mulai Belanja
          </Link>
        </div>
      </section>
    </>
  );
}
