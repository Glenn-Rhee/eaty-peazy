import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

export default function LoginPage() {
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

          {/* TODO: sambungkan ke server action / API login */}
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input type="text" placeholder="admin" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input type="password" placeholder="••••••••" className={inputClass} />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Masuk
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
