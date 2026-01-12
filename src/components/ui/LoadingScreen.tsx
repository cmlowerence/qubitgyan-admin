'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo variant="dark" className="scale-150" />
      </motion.div>
      
      <motion.div 
        className="mt-8 h-1 w-48 bg-slate-800 rounded-full overflow-hidden"
      >
        <motion.div 
          className="h-full bg-amber-500"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
      
      <p className="mt-4 text-slate-400 text-sm animate-pulse">Initializing Knowledge Tree...</p>
    </div>
  );
}