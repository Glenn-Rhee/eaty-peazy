"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { stock: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    ...p,
    price: p.price.toString(),
  }));
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const imageUrl = (formData.get("imageUrl") as string | null) ?? null;
  const quantity = parseInt(formData.get("quantity") as string) || 0;

  if (!name || !price) return { error: "Nama dan harga wajib diisi." };

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      description: description || null,
      imageUrl: imageUrl || null,
    },
  });

  await prisma.stock.create({
    data: { productId: product.id, quantity },
  });

  revalidatePath("/dashboard/product");
  revalidatePath("/dashboard/stock");
  revalidatePath("/shop", "layout");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const imageUrl = (formData.get("imageUrl") as string | null) ?? null;

  if (!name || !price) return { error: "Nama dan harga wajib diisi." };

  await prisma.product.update({
    where: { id },
    data: {
      name,
      price: parseFloat(price),
      description: description || null,
      imageUrl: imageUrl || undefined,
    },
  });

  revalidatePath("/dashboard/product");
  revalidatePath("/shop", "layout");
}

export async function deleteProduct(id: string) {
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard/product");
  revalidatePath("/dashboard/stock");
  revalidatePath("/shop", "layout");
}
