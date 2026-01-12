import React from 'react';
import { AdminSidebar } from '@/components/layout/sidebar';
import { AdminHeader } from '@/components/layout/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar: We manually make it fixed here */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-40">
        <AdminSidebar className="h-full" />
      </div>

      {/* Main Content: Pushed by 64 (16rem/256px) on desktop */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
