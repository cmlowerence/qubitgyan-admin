'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './sidebar';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close the menu when the user navigates to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling on the body when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay & Sidebar Container */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay (Click to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            
            {/* Sliding Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-[280px] bg-background border-r border-border shadow-2xl flex flex-col"
            >
              {/* Close Button Area */}
              <div className="absolute right-4 top-4 z-50">
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground bg-accent/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* The Sidebar Component */}
              {/* className="h-full" ensures it fills the sliding panel */}
              <div className="h-full pt-2">
                 <AdminSidebar className="h-full w-full border-none shadow-none" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
