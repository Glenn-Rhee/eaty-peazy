import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatRupiah,
  orders,
  orderStatusClass,
  orderStatusLabel,
  products,
} from "@/components/lib/mock-data";

export default function DashboardPage() {
  // TODO: ganti dengan agregasi Prisma
  const stats = [
    { label: "Total Produk", value: products.length.toString() },
    {
      label: "Stok Menipis",
      value: products.filter((p) => p.stock < 10).length.toString(),
    },
    {
      label: "Pesanan Aktif",
      value: orders
        .filter((o) => o.status === "pending" || o.status === "process")
        .length.toString(),
    },
    {
      label: "Pendapatan",
      value: formatRupiah(
        orders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + o.totalAmount, 0),
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Ringkasan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gambaran singkat aktivitas toko Anda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardDescription>{stat.label}</CardDescription>
            <p className="mt-2 text-2xl font-bold text-secondary">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle className="text-base">Pesanan Terbaru</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Pelanggan</th>
                <th className="py-2 pr-4 font-medium">Tanggal</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4 font-medium">{order.id}</td>
                  <td className="py-3 pr-4">{order.customerName}</td>
                  <td className="py-3 pr-4">
                    {formatDate(order.requestedDate)}
                  </td>
                  <td className="py-3 pr-4">
                    {formatRupiah(order.totalAmount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderStatusClass[order.status]}`}
                    >
                      {orderStatusLabel[order.status]}
                    </span>
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
