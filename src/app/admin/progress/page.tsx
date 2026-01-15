'use client';

import { useEffect, useState } from 'react';
import { getAllStudentProgress, ProgressRecord } from '@/services/progress';
import LoadingScreen from '@/components/ui/loading-screen';
import DashboardHeader from './_components/DashboardHeader';
import SearchInput from './_components/SearchInput';
import ProgressList from './_components/ProgressList';

export default function ProgressDashboard() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await getAllStudentProgress();
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.user_details.username.toLowerCase().includes(filter.toLowerCase()) ||
    r.resource_details.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <LoadingScreen message="Analyzing Student Data..." />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <DashboardHeader />
        <SearchInput value={filter} onChange={setFilter} />
      </div>

      <ProgressList records={filteredRecords} />
    </div>
  );
}
