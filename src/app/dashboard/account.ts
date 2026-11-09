"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type Account = { username: string; imageUrl: string | null };

export async function getAccount(): Promise<Account | null> {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { username: true, imageUrl: true },
  });
}

export async function updateProfileImage(dataUrl: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi berakhir, silakan login ulang." };

  if (!dataUrl.startsWith("data:image/")) {
    return { error: "File harus berupa gambar." };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { imageUrl: dataUrl },
  });

  revalidatePath("/dashboard", "layout");
}
