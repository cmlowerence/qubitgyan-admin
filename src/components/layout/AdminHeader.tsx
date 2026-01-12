'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">God Mode</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar (Visual only for now) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs">
          CL
        </div>
      </div>
    </header>
  );
}
