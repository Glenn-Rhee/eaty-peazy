import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StockTable } from "./stock-table";
import { getStocks } from "./actions";

export default async function DashboardStockPage() {
  const stocks = await getStocks();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">Inventaris Stok</h1>
      </div>

      <StockTable stocks={stocks} />
    </div>
  );
}
