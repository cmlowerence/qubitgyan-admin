'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllStudentActivity, AdminProgressRecord } from '@/services/student-activity';
import { Activity, Search, CheckCircle, Clock, PlayCircle, FileText, Link as LinkIcon, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import DebugConsole from '@/components/debug/DebugConsole';

export default function StudentActivityPage() {
  const router = useRouter();
  const [records, setRecords] = useState<AdminProgressRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AdminProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecords(records);
    } else {
      const lowerQuery = searchTerm.toLowerCase();
      const filtered = records.filter(record => 
        record.user_details.name?.toLowerCase().includes(lowerQuery) ||
        record.user_details.username?.toLowerCase().includes(lowerQuery) ||
        record.resource_details.title?.toLowerCase().includes(lowerQuery)
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStudentActivity();
      setRecords(data);
      setFilteredRecords(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    
    const headers = ['Student Name', 'Username', 'Resource Title', 'Resource Type', 'Status', 'Last Accessed Date', 'Last Accessed Time'];
    
    const rows = filteredRecords.map(record => {
      const date = new Date(record.last_accessed);
      return [
        `"${record.user_details.name || ''}"`,
        `"${record.user_details.username || ''}"`,
        `"${record.resource_details.title || ''}"`,
        `"${record.resource_details.resource_type || ''}"`,
        `"${record.is_completed ? 'Completed' : 'In Progress'}"`,
        `"${date.toLocaleDateString()}"`,
        `"${date.toLocaleTimeString()}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_activity_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 dark:text-rose-400" />;
      case 'PDF': return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />;
      case 'DOCUMENT': return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400" />;
      default: return <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 dark:text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <Activity className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-500" />
        <p className="animate-pulse font-bold tracking-widest uppercase text-xs sm:text-sm">Fetching Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> System Exception
          </h1>
          <button 
            onClick={loadProgress}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={error} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Student Activity</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Monitor course completion and resource engagement.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search student or resource..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            disabled={filteredRecords.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/20" 
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
            <span className="sm:hidden lg:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
              <Search className="w-10 h-10 mb-3 opacity-20" />
              <p className="font-bold">No activity records found.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex flex-col gap-4">
                  
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex gap-3.5 items-center cursor-pointer group flex-1 min-w-0"
                      onClick={() => router.push(`/admin/users/${record.user_details.user_id}`)}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0 text-sm overflow-hidden shadow-sm border-2 border-white dark:border-slate-800 group-hover:scale-105 transition-transform">
                        {record.user_details.avatar ? (
                          <img src={record.user_details.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          record.user_details.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{record.user_details.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate mt-0.5">{record.user_details.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                        {getResourceTypeIcon(record.resource_details.resource_type)}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{record.resource_details.title}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{record.resource_details.resource_type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      {record.is_completed ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800/50">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{new Date(record.last_accessed).toLocaleDateString()}</p>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">{new Date(record.last_accessed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap w-[30%]">Student Identity</th>
                <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap w-[40%]">Resource Accessed</th>
                <th className="p-5 text-center text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="p-5 text-right text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-slate-400 dark:text-slate-500 font-bold">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-10 h-10 mb-3 opacity-20" />
                      <p>No activity records match your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    
                    <td className="p-5">
                      <div className="flex items-center gap-4 cursor-pointer"
                        onClick={() => router.push(`/admin/users/${record.user_details.user_id}`)}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0 text-sm overflow-hidden shadow-sm border-2 border-white dark:border-slate-800 group-hover:scale-105 transition-transform">
                          {record.user_details.avatar ? (
                            <img src={record.user_details.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            record.user_details.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 dark:text-white text-sm sm:text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{record.user_details.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate mt-0.5">{record.user_details.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-3.5">
                        <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors">
                          {getResourceTypeIcon(record.resource_details.resource_type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{record.resource_details.title}</p>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{record.resource_details.resource_type}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      {record.is_completed ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800/50">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {new Date(record.last_accessed).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">
                        {new Date(record.last_accessed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}