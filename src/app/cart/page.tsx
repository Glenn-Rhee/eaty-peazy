import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatRupiah, products } from "@/components/lib/mock-data";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

export default function CartPage() {
  // TODO: ganti dengan data keranjang asli (state / cookie / database)
  const items = [
    { product: products[0], quantity: 2 },
    { product: products[2], quantity: 1 },
  ];
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-secondary">Keranjang Belanja</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Periksa pesanan Anda lalu lengkapi data pemesan.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Kolom kiri */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <Card key={product.id} className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs text-brand-700">
                  Foto
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <p className="mt-1 text-sm font-semibold text-brand-700">
                    {formatRupiah(product.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-7 w-7 rounded-md border border-border hover:bg-muted"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="h-7 w-7 rounded-md border border-border hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatRupiah(product.price * quantity)}
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-xs font-medium text-error-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Data pemesan (sesuai tabel Orders) */}
          <Card>
            <CardTitle className="text-base">Data Pemesan</CardTitle>
            <CardDescription className="mt-1">
              Isi data di bawah agar pesanan dapat diproses.
            </CardDescription>

            <form className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Nama</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal Pengambilan / Pengiriman
                </label>
                <input type="date" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Metode</label>
                <select className={inputClass} defaultValue="pickup">
                  <option value="pickup">Ambil di toko</option>
                  <option value="delivery">Diantar</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Alamat (jika diantar)
                </label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Catatan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan (opsional)"
                  className={inputClass}
                />
              </div>
            </form>
          </Card>
        </div>

        {/* Ringkasan */}
        <div>
          <Card className="sticky top-24">
            <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Jumlah item</dt>
                <dd>{items.reduce((s, i) => s + i.quantity, 0)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd className="text-brand-700">{formatRupiah(total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="mt-5 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Buat Pesanan
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
