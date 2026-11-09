import { DashboardView } from "./dashboard-view";
import { getAccount } from "./account";
import { getDashboardStats } from "./stats";

export default async function DashboardPage() {
  const [stats, account] = await Promise.all([getDashboardStats(), getAccount()]);
  return <DashboardView stats={stats} account={account} />;
}
