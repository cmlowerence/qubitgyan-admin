// src/app/admin/settings/_components/DiagnosticsSection.tsx
import { ShieldAlert, Server } from 'lucide-react';

interface DiagnosticsSectionProps {
  onTestAlert: () => void;
}

export default function DiagnosticsSection({ onTestAlert }: DiagnosticsSectionProps) {
  return (
    <section className="space-y-5 sm:space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Diagnostics & System
        </h2>
      </div>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="text-center sm:text-left flex-1">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Server className="w-5 h-5 text-slate-400" /> Alert Subsystem Test
          </h4>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Verify that system modals, toast notifications, and popups are rendering accurately above the UI layer.
          </p>
        </div>
        <button 
          onClick={onTestAlert}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:shadow-xl active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-slate-900/30 dark:focus:ring-white/30 shrink-0"
        >
          Initiate Diagnostic
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center pt-10 pb-4 opacity-60 hover:opacity-100 transition-opacity">
         <div className="h-1 w-12 bg-slate-200 dark:bg-slate-800 rounded-full mb-4" />
         <p className="text-xs font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">QubitGyan Admin • v1.0.0</p>
         <p className="text-[10px] font-medium font-mono text-slate-400/80 dark:text-slate-600 mt-1">Build 2026.03.11</p>
      </div>
    </section>
  );
}