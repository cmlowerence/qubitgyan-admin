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
      <aside className={cn('flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800', className)}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-6 px-4 flex flex-col gap-2">
          {navLinks.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full shrink-0',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 mt-auto">
          {user && (
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-white" />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${user.is_superuser ? 'bg-amber-500' : 'bg-purple-600'}`}>
                    {user.first_name?.[0]?.toUpperCase()}
                    {user.last_name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-none">
                  {user.first_name} {user.last_name}
                </p>
                <p className={`text-[10px] font-medium truncate mt-1.5 flex items-center gap-1 ${user.is_superuser ? 'text-amber-600 dark:text-amber-500' : 'text-purple-600 dark:text-purple-400'}`}>
                  {user.is_superuser ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {user.is_superuser ? 'Super Admin' : 'Administrator'}
                </p>
              </div>
            </Link>
          )}

          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
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
