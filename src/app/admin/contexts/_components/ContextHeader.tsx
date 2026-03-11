// src/app/admin/contexts/_components/ContextHeader.tsx
import { Tag, RefreshCw } from 'lucide-react';

interface ContextHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ContextHeader({ isLoading, onRefresh }: ContextHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="p-3 sm:p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shrink-0 shadow-inner">
          <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Context Metadata</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Govern categorical tags used across resources and courses.</p>
        </div>
      </div>
      <button 
        onClick={onRefresh} 
        disabled={isLoading}
        className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 sm:px-5 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all disabled:opacity-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-500/20 active:scale-[0.98]"
        aria-label="Refresh contexts"
      >
        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-purple-500' : ''}`} />
        <span className="sm:hidden">Refresh Data</span>
      </button>
    </div>
  );
}