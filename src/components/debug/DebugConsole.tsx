// src/components/debug/DebugConsole.tsx
'use client';

import React from 'react';

interface DebugConsoleProps {
  error: any;
}

export default function DebugConsole({ error }: DebugConsoleProps) {
  if (!error) return null;

  return (
    <div className="mt-8 p-4 sm:p-5 bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm rounded-xl overflow-hidden break-all border border-rose-900/50 shadow-2xl shadow-rose-900/20 w-full animate-in slide-in-from-bottom-4 fade-in">
      <h3 className="text-white font-black mb-3 border-b border-slate-800 pb-2 flex justify-between items-center tracking-wider">
        <span className="flex items-center gap-2">🐞 DEBUG CONSOLE</span>
        <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] sm:text-xs animate-pulse">ERROR DETECTED</span>
      </h3>
      
      <div className="space-y-2.5">
        <p className="flex flex-col sm:flex-row sm:gap-2">
          <strong className="text-amber-400 shrink-0">Target URL:</strong> 
          <span className="text-slate-300">{error.targetUrl || "Undefined"}</span>
        </p>
        <p className="flex flex-col sm:flex-row sm:gap-2">
          <strong className="text-amber-400 shrink-0">Error Name:</strong> 
          <span className="text-slate-300">{error.name}</span>
        </p>
        <p className="flex flex-col sm:flex-row sm:gap-2">
          <strong className="text-amber-400 shrink-0">Message:</strong> 
          <span className="text-rose-400 font-bold">{error.message}</span>
        </p>
        
        {error.status && (
          <div className="mt-2 bg-rose-950/40 border border-rose-900/50 p-2 rounded-lg inline-block">
            <strong className="text-amber-400">HTTP Status:</strong> <span className="text-white font-bold">{error.status} {error.statusText}</span>
          </div>
        )}

        {error.responseData && (
          <div className="mt-3 pt-3 border-t border-slate-800 opacity-90">
            <strong className="text-amber-400 block mb-2 uppercase tracking-widest text-[10px] sm:text-xs">Server Response Body:</strong>
            <pre className="whitespace-pre-wrap bg-slate-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs max-h-48 sm:max-h-64 overflow-auto custom-scrollbar border border-slate-800 text-slate-300 leading-relaxed">
              {JSON.stringify(error.responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}