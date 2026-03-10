// src/components/ui/loading-screen.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Initializing System..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-[200] px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo className="scale-125 sm:scale-150 mb-8 sm:mb-10 drop-shadow-xl" />
      </motion.div>
      
      <motion.div 
        className="h-1.5 sm:h-2 w-48 sm:w-64 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 w-full rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
      
      <motion.p 
        className="mt-5 text-slate-500 dark:text-slate-400 text-sm sm:text-base font-bold tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>
    </div>
  );
}