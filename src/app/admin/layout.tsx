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
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Content (Full width on mobile, pushed on desktop) */}
      <div className="md:ml-64 transition-all duration-300 ease-in-out">
        <AdminHeader />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
