// src/components/layout/header.tsx
'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { MobileNav } from './mobile-nav';
import { GlobalSearch } from './GlobalSearch';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-20 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <MobileNav />
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight hidden sm:block">God Mode</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 flex-1 justify-end ml-4">
        <div className="hidden sm:block flex-1 max-w-md">
          <GlobalSearch />
        </div>

        <button className="relative rounded-full p-2.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300">
          <Bell className="h-5 w-5 sm:h-5 sm:w-5" />
          <span className="absolute top-2 right-2 sm:top-1.5 sm:right-1.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-950"></span>
        </button>
        
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs sm:text-sm shrink-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          AD
        </div>
      </div>
    </header>
  );
}