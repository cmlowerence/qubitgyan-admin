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
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2.5 sm:p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}
