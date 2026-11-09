"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/components/lib/mock-data";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { createOrder } from "./actions";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

export default function CartPage() {
  const items = useCart((state) => state.items);
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);
  const clear = useCart((state) => state.clear);

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const total = cartTotal(items);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createOrder({
        customerName: String(formData.get("customerName") ?? ""),
        phoneNumber: String(formData.get("phoneNumber") ?? ""),
        requestedDate: String(formData.get("requestedDate") ?? ""),
        deliveryMethod,
        address: String(formData.get("address") ?? ""),
        note: String(formData.get("note") ?? ""),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      if ("orderId" in result) {
        clear();
        setOrderId(result.orderId);
      } else {
        setError(result.error);
      }
    });
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-secondary">Pesanan dibuat</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pesanan <span className="font-mono">{orderId.slice(0, 8)}</span> sudah
          masuk dan menunggu konfirmasi toko.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-primary-hover"
        >
          Belanja lagi
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-secondary">Keranjang Belanja</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Periksa pesanan Anda lalu lengkapi data pemesan.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4">
            {items.length === 0 && (
              <Card className="text-center">
                <CardTitle className="text-base">Keranjang kosong</CardTitle>
                <CardDescription className="mt-1">
                  Belum ada produk yang dipilih.
                </CardDescription>
                <Link
                  href="/shop"
                  className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-primary-hover"
                >
                  Lihat produk
                </Link>
              </Card>
            )}

            {items.map((item) => (
              <Card key={item.productId} className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs text-brand-700">
                  Foto
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <p className="mt-1 text-sm font-semibold text-brand-700">
                    {formatRupiah(item.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-7 w-7 rounded-md border border-border hover:bg-muted"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      className="h-7 w-7 rounded-md border border-border hover:bg-muted"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="mt-2 text-xs font-medium text-error-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <CardTitle className="text-base">Data Pemesan</CardTitle>
            <CardDescription className="mt-1">
              Isi data di bawah agar pesanan dapat diproses.
            </CardDescription>

            <form
              id="checkout-form"
              action={handleSubmit}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="customerName">
                  Nama
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  placeholder="Nama lengkap"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="phoneNumber">
                  No. Telepon
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="requestedDate">
                  Tanggal Pengambilan / Pengiriman
                </label>
                <input
                  id="requestedDate"
                  name="requestedDate"
                  type="date"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="deliveryMethod">
                  Metode
                </label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  value={deliveryMethod}
                  onChange={(e) =>
                    setDeliveryMethod(e.target.value as "pickup" | "delivery")
                  }
                  className={inputClass}
                >
                  <option value="pickup">Ambil di toko</option>
                  <option value="delivery">Diantar</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium" htmlFor="address">
                  Alamat {deliveryMethod === "delivery" ? "" : "(jika diantar)"}
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  placeholder="Alamat lengkap"
                  required={deliveryMethod === "delivery"}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium" htmlFor="note">
                  Catatan
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  placeholder="Catatan tambahan (opsional)"
                  className={inputClass}
                />
              </div>

              <p className="text-sm font-medium text-error-600 sm:col-span-2" role="alert">
                {error}
              </p>
            </form>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Jumlah item</dt>
                <dd>{cartCount(items)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd className="text-brand-700">{formatRupiah(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              form="checkout-form"
              disabled={items.length === 0 || isPending}
              className="mt-5 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Memproses..." : "Buat Pesanan"}
            </button>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm font-medium text-brand-700 hover:underline"
            >
              Lanjut belanja
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
