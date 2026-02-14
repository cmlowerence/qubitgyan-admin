// src/app/admin/progress/_components/DashboardHeader.tsx
import { BarChart3 } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="p-2.5 sm:p-3 bg-green-50 rounded-2xl shrink-0">
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
      </div>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 truncate">Student Progress</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">Real-time content completion tracking.</p>
      </div>
    </div>
  );
}
