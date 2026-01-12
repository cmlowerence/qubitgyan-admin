'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, Users, Settings, LogOut, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Network, label: 'Knowledge Tree', href: '/admin/tree' },
  { icon: Database, label: 'Resources', href: '/admin/resources' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <Logo variant="dark" />
      </div>

      {/* Navigation Links - THE FIX IS HERE */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border shrink-0">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
