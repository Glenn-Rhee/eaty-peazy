/* =============================================================================
 * Seeder — Toko
 * =============================================================================
 * Jalankan dengan:  npx prisma db seed
 * (package.json -> "prisma": { "seed": "tsx prisma/seed.ts" })
 *
 * Isi:
 *   1. User admin
 *   2. Toko + periode order (1 tertutup, 1 terbuka)
 *   3. Data demo (opsional, matikan dengan SEED_DEMO=false):
 *        produk + stok + gambar produk, lalu pesanan + detail pesanan
 *
 * Idempotent — semua baris di-upsert memakai ID deterministik, jadi aman
 * dijalankan berulang tanpa duplikasi.
 * ============================================================================= */

import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import {
  DeliveryMethod,
  OrderStatus,
  PeriodStatus,
  PrismaClient,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

/** UUID deterministik dari sebuah label (idempoten antar-jalankan). */
function seedId(label: string): string {
  const h = createHash("sha256").update(`toko:${label}`).digest("hex");
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    `4${h.slice(13, 16)}`, // version 4
    `8${h.slice(17, 20)}`, // variant 8-b
    h.slice(20, 32),
  ].join("-");
}

const S = seedId;

/** Matikan data demo (pertahankan admin, toko, dan periode order). */
const SEED_DEMO = process.env.SEED_DEMO !== "false";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

/* -----------------------------------------------------------------------------
 * Data sumber
 * -------------------------------------------------------------------------- */

interface ProductSeed {
  key: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  /** true = produk diarsipkan (soft delete lewat deleted_at). */
  archived?: boolean;
}

const productSeeds: ProductSeed[] = [
  {
    key: "lapis-legit",
    name: "Kue Lapis Legit",
    price: 85000,
    stock: 24,
    description:
      "Lapis legit dengan tekstur lembut dan aroma rempah yang khas. Cocok untuk hampers dan acara keluarga.",
    images: [
      "/seed/products/lapis-legit-1.jpg",
      "/seed/products/lapis-legit-2.jpg",
    ],
  },
  {
    key: "brownies",
    name: "Brownies Panggang",
    price: 55000,
    stock: 8,
    description:
      "Brownies panggang dengan cokelat pekat dan bagian atas yang renyah.",
    images: ["/seed/products/brownies-1.jpg"],
  },
  {
    key: "bolu-pandan",
    name: "Bolu Pandan",
    price: 35000,
    stock: 40,
    description: "Bolu pandan lembut dengan aroma alami, dibuat setiap hari.",
    images: ["/seed/products/bolu-pandan-1.jpg"],
  },
  {
    key: "nastar",
    name: "Nastar Premium",
    price: 120000,
    stock: 15,
    description: "Nastar isi selai nanas homemade dengan mentega pilihan.",
    images: ["/seed/products/nastar-1.jpg", "/seed/products/nastar-2.jpg"],
  },
  {
    key: "cheese-roll",
    name: "Cheese Roll",
    price: 65000,
    stock: 0, // contoh stok habis
    description:
      "Roll keju gurih dengan lapisan renyah di luar dan lembut di dalam.",
    images: ["/seed/products/cheese-roll-1.jpg"],
  },
  {
    key: "donat-kentang",
    name: "Donat Kentang",
    price: 45000,
    stock: 30,
    description: "Donat kentang empuk dengan berbagai pilihan topping.",
    images: ["/seed/products/donat-kentang-1.jpg"],
  },
  {
    key: "roti-gandum",
    name: "Roti Tawar Gandum (Arsip)",
    price: 30000,
    stock: 0,
    description:
      "Produk lama yang sudah tidak dijual — contoh data soft delete.",
    images: [],
    archived: true,
  },
];

const productByKey = new Map(productSeeds.map((p) => [p.key, p]));

interface OrderSeed {
  key: string;
  period: "2026-09" | "2026-10";
  customerName: string;
  phoneNumber: string;
  requestedDate: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
  note?: string;
  status: OrderStatus;
  createdAt: string;
  items: Array<{ product: string; quantity: number }>;
}

const orderSeeds: OrderSeed[] = [
  {
    key: "001",
    period: "2026-10",
    customerName: "Budi Santoso",
    phoneNumber: "081234567890",
    requestedDate: "2026-10-22T09:00:00+07:00",
    deliveryMethod: "delivery",
    address: "Jl. Melati No. 12, Depok, Jawa Barat",
    note: "Mohon dikemas rapi untuk hampers.",
    status: "pending",
    createdAt: "2026-10-18T10:15:00+07:00",
    items: [{ product: "lapis-legit", quantity: 2 }],
  },
  {
    key: "002",
    period: "2026-10",
    customerName: "Siti Aminah",
    phoneNumber: "082198765432",
    requestedDate: "2026-10-23T14:00:00+07:00",
    deliveryMethod: "pickup",
    status: "process",
    createdAt: "2026-10-18T16:40:00+07:00",
    items: [
      { product: "nastar", quantity: 1 },
      { product: "bolu-pandan", quantity: 2 },
    ],
  },
  {
    key: "003",
    period: "2026-09",
    customerName: "Andi Wijaya",
    phoneNumber: "085212345678",
    requestedDate: "2026-10-05T11:00:00+07:00",
    deliveryMethod: "delivery",
    address: "Perumahan Griya Asri Blok C3, Bogor",
    status: "completed",
    createdAt: "2026-10-01T08:20:00+07:00",
    items: [
      { product: "lapis-legit", quantity: 2 },
      { product: "brownies", quantity: 1 },
      { product: "donat-kentang", quantity: 1 },
    ],
  },
  {
    key: "004",
    period: "2026-09",
    customerName: "Dewi Lestari",
    phoneNumber: "081377788899",
    requestedDate: "2026-10-02T10:00:00+07:00",
    deliveryMethod: "pickup",
    status: "completed",
    createdAt: "2026-09-29T13:05:00+07:00",
    items: [{ product: "bolu-pandan", quantity: 2 }],
  },
  {
    key: "005",
    period: "2026-09",
    customerName: "Rudi Hartono",
    phoneNumber: "087855566677",
    requestedDate: "2026-09-28T09:30:00+07:00",
    deliveryMethod: "delivery",
    address: "Jl. Kenanga No. 7, Jakarta Selatan",
    note: "Dibatalkan oleh pelanggan.",
    status: "canceled",
    createdAt: "2026-09-25T19:00:00+07:00",
    items: [{ product: "cheese-roll", quantity: 1 }],
  },
];

/* -----------------------------------------------------------------------------
 * Main
 * -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  console.log("🌱 Seeding Toko …");

  /* ---------------------------------------------------------------------------
   * 1. USER ADMIN
   * ------------------------------------------------------------------------- */

  const admin = await prisma.user.upsert({
    where: { id: S("user:admin") },
    create: {
      id: S("user:admin"),
      username: "admin",
      password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
      role: Role.admin,
    },
    // password sengaja tidak di-update agar tidak menimpa password yang sudah diganti
    update: { username: "admin", role: Role.admin },
  });

  console.log("  ✓ user admin");

  /* ---------------------------------------------------------------------------
   * 2. TOKO & PERIODE ORDER
   * ------------------------------------------------------------------------- */

  const store = await prisma.store.upsert({
    where: { id: S("store:utama") },
    create: {
      id: S("store:utama"),
      name: "Toko Kue Nusantara",
      description:
        "Toko kue rumahan dengan sistem pre-order. Pesanan dibuka per periode dan bisa diambil sendiri atau diantar.",
      imageUrl: "/seed/store/logo.png",
      isOpen: true,
    },
    update: {
      name: "Toko Kue Nusantara",
      description:
        "Toko kue rumahan dengan sistem pre-order. Pesanan dibuka per periode dan bisa diambil sendiri atau diantar.",
      isOpen: true,
    },
  });

  const periodSeeds: Record<
    OrderSeed["period"],
    { startAt: string; endAt: string | null; status: PeriodStatus }
  > = {
    "2026-09": {
      startAt: "2026-09-15",
      endAt: "2026-10-10",
      status: PeriodStatus.closed,
    },
    "2026-10": {
      startAt: "2026-10-12",
      endAt: "2026-10-31",
      status: PeriodStatus.open,
    },
  };

  const periods = new Map<OrderSeed["period"], { id: string }>();
  for (const [key, p] of Object.entries(periodSeeds) as Array<
    [OrderSeed["period"], (typeof periodSeeds)[OrderSeed["period"]]]
  >) {
    const period = await prisma.orderPeriod.upsert({
      where: { id: S(`order-period:${key}`) },
      create: {
        id: S(`order-period:${key}`),
        storeId: store.id,
        startAt: new Date(p.startAt),
        endAt: p.endAt ? new Date(p.endAt) : null,
        status: p.status,
      },
      update: {
        storeId: store.id,
        startAt: new Date(p.startAt),
        endAt: p.endAt ? new Date(p.endAt) : null,
        status: p.status,
      },
    });
    periods.set(key, period);
  }

  console.log("  ✓ toko & periode order");

  /* ---------------------------------------------------------------------------
   * 3. DATA DEMO (opsional)
   * ------------------------------------------------------------------------- */

  if (!SEED_DEMO) {
    console.log("  ℹ SKIP data demo (SEED_DEMO=false)");
    return;
  }

  /* --- 3.1 Produk, stok, gambar produk -------------------------------- */

  const productIds = new Map<string, string>();

  for (const p of productSeeds) {
    const productId = S(`product:${p.key}`);
    const deletedAt = p.archived ? new Date("2026-09-30T00:00:00+07:00") : null;

    await prisma.product.upsert({
      where: { id: productId },
      create: {
        id: productId,
        name: p.name,
        price: p.price,
        description: p.description,
        imageUrl: p.images[0] ?? null,
        deletedAt,
      },
      update: {
        name: p.name,
        price: p.price,
        description: p.description,
        imageUrl: p.images[0] ?? null,
        deletedAt,
      },
    });
    productIds.set(p.key, productId);

    await prisma.stock.upsert({
      where: { id: S(`stock:${p.key}`) },
      create: {
        id: S(`stock:${p.key}`),
        productId,
        quantity: p.stock,
        deletedAt,
      },
      update: { quantity: p.stock, deletedAt },
    });

    for (const [i, url] of p.images.entries()) {
      await prisma.imageProduct.upsert({
        where: { id: S(`image-product:${p.key}:${i}`) },
        create: { id: S(`image-product:${p.key}:${i}`), productId, url },
        update: { productId, url },
      });
    }
  }

  console.log(`  ✓ ${productSeeds.length} produk + stok + gambar`);

  /* --- 3.2 Pesanan & detail pesanan ------------------------------------ */

  for (const o of orderSeeds) {
    const orderId = S(`order:${o.key}`);
    const period = periods.get(o.period);
    if (!period) throw new Error(`Periode ${o.period} tidak ditemukan`);

    // Hitung harga dari data produk agar subtotal & total selalu konsisten.
    const lines = o.items.map((item) => {
      const product = productByKey.get(item.product);
      if (!product) throw new Error(`Produk ${item.product} tidak ditemukan`);
      return {
        productKey: item.product,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });
    const totalAmount = lines.reduce((sum, line) => sum + line.subtotal, 0);

    const orderData = {
      storeId: store.id,
      orderPeriodId: period.id,
      customerName: o.customerName,
      phoneNumber: o.phoneNumber,
      requestedDate: new Date(o.requestedDate),
      deliveryMethod: o.deliveryMethod,
      address: o.address ?? null,
      note: o.note ?? null,
      status: o.status,
      totalAmount,
    };

    await prisma.order.upsert({
      where: { id: orderId },
      create: { id: orderId, createdAt: new Date(o.createdAt), ...orderData },
      update: orderData,
    });

    for (const line of lines) {
      const detailId = S(`order-detail:${o.key}:${line.productKey}`);
      const productId = productIds.get(line.productKey);
      if (!productId)
        throw new Error(`ID produk ${line.productKey} tidak ditemukan`);

      const detailData = {
        orderId,
        productId,
        price: line.price,
        quantity: line.quantity,
        subtotal: line.subtotal,
      };

      await prisma.orderDetail.upsert({
        where: { id: detailId },
        create: {
          id: detailId,
          createdAt: new Date(o.createdAt),
          ...detailData,
        },
        update: detailData,
      });
    }
  }

  console.log(`  ✓ ${orderSeeds.length} pesanan + detail pesanan`);

  /* ---------------------------------------------------------------------------
   * SELESAI
   * ------------------------------------------------------------------------- */

  console.log("✅ Seed selesai. Ringkasan:");
  console.log(`   - Admin           : ${admin.username}`);
  console.log(`   - Password admin  : ${ADMIN_PASSWORD}`);
  console.log(`   - Toko            : ${store.name}`);
  console.log(`   - Periode order   : 2026-09 (closed), 2026-10 (open)`);
  console.log(`   - Produk          : ${productSeeds.length} (1 diarsipkan)`);
  console.log(`   - Pesanan         : ${orderSeeds.length}`);
}

main()
  .catch((err) => {
    console.error("❌ Seed gagal:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
