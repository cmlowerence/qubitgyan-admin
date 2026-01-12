'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from './sidebar';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-muted-foreground hover:bg-muted rounded-md"
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Sliding Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-card shadow-xl"
            >
              <div className="relative h-full">
                {/* Close Button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-50 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
                
                {/* Reuse the existing Sidebar component */}
                <AdminSidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
