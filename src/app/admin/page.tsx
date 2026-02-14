'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, DashboardResponse } from '@/services/dashboard';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, FileText, FolderTree, Shield } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading QubitGyan Analytics...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-800">Mission Control</h1>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FolderTree />} title="Total Nodes" value={stats.counts.nodes} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<FileText />} title="Resources" value={stats.counts.resources} color="bg-green-50 text-green-600" />
        <StatCard icon={<Users />} title="Students" value={stats.counts.students} color="bg-amber-50 text-amber-600" />
        <StatCard icon={<Shield />} title="Admins" value={stats.counts.admins} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Top Subjects Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Top Subjects by Resources</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.top_subjects}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="resource_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Resource Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Content Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.charts.distribution} 
                  dataKey="count" 
                  nameKey="resource_type" 
                  cx="50%" cy="50%" 
                  outerRadius={80} 
                  label 
                >
                  {stats.charts.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick helper component for the top metrics
function StatCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number, color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}