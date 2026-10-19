"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menus = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/product", label: "Produk" },
  { href: "/dashboard/stock", label: "Stok" },
  { href: "/dashboard/order", label: "Pesanan" },
  { href: "/dashboard/history", label: "Riwayat" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-sidebar-border bg-sidebar md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-lg font-bold text-secondary">
          Nama<span className="text-primary">Toko</span>
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {menus.map((menu) => {
          const active =
            menu.href === "/dashboard"
              ? pathname === menu.href
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-brand-800"
                  : "text-neutral-600 hover:bg-muted",
              )}
            >
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden p-3 md:block">
        <Link
          href="/auth/login"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-error-600 hover:bg-error-50"
        >
          Keluar
        </Link>
      </div>
    </aside>
  );
}
