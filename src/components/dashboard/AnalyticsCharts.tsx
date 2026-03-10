// src/components/dashboard/AnalyticsCharts.tsx
'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface AnalyticsProps {
  distribution: { resource_type: string; count: number }[];
  topSubjects: { name: string; resource_count: number }[];
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export function AnalyticsCharts({ distribution, topSubjects }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 w-full">
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[350px]">
        <h3 className="font-black text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 tracking-tight text-base sm:text-lg">Content Distribution</h3>
        <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="resource_type"
                stroke="none"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                itemStyle={{ color: '#1e293b' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[350px]">
        <h3 className="font-black text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 tracking-tight text-base sm:text-lg">Top Subjects by Content</h3>
        <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSubjects} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="resource_count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}