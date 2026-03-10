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
      <div className="flex h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 w-full">
        <div className="hidden lg:flex w-[280px] flex-col fixed inset-y-0 z-50 transition-all duration-300">
          <AdminSidebar />
        </div>

        <main className="flex-1 lg:pl-[280px] h-full flex flex-col relative w-full overflow-hidden">
          
          <div className="lg:hidden flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0 sticky top-0 z-40 w-full shadow-sm">
            <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">QubitGyan Admin</span>
            <MobileNav />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 lg:p-10 relative w-full">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </div>
          
        </main>
      </div>
    </AuthGuard>
  );
}