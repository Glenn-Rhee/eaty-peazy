import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatRupiah, products } from "@/components/lib/mock-data";

export default function DashboardProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Produk</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola daftar produk yang dijual di toko.
          </p>
        </div>
        {/* TODO: buka modal tambah produk */}
        <button
          type="button"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          + Tambah Produk
        </button>
      </div>

      <Card>
        <CardTitle className="text-base">Daftar Produk</CardTitle>
        <CardDescription className="mt-1">
          {products.length} produk terdaftar.
        </CardDescription>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">Nama</th>
                <th className="py-2 pr-4 font-medium">Harga</th>
                <th className="py-2 pr-4 font-medium">Deskripsi</th>
                <th className="py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4">{formatRupiah(product.price)}</td>
                  <td className="max-w-xs truncate py-3 pr-4 text-muted-foreground">
                    {product.description}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      className="mr-3 text-sm font-medium text-brand-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-error-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
