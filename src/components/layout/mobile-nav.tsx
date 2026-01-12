'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'; // Import this to auto-close
import { AdminSidebar } from './sidebar';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close menu when route changes (user clicks a link)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay & Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sliding Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-3/4 max-w-xs bg-background shadow-xl border-r border-border"
            >
              <div className="relative h-full flex flex-col">
                {/* Close Button - positioned absolutely to the right of the header */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-50 p-2 text-muted-foreground hover:text-foreground bg-background/50 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
                
                {/* Render Sidebar - It will fill the container */}
                <AdminSidebar className="h-full border-none" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
