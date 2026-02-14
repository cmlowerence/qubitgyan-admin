// src/app/admin/layout.tsx
import { AdminSidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-[280px] flex-col fixed inset-y-0 z-50">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 md:pl-[280px] h-full flex flex-col relative">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-slate-950 shrink-0 sticky top-0 z-40">
            <span className="font-bold text-lg">Admin Panel</span>
            <MobileNav />
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {children}
          </div>
          
        </main>
      </div>
    </AuthGuard>
  );
}
