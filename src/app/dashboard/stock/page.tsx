import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { products } from "@/components/lib/mock-data";

function stockBadge(stock: number) {
  if (stock === 0)
    return { label: "Habis", className: "bg-error-100 text-error-800" };
  if (stock < 10)
    return { label: "Menipis", className: "bg-warning-100 text-warning-800" };
  return { label: "Aman", className: "bg-success-100 text-success-800" };
}

export default function DashboardStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Stok</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pantau dan perbarui jumlah stok setiap produk.
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Stok Produk</CardTitle>
        <CardDescription className="mt-1">
          Stok di bawah 10 ditandai menipis.
        </CardDescription>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">Produk</th>
                <th className="py-2 pr-4 font-medium">Jumlah</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const badge = stockBadge(product.stock);
                return (
                  <tr key={product.id}>
                    <td className="py-3 pr-4 font-medium">{product.name}</td>
                    <td className="py-3 pr-4">{product.stock}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {/* TODO: buka modal ubah stok */}
                      <button
                        type="button"
                        className="text-sm font-medium text-brand-700 hover:underline"
                      >
                        Ubah Stok
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
