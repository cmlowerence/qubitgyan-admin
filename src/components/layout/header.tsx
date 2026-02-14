// src/components/layout/header.tsx
'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { MobileNav } from './mobile-nav';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <MobileNav />
        
        <h2 className="text-lg font-semibold text-foreground">God Mode</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar (Hidden on mobile) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
          CL
        </div>
      </div>
    </header>
  );
}
