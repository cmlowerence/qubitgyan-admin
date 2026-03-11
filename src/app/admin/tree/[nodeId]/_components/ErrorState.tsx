// src/app/admin/tree/[nodeId]/_components/ErrorState.tsx
'use client';

import { AlertTriangle, ArrowLeft } from 'lucide-react';
import DebugConsole from '@/components/debug/DebugConsole';

interface ErrorStateProps {
  error: string | any;
  onBack: () => void;
}

export default function ErrorState({ error, onBack }: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message || "An unexpected error occurred.";

  return (
    <div className="p-4 sm:p-8 min-h-[70vh] flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-5 rounded-3xl mb-6 shadow-inner">
            <AlertTriangle className="w-12 h-12 text-rose-600 dark:text-rose-400" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Node Unavailable
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-md">
            {errorMessage}
          </p>
          
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black shadow-lg shadow-slate-900/20 dark:shadow-white/10 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-slate-900/30 dark:focus:ring-white/30"
          >
            <ArrowLeft className="w-5 h-5" /> Return to Tree
          </button>
        </div>
      </div>

      {typeof error !== 'string' && error && (
        <div className="w-full max-w-4xl mt-8">
           <DebugConsole error={error} />
        </div>
      )}
    </div>
  );
}