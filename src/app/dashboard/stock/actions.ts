"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getStocks() {
  const stocks = await prisma.stock.findMany({
    where: { deletedAt: null, product: { deletedAt: null } },
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });

  return stocks.map((s) => ({
    ...s,
    product: {
      ...s.product,
      price: s.product.price.toString(),
    },
  }));
}

export async function updateStock(stockId: string, quantity: number) {
  await prisma.stock.update({
    where: { id: stockId },
    data: { quantity },
  });
  revalidatePath("/dashboard/stock");
  revalidatePath("/shop", "layout");
}

export async function addStock(stockId: string, amount: number) {
  const stock = await prisma.stock.findUnique({ where: { id: stockId } });
  if (!stock) throw new Error("Stock not found");

  await prisma.stock.update({
    where: { id: stockId },
    data: { quantity: stock.quantity + amount },
  });
  revalidatePath("/dashboard/stock");
  revalidatePath("/shop", "layout");
}
