'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Network, 
  Users, 
  Settings, 
  LogOut, 
  Database,
  Tag // Imported for Contexts
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import { logoutAdmin } from '@/services/auth'; 

// Added 'Contexts' to the menu items
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Network, label: 'Knowledge Tree', href: '/admin/tree' },
  { icon: Tag, label: 'Contexts', href: '/admin/contexts' }, // NEW
  { icon: Database, label: 'Resources', href: '/admin/resources' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutAdmin();
    }
  };

  return (
    <aside className={cn("flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200", className)}>
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
        <Logo variant="dark" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto min-h-0 py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full shrink-0",
                isActive 
                  ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" 
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
      <div className="p-4 border-t border-slate-200 shrink-0 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}