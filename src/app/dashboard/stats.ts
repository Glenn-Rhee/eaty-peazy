"use server";

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  itemsSold: number;
  activeOrders: number;
  bestSellers: Array<{ name: string; sold: number }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const soldWhere = { order: { status: { not: "canceled" as const } } };
  const [sums, activeOrders, sold, grouped] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "canceled" } },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { status: { in: ["pending", "process"] } } }),
    prisma.orderDetail.aggregate({
      where: soldWhere,
      _sum: { quantity: true },
    }),
    prisma.orderDetail.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: soldWhere,
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    }),
  ]);

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((row) => row.productId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(
    products.map((product) => [product.id, product.name]),
  );

  return {
    totalRevenue: Number(sums._sum.totalAmount ?? 0),
    totalOrders: sums._count._all,
    itemsSold: sold._sum.quantity ?? 0,
    activeOrders,
    bestSellers: grouped.map((row) => ({
      name: nameById.get(row.productId) ?? "-",
      sold: row._sum.quantity ?? 0,
    })),
  };
}
