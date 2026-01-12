'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './sidebar';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            />
            
            {/* FIX: Changed h-full to h-[100dvh] 
               This forces it to take the full dynamic height of the mobile screen.
            */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-[100] w-[280px] h-[100dvh] bg-white dark:bg-slate-950 shadow-2xl flex flex-col border-r border-slate-200"
            >
              <div className="absolute right-4 top-4 z-[101]">
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 h-full pt-2">
                 <AdminSidebar className="h-full w-full border-none shadow-none bg-transparent" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
