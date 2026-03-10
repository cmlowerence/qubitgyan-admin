// src/components/dashboard/StatsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none dark:hover:border-slate-700 transition-all duration-300 w-full group">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className={`p-3 sm:p-3.5 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mt-1 sm:mt-2 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}