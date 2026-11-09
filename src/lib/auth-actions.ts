"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const user = await prisma.user.findFirst({ where: { username } });

  if (!user) {
    return { error: "Username atau password salah." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Username atau password salah." };
  }

  await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
