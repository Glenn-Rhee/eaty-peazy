import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { StoreStatusToggle } from "@/components/layout/store-status-toggle";
import { getAccount } from "./account";
import Image from"next/image"
import Link from"next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getAccount();

  return (
    <div className="min-h-screen bg-[#f4f1e7]">
      <header className="border-b border-[#d7d0c0] bg-[#f1ebdf]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/">
          <Image src= "/logo.png" alt="profile" width={120} height={120}/ > 
        
        </Link>
          <StoreStatusToggle />
        </div>
      </header>

      <div className="md:flex">
        <DashboardSidebar account={account} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
