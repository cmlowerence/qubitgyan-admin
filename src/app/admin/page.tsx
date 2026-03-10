'use client';

import { useEffect, useMemo, useState } from 'react';
import { getDashboardStats, DashboardResponse } from '@/services/dashboard';
import { getQueueStatus } from '@/services/emails';
import { getStorageStatus } from '@/services/media';
import { getSystemHealth, HealthStatus } from '@/services/system';
import { useCurrentUser } from '@/context/current-user-context';
import { Users, FileText, FolderTree, Shield, Activity, Database, Mail, Loader2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

type SuperadminPanel = {
  health: HealthStatus | null;
  queuePending: number;
  queueSent: number;
  storageUsed: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [superPanel, setSuperPanel] = useState<SuperadminPanel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useCurrentUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const data = await getDashboardStats();
        setStats(data);

        if (user?.is_superuser) {
          const [health, queue, storage] = await Promise.allSettled([
            getSystemHealth(),
            getQueueStatus(),
            getStorageStatus(),
          ]);

          setSuperPanel({
            health: health.status === 'fulfilled' ? health.value : null,
            queuePending: queue.status === 'fulfilled' ? queue.value.pending_emails : 0,
            queueSent: queue.status === 'fulfilled' ? queue.value.total_sent : 0,
            storageUsed: storage.status === 'fulfilled' ? Math.round(storage.value.usage_percentage ?? storage.value.percentage_used ?? 0) : 0,
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.is_superuser]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { icon: FolderTree, title: 'Knowledge Nodes', value: stats.counts.nodes, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
      { icon: FileText, title: 'Resources', value: stats.counts.resources, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { icon: Users, title: 'Students', value: stats.counts.students, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
      { icon: Shield, title: 'Admins', value: stats.counts.admins, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm font-medium animate-pulse">Loading mission control...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-6 rounded-2xl flex flex-col items-center gap-3 border border-rose-100 dark:border-rose-900/50 max-w-md text-center">
          <AlertCircle className="w-10 h-10" />
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mission Control</h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Operational metrics, content visibility, and system governance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {statCards.map(({ icon: Icon, title, value, color, bg }) => (
          <div key={title} className="rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</span>
              <div className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3 transition-transform duration-300 group-hover:scale-110 ${bg}`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {user?.is_superuser && superPanel && (
        <section className="rounded-2xl sm:rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-indigo-950 dark:text-indigo-100 tracking-tight">Superadmin Governance Panel</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-900/30 p-5 hover:bg-white dark:hover:bg-slate-900 transition-colors">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">System Health</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${superPanel.health?.status === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <p className="font-black text-lg sm:text-xl text-slate-900 dark:text-white capitalize">{superPanel.health?.status ?? 'Unavailable'}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">DB: {superPanel.health?.database ?? 'unknown'}</span>
                <span className="text-[10px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">Cache: {superPanel.health?.cache ?? 'unknown'}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-900/30 p-5 hover:bg-white dark:hover:bg-slate-900 transition-colors">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> Email Queue
              </p>
              <p className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">{superPanel.queuePending} pending</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">Total messages dispatched: <span className="text-slate-700 dark:text-slate-300 font-bold">{superPanel.queueSent}</span></p>
            </div>

            <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-900/30 p-5 hover:bg-white dark:hover:bg-slate-900 transition-colors sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Database className="h-4 w-4" /> Storage Usage
              </p>
              <div className="flex items-end justify-between mb-2">
                <p className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">{superPanel.storageUsed}%</p>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Capacity</p>
              </div>
              <div className="h-2.5 sm:h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${superPanel.storageUsed > 80 ? 'bg-rose-500' : superPanel.storageUsed > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${Math.min(100, superPanel.storageUsed)}%` }} 
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <section className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[400px]">
          <h2 className="text-base sm:text-lg font-black mb-6 text-slate-800 dark:text-slate-100 tracking-tight">Top Subjects by Resources</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.top_subjects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="resource_count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[400px]">
          <h2 className="text-base sm:text-lg font-black mb-6 text-slate-800 dark:text-slate-100 tracking-tight">Content Distribution</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.charts.distribution} 
                  dataKey="count" 
                  nameKey="resource_type" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={100} 
                  paddingAngle={4}
                  stroke="none"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.charts.distribution.map((entry, index) => (
                    <Cell key={`${entry.resource_type}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}