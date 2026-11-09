"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/auth-actions";
import { updateProfileImage, type Account } from "@/app/dashboard/account";

const menus = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/product", label: "Kelola Produk" },
  { href: "/dashboard/stock", label: "Inventaris\nStok" },
  { href: "/dashboard/order", label: "Kelola Order PO" },
];

export function DashboardSidebar({ account }: { account: Account | null }) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(account?.imageUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = (account?.username ?? "A").charAt(0).toUpperCase();

  function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      setImageUrl(dataUrl);
      startTransition(async () => {
        const result = await updateProfileImage(dataUrl);
        if (result?.error) setError(result.error);
      });
    };
    reader.readAsDataURL(file);
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <aside className="flex flex-col bg-[#2d2d2d] text-[#f6f1e7] md:min-h-screen md:w-[240px] md:shrink-0">
      <nav className="flex flex-col gap-2 px-3 py-4 md:pt-5">
        {menus.map((menu) => {
          const active =
            menu.href === "/dashboard"
              ? pathname === menu.href
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={`${menu.href}-${menu.label}`}
              href={menu.href}
              className={cn(
                "whitespace-pre-line rounded-xl px-4 py-3 text-left text-base font-semibold leading-tight transition-colors duration-200",
                active
                  ? "bg-[#f3efe3] text-[#1d1d1d] shadow-sm"
                  : "text-[#f6f1e7]/85 hover:bg-white/5 hover:text-white",
              )}
            >
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto flex justify-center pb-6 pt-8 md:block md:px-4">
        <button
          type="button"
          onClick={() => setAccountOpen((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#ff9d1d] bg-[#f5f0e5] text-xl font-bold text-[#1d1d1d] shadow-md transition hover:scale-105"
          aria-label="Akun admin"
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={account?.username ?? "Admin"}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </button>

        {accountOpen && (
          <div className="absolute bottom-24 left-3 z-30 w-[300px] rounded-2xl border-2 border-[#2d2d2d] bg-[#f7f1e8] p-4 text-[#2d2d2d] shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:bottom-24 md:left-4">
            <div className="mb-3 text-[15px] font-bold uppercase tracking-[0.04em]">
              welcome,
            </div>
            <div className="mb-3 text-[18px] font-black leading-tight">
              {account?.username ?? "admin"}
            </div>

            <div className="flex items-center gap-4 rounded-[14px] border-[2px] border-[#3a7bd5] bg-[#f2efe8] p-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#e0d8ca] bg-[#f4e7d4] text-xl font-bold text-[#4a4a4a]"
                aria-label="Ganti foto profil"
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </button>
              <div className="text-left">
                <div className="text-xl font-black">{account?.username ?? "Admin"}</div>
                <div className="text-sm text-[#5a5a5a]">Owner</div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isPending}
                  className="mt-2 text-xs font-semibold text-[#3a7bd5] hover:underline disabled:opacity-60"
                >
                  {isPending ? "Menyimpan..." : "Ganti foto"}
                </button>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files)}
            />

            {error && (
              <p className="mt-2 text-xs font-semibold text-error-600">{error}</p>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-[12px] border-2 border-[#3a7bd5] bg-[#f4f4f4] px-4 py-3 text-lg font-bold text-[#1f2d3d] shadow-[0_2px_0_rgba(58,123,213,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span aria-hidden="true">⎋</span>
              {isPending ? "Keluar..." : "Log out"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
