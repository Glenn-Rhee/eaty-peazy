"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface OrderFormInput {
  customerName: string;
  phoneNumber: string;
  requestedDate: string;
  deliveryMethod: "delivery" | "pickup";
  address?: string;
  note?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export async function createOrder(
  input: OrderFormInput,
): Promise<{ orderId: string } | { error: string }> {
  const customerName = input.customerName.trim();
  const phoneNumber = input.phoneNumber.trim();

  if (!customerName) return { error: "Nama wajib diisi." };

  if (!/^[0-9+\-\s]{8,15}$/.test(phoneNumber))
    return { error: "No. telepon tidak valid." };
  if (!input.requestedDate) return { error: "Tanggal wajib diisi." };
  if (input.deliveryMethod === "delivery" && !input.address?.trim())
    return { error: "Alamat wajib diisi untuk pengiriman." };
  if (input.items.length === 0) return { error: "Keranjang masih kosong." };

  const store = await prisma.store.findFirst({ where: { isOpen: true } });
  if (!store) return { error: "Toko sedang tutup." };

  const period = await prisma.orderPeriod.findFirst({
    where: { storeId: store.id, status: "open" },
    orderBy: { startAt: "desc" },
  });
  if (!period) return { error: "Belum ada periode pesanan yang dibuka." };

  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, deletedAt: null },
    include: { stock: true },
  });

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return { error: "Ada produk yang sudah tidak tersedia." };
    if (!Number.isInteger(item.quantity) || item.quantity < 1)
      return { error: `Jumlah untuk ${product.name} tidak valid.` };
    if ((product.stock?.quantity ?? 0) < item.quantity)
      return { error: `Stok ${product.name} tidak cukup.` };
  }

  const details = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const price = Number(product.price);
    return {
      productId: product.id,
      price,
      quantity: item.quantity,
      subtotal: price * item.quantity,
    };
  });

  const totalAmount = details.reduce((sum, d) => sum + d.subtotal, 0);

  const order = await prisma.order.create({
    data: {
      storeId: store.id,
      orderPeriodId: period.id,
      customerName,
      phoneNumber,
      requestedDate: new Date(input.requestedDate),
      deliveryMethod: input.deliveryMethod,
      address:
        input.deliveryMethod === "delivery" ? input.address?.trim() : null,
      note: input.note?.trim() || null,
      status: "pending",
      totalAmount,
      details: { create: details },
    },
  });

  for (const detail of details) {
    await prisma.stock.update({
      where: { productId: detail.productId },
      data: { quantity: { decrement: detail.quantity } },
    });
  }

  revalidatePath("/dashboard/order");
  revalidatePath("/dashboard/stock");
  revalidatePath("/shop", "layout");

  return { orderId: order.id };
}
