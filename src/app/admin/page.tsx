'use client';

import { useEffect, useMemo, useState } from 'react';
import { getDashboardStats, DashboardResponse } from '@/services/dashboard';
import { getQueueStatus } from '@/services/emails';
import { getStorageStatus } from '@/services/media';
import { getSystemHealth, HealthStatus } from '@/services/system';
import { useCurrentUser } from '@/context/current-user-context';
import { Users, FileText, FolderTree, Shield, Activity, Database, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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
      { icon: FolderTree, title: 'Knowledge Nodes', value: stats.counts.nodes, color: 'bg-blue-50 text-blue-700' },
      { icon: FileText, title: 'Resources', value: stats.counts.resources, color: 'bg-green-50 text-green-700' },
      { icon: Users, title: 'Students', value: stats.counts.students, color: 'bg-amber-50 text-amber-700' },
      { icon: Shield, title: 'Admins', value: stats.counts.admins, color: 'bg-purple-50 text-purple-700' },
    ];
  }, [stats]);

  if (loading) return <div className="p-6 text-center text-gray-500 animate-pulse">Loading admin analytics...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!stats) return <div className="p-6 text-slate-500">No dashboard data available.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Mission Control</h1>
        <p className="text-sm text-slate-500">Operational metrics, content visibility, and system governance at one place.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {statCards.map(({ icon: Icon, title, value, color }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-slate-500">{title}</span>
              <div className={`rounded-lg p-2 ${color}`}><Icon className="h-4 w-4 md:h-5 md:w-5" /></div>
            </div>
            <p className="mt-3 text-xl md:text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {user?.is_superuser && superPanel && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-indigo-700" />
            <h2 className="font-semibold text-indigo-900">Superadmin Governance Panel</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white border border-indigo-100 p-4">
              <p className="text-xs text-slate-500">System Health</p>
              <p className="font-semibold mt-1 text-slate-900">{superPanel.health?.status ?? 'unavailable'}</p>
              <p className="text-xs text-slate-500 mt-2">DB: {superPanel.health?.database ?? 'unknown'} • Cache: {superPanel.health?.cache ?? 'unknown'}</p>
            </div>
            <div className="rounded-xl bg-white border border-indigo-100 p-4">
              <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email Queue</p>
              <p className="font-semibold mt-1 text-slate-900">{superPanel.queuePending} pending</p>
              <p className="text-xs text-slate-500 mt-2">Total sent: {superPanel.queueSent}</p>
            </div>
            <div className="rounded-xl bg-white border border-indigo-100 p-4">
              <p className="text-xs text-slate-500 flex items-center gap-1"><Database className="h-3.5 w-3.5" /> Media Storage Usage</p>
              <p className="font-semibold mt-1 text-slate-900">{superPanel.storageUsed}% used</p>
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, superPanel.storageUsed)}%` }} />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <section className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-semibold mb-3 text-slate-700">Top Subjects by Resources</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.top_subjects}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="resource_count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-semibold mb-3 text-slate-700">Content Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.charts.distribution} dataKey="count" nameKey="resource_type" cx="50%" cy="50%" outerRadius={80} label>
                  {stats.charts.distribution.map((entry, index) => (
                    <Cell key={`${entry.resource_type}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
