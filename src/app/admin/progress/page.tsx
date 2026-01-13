'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, BookOpen, User, BarChart3, Search } from 'lucide-react';
import { getAllStudentProgress, ProgressRecord } from '@/services/progress';
import LoadingScreen from '@/components/ui/loading-screen';

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-2xl">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Student Progress</h1>
            <p className="text-sm text-slate-500 font-medium">Real-time content completion tracking.</p>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search student or topic..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of activity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            No activity records found.
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {record.user_details.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{record.user_details.username}</span>
                </div>
                {record.is_completed ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    <CheckCircle2 className="w-3 h-3" /> COMPLETED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                    <Clock className="w-3 h-3" /> IN PROGRESS
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-slate-300 mt-0.5" />
                  <span className="text-sm font-medium text-slate-600 line-clamp-2 leading-snug">
                    {record.resource_details.title}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Last activity: {new Date(record.last_accessed).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
