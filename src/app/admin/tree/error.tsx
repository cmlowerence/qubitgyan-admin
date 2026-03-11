// src/app/admin/tree/error.tsx
'use client';

import { useEffect } from 'react';
import DebugConsole from '@/components/debug/DebugConsole';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; responseData?: any; status?: number; targetUrl?: string };
  reset: () => void;
}) {
  useEffect(() => {
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl mb-2">
              <AlertOctagon className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Exception</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">A critical error occurred while rendering the knowledge tree.</p>
          </div>
          
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            Recover Session
          </button>
        </div>

        <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
          <DebugConsole error={error} />
        </div>

      </div>
    </div>
  );
}