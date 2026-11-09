import { OrderList } from "./order-list";
import { getOrders } from "./actions";

export default async function DashboardOrderPage() {
  const orders = await getOrders();

  return <OrderList orders={orders} />;
}
