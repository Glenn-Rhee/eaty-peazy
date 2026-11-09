"use client";

import {
  ShoppingCart,
  Package,
  FileText,
  CircleDollarSign,
  ChevronDown,
} from "lucide-react";
import { formatRupiah } from "@/components/lib/mock-data";
import type { Account } from "./account";
import type { DashboardStats } from "./stats";

const bestSellerBar = ["w-32 md:w-80", "w-24 md:w-64", "w-20 md:w-48"];

export function DashboardView({
  stats: data,
  account,
}: {
  stats: DashboardStats;
  account: Account | null;
}) {
  const stats = [
    {
      label: "total pesanan",
      value: String(data.totalOrders),
      icon: ShoppingCart,
    },
    { label: "produk terjual", value: String(data.itemsSold), icon: Package },
    {
      label: "pesanan aktif",
      value: String(data.activeOrders),
      icon: FileText,
    },
  ];

  const initial = (account?.username ?? "A").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 pb-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Welcome back
          </p>
          <h1 className="text-3xl font-black text-neutral-900">Dashboard</h1>
        </div>

        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-700 bg-neutral-200 shadow-sm">
          {account?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={account.imageUrl}
              alt={account.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-neutral-700">{initial}</span>
          )}
        </div>
      </div>

      {/* Total Pendapatan — full-width row */}
      <div className="rounded-lg border border-yellow-950 bg-white/10 p-4 md:p-5">
        <div className="flex items-start gap-3 md:gap-4">
          <CircleDollarSign
            className="size-8 shrink-0 text-yellow-950 md:size-10"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-base font-normal text-black md:text-2xl">
              total pendapatan
            </p>
            <p className="mt-1 text-2xl font-extrabold text-black md:mt-2 md:text-3xl">
              {formatRupiah(data.totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Total pesanan · Produk terjual · Pesanan aktif */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-yellow-950 bg-white/10 p-4 md:p-5"
          >
            <stat.icon
              className="size-7 shrink-0 text-yellow-950 md:size-10"
              strokeWidth={1.5}
            />
            <p className="mt-2 text-sm font-normal text-black md:text-xl">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-black md:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Produk Paling Laku */}
      <div className="rounded-lg border border-yellow-950 bg-white/10 p-4 md:p-5">
        <h2 className="mb-4 text-xl font-semibold text-black md:mb-5 md:text-2xl">
          produk paling laku
        </h2>
        <div className="space-y-5 md:space-y-6">
          {data.bestSellers.length === 0 && (
            <p className="text-base text-neutral-600">Belum ada penjualan.</p>
          )}
          {data.bestSellers.map((product, idx) => (
            <div key={product.name} className="flex items-center gap-2 md:gap-4">
              <p className="w-28 text-base font-normal text-black md:w-40 md:text-xl">
                {product.name}
              </p>
              <div className="relative flex flex-1 items-center gap-2 md:gap-4">
                <div className="flex flex-1 gap-1 md:gap-2">
                  <div
                    className={`h-3.5 rounded-[5px] md:h-5 ${
                      idx % 2 === 0 ? "bg-blue-900" : "bg-amber-500"
                    } ${bestSellerBar[idx] ?? "w-16"}`}
                  />
                  <div className="h-3.5 flex-1 rounded-[5px] bg-zinc-300 md:h-5" />
                </div>
                <p className="w-9 text-right text-base font-normal text-black md:w-18 md:text-xl">
                  {product.sold}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grafik Penjualan Produk */}
      <div className="rounded-lg border border-yellow-950 bg-white/10 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-black md:text-2xl">
            Grafik penjualan Produk
          </h2>
          <div className="self-start rounded-lg border border-blue-900 bg-amber-500 px-3 py-2 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] md:px-4 md:py-2.5">
            <span className="text-sm font-semibold text-blue-900 md:text-xl">
              {data.itemsSold} Terjual
            </span>
          </div>
        </div>

        {/* Dropdown Periode */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-[5px] border border-yellow-950 bg-brand-50 px-3 py-2 md:px-4 md:py-2.5">
          <span className="text-sm font-semibold text-blue-900 md:text-lg">
            Pendapatan Per-Periode Po
          </span>
          <div className="mx-2 h-8 w-px bg-yellow-950 md:mx-3 md:h-9" />
          <span className="text-lg font-semibold text-amber-500 md:text-2xl">
            Po 1
          </span>
          <ChevronDown className="ml-1 size-5 text-yellow-950 md:ml-2 md:size-6" />
        </div>

        {/* Chart Placeholder */}
        <div className="flex h-40 items-center justify-center rounded-lg bg-neutral-100 md:h-64">
          <p className="text-sm text-neutral-400 md:text-base">
            Grafik chart akan ditampilkan di sini
          </p>
        </div>
      </div>
    </div>
  );
}
