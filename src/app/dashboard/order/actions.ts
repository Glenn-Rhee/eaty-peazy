"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type OrderStatusValue = "pending" | "process" | "completed" | "canceled";

export async function getOrders() {
  const orders = await prisma.order.findMany({
    include: { details: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    phoneNumber: order.phoneNumber,
    requestedDate: order.requestedDate.toISOString().slice(0, 10),
    deliveryMethod: order.deliveryMethod as "delivery" | "pickup",
    status: order.status as OrderStatusValue,
    totalAmount: Number(order.totalAmount),
    address: order.address ?? undefined,
    note: order.note ?? undefined,
    items: order.details.map((detail) => ({
      name: detail.product.name,
      quantity: detail.quantity,
      price: Number(detail.price),
    })),
  }));
}

export async function updateOrderStatus(orderId: string, status: OrderStatusValue) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { details: true },
  });
  if (!order || order.status === status) return;

  await prisma.order.update({ where: { id: orderId }, data: { status } });

  // Batalkan pesanan = kembalikan stok yang sempat dipotong saat order dibuat.
  if (status === "canceled" && order.status !== "canceled") {
    for (const detail of order.details) {
      await prisma.stock.update({
        where: { productId: detail.productId },
        data: { quantity: { increment: detail.quantity } },
      });
    }
  }

  revalidatePath("/dashboard/order");
  revalidatePath("/dashboard/stock");
  revalidatePath("/shop", "layout");
}
