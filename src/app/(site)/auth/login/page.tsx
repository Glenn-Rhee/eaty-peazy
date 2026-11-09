"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/auth-actions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 block text-center text-xl font-bold text-secondary"
        >
          Nama<span className="text-primary">Toko</span>
        </Link>

        <Card>
          <CardHeader className="flex-col gap-1">
            <CardTitle className="text-lg">Masuk ke Dashboard</CardTitle>
            <CardDescription>
              Gunakan akun admin untuk mengelola toko.
            </CardDescription>
          </CardHeader>

          <form action={formAction} className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="admin"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
                required
              />
            </div>

            {state.error ? (
              <p role="alert" className="text-sm text-red-600">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </Card>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-muted-foreground hover:text-brand-700"
        >
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
