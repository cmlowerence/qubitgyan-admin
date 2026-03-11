// src/app/admin/settings/_components/SettingsHeader.tsx
import { Settings, SlidersHorizontal } from 'lucide-react';

export default function SettingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-200 dark:border-slate-800 pb-8">
      <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
        <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          System Preferences
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Customize the appearance, behavior, and diagnostics of your workspace.
        </p>
      </div>
    </div>
  );
}