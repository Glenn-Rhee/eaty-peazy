import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 md:flex">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
