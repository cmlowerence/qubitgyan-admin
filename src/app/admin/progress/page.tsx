// src/app/admin/progress/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllStudentProgress, ProgressRecord } from '@/services/progress';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import LoadingScreen from '@/components/ui/loading-screen';
import DebugConsole from '@/components/debug/DebugConsole';
import DashboardHeader from './_components/DashboardHeader';
import SearchInput from './_components/SearchInput';
import ProgressList from './_components/ProgressList';

export default function ProgressDashboard() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStudentProgress();
      setRecords(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.user_details.username.toLowerCase().includes(filter.toLowerCase()) ||
    r.resource_details.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <LoadingScreen message="Analyzing Student Data..." />;

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3 tracking-tight">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Sync Exception
          </h1>
          <button 
            onClick={loadProgress}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Fetch
          </button>
        </div>
        <DebugConsole error={error} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <DashboardHeader />
        <SearchInput value={filter} onChange={setFilter} />
      </div>

      <ProgressList records={filteredRecords} />
    </div>
  );
}