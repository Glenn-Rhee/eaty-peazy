import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatRupiah,
  orders,
  orderStatusClass,
  orderStatusLabel,
} from "@/components/lib/mock-data";

export default function DashboardOrderPage() {
  // Pesanan yang masih berjalan
  const activeOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "process",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Pesanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pesanan yang menunggu atau sedang diproses.
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Pesanan Aktif</CardTitle>
        <CardDescription className="mt-1">
          {activeOrders.length} pesanan perlu ditindaklanjuti.
        </CardDescription>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Pelanggan</th>
                <th className="py-2 pr-4 font-medium">Telepon</th>
                <th className="py-2 pr-4 font-medium">Tanggal</th>
                <th className="py-2 pr-4 font-medium">Metode</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4 font-medium">{order.id}</td>
                  <td className="py-3 pr-4">{order.customerName}</td>
                  <td className="py-3 pr-4">{order.phoneNumber}</td>
                  <td className="py-3 pr-4">
                    {formatDate(order.requestedDate)}
                  </td>
                  <td className="py-3 pr-4 capitalize">
                    {order.deliveryMethod === "delivery" ? "Diantar" : "Ambil"}
                  </td>
                  <td className="py-3 pr-4">
                    {formatRupiah(order.totalAmount)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderStatusClass[order.status]}`}
                    >
                      {orderStatusLabel[order.status]}
                    </span>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    {/* TODO: sambungkan ke aksi ubah status */}
                    <button
                      type="button"
                      className="mr-3 text-sm font-medium text-brand-700 hover:underline"
                    >
                      {order.status === "pending" ? "Proses" : "Selesaikan"}
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-error-600 hover:underline"
                    >
                      Batalkan
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
