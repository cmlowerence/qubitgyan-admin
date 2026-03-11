// src/app/admin/progress/_components/DashboardHeader.tsx
import { BarChart3 } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div className="p-3 sm:p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl shrink-0 shadow-inner">
        <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white truncate tracking-tight">
          Student Progress
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium truncate">
          Real-time content completion tracking.
        </p>
      </div>
    </div>
  );
}