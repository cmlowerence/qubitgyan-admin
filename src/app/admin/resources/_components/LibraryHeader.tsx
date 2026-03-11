import { LibraryBig } from 'lucide-react';

interface LibraryHeaderProps {
  totalCount: number;
}

export default function LibraryHeader({ totalCount }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <LibraryBig className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          Global Library
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          Search and manage your entire content database from one command center.
        </p>
      </div>
      
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-auto justify-between md:justify-start">
        <div className="flex flex-col md:text-right">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none">{totalCount}</span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Visible Files
          </span>
        </div>
      </div>
    </div>
  );
}