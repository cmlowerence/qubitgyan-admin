// src/app/admin/settings/_components/DiagnosticsSection.tsx
import { ShieldAlert } from 'lucide-react';

interface DiagnosticsSectionProps {
  onTestAlert: () => void;
}

export default function DiagnosticsSection({ onTestAlert }: DiagnosticsSectionProps) {
  return (
    <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" /> Diagnostics
      </h2>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">Alert System Test</h4>
          <p className="text-sm text-slate-500">Verify that popups and modals are working correctly.</p>
        </div>
        <button 
          onClick={onTestAlert}
          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
        >
          Test Alert
        </button>
      </div>
      
      <div className="flex justify-center pt-8">
         <p className="text-xs font-mono text-slate-400">Admin Panel v0.1.0 • Build 2026.01.14</p>
      </div>
    </section>
  );
}
