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
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
      {/* Logo Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo className="scale-150 mb-8" />
      </motion.div>
      
      {/* Progress Bar Container */}
      <motion.div 
        className="h-1.5 w-48 bg-gray-100 rounded-full overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Animated Bar */}
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-amber-500 w-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
      
      {/* Text Animation */}
      <motion.p 
        className="mt-4 text-gray-400 text-sm font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>
    </div>
  );
}
