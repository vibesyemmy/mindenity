import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopBar } from "@/components/admin-topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopBar />
        <main className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
