'use client';

import React, { useEffect, useState } from 'react';
import { Users, FileStack, FolderTree, RefreshCw, Loader2, Shield, GraduationCap } from 'lucide-react';
import { api } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

// Updated Interface to match new Backend Response
interface DashboardData {
  counts: {
    nodes: number;
    admins: number;    // Split count
    students: number;  // Split count
    resources: number;
  };
  charts: {
    distribution: { resource_type: string; count: number }[];
    top_subjects: { name: string; resource_count: number }[];
  };
  recent_activity: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats/');
      setData(res.data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Loading Command Center...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back. Here is the latest system data.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* 1. Key Metrics Cards (Updated to 4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard 
          title="Active Students" 
          value={data.counts.students} 
          icon={GraduationCap} 
          color="bg-blue-500" 
          trend="Learners"
        />
        <StatsCard 
          title="Administrators" 
          value={data.counts.admins} 
          icon={Shield} 
          color="bg-purple-500" 
          trend="Staff"
        />
        <StatsCard 
          title="Learning Nodes" 
          value={data.counts.nodes} 
          icon={FolderTree} 
          color="bg-amber-500" 
        />
        <StatsCard 
          title="Total Resources" 
          value={data.counts.resources} 
          icon={FileStack} 
          color="bg-emerald-500" 
          trend="Files"
        />
      </div>

      {/* 2. Charts & Graphs */}
      <AnalyticsCharts 
        distribution={data.charts.distribution} 
        topSubjects={data.charts.top_subjects} 
      />

      {/* 3. Recent Activity Feed */}
      <ActivityFeed activity={data.recent_activity} />
      
    </div>
  );
}
