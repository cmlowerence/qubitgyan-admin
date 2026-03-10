// src/components/layout/sidebar.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldCheck, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import { logoutAdmin } from '@/services/auth';
import { ConfirmModal } from '@/components/ui/dialogs';
import { useCurrentUser } from '@/context/current-user-context';
import { ADMIN_NAV_ITEMS, canAccessNavItem } from '@/lib/permissions';

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navLinks = useMemo(() => ADMIN_NAV_ITEMS.filter((item) => canAccessNavItem(user, item)), [user]);

  return (
    <>
      <aside className={cn('flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800', className)}>
        <div className="h-16 sm:h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 flex flex-col gap-1.5 sm:gap-2">
          {navLinks.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base font-bold transition-all w-full shrink-0 group focus:outline-none focus:ring-2 focus:ring-slate-400',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400')} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950 mt-auto">
          {user && (
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <div className="shrink-0 relative">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-sm border-2 border-white dark:border-slate-800 ${user.is_superuser ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                    {user.first_name?.[0]?.toUpperCase()}
                    {user.last_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {user.first_name} {user.last_name}
                </p>
                <p className={`text-[10px] sm:text-xs font-bold truncate mt-0.5 flex items-center gap-1 ${user.is_superuser ? 'text-amber-600 dark:text-amber-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {user.is_superuser ? <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  {user.is_superuser ? 'Super Admin' : 'Administrator'}
                </p>
              </div>
            </Link>
          )}

          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3 sm:py-3.5 text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          logoutAdmin();
          setIsLogoutOpen(false);
        }}
        title="Sign Out"
        message="Are you sure you want to log out of the admin panel?"
        confirmText="Logout"
        type="danger"
      />
    </>
  );
}