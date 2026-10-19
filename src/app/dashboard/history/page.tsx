import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatRupiah,
  orders,
  orderStatusClass,
  orderStatusLabel,
} from "@/components/lib/mock-data";

export default function DashboardHistoryPage() {
  // Pesanan yang sudah selesai atau dibatalkan
  const historyOrders = orders.filter(
    (order) => order.status === "completed" || order.status === "canceled",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Riwayat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Arsip pesanan yang sudah selesai atau dibatalkan.
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Riwayat Pesanan</CardTitle>
        <CardDescription className="mt-1">
          {historyOrders.length} pesanan tercatat.
        </CardDescription>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Pelanggan</th>
                <th className="py-2 pr-4 font-medium">Tanggal</th>
                <th className="py-2 pr-4 font-medium">Metode</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historyOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4 font-medium">{order.id}</td>
                  <td className="py-3 pr-4">{order.customerName}</td>
                  <td className="py-3 pr-4">
                    {formatDate(order.requestedDate)}
                  </td>
                  <td className="py-3 pr-4">
                    {order.deliveryMethod === "delivery" ? "Diantar" : "Ambil"}
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
