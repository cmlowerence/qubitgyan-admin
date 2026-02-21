// src/app/admin/student-activity/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllStudentActivity, AdminProgressRecord } from '@/services/student-activity';

import { Activity, Search, CheckCircle, Clock, PlayCircle, FileText, Link as LinkIcon, Download } from 'lucide-react';

export default function StudentActivityPage() {
  const router = useRouter();
  const [records, setRecords] = useState<AdminProgressRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AdminProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  // Filter records whenever the search term changes
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
      const data = await getAllStudentActivity();
      setRecords(data);
      setFilteredRecords(data);
    } catch (err: any) {
      console.error("Failed to load activity data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    
    // Create CSV headers
    const headers = ['Student Name', 'Username', 'Resource Title', 'Resource Type', 'Status', 'Last Accessed Date', 'Last Accessed Time'];
    
    // Map data to CSV rows
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

    // Combine and download
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
      case 'VIDEO': return <PlayCircle className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'PDF': return <FileText className="w-4 h-4 text-red-500 shrink-0" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-gray-500 shrink-0" />;
      case 'LINK': return <LinkIcon className="w-4 h-4 text-indigo-500 shrink-0" />;
      default: return <Activity className="w-4 h-4 text-gray-500 shrink-0" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px] text-gray-500 animate-pulse space-y-4">
        <Activity className="w-8 h-8 text-indigo-300 animate-spin" />
        <p>Fetching Student Analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg shrink-0">
            <Activity className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Activity</h1>
            <p className="text-gray-500 text-sm">Monitor course completion and resource engagement.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search student or resource..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            disabled={filteredRecords.length === 0}
            className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Data (mobile + desktop) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No activity records found.</div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3 min-w-0">
                    
                    <div 
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => router.push(`/admin/users/${record.user_details.user_id}`)}
                    >
                      <div 
                        className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0 text-sm cursor-pointer overflow-hidden"              
                      >
                        {record.user_details.avatar ? (
                          <img src={record.user_details.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          record.user_details.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{record.user_details.name}</p>
                        <p className="text-xs text-gray-500 truncate">{record.user_details.username}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2">
                      <div className="mt-0.5">
                        {getResourceTypeIcon(record.resource_details.resource_type)}
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">{record.resource_details.title}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {record.is_completed ? (
                      <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-100">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-bold border border-amber-100">
                        <Clock className="w-3 h-3" /> In Progress
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{new Date(record.last_accessed).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table (hidden on small screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                <th className="p-4">Student</th>
                <th className="p-4">Resource</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Last Accessed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No activity records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Student Info */}
                    <td className="p-4 max-w-[200px]">
                      <div className="flex items-center gap-3 cursor-pointer"
                        onClick={() => router.push(`/admin/users/${record.user_details.user_id}`)}
                      >
                        <div 
                          className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0 text-xs overflow-hidden cursor-pointer"
                        >
                          {record.user_details.avatar ? (
                            <img src={record.user_details.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            record.user_details.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{record.user_details.name}</p>
                          <p className="text-xs text-gray-500 truncate">{record.user_details.username}</p>
                        </div>
                      </div>
                    </td>

                    {/* Resource Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getResourceTypeIcon(record.resource_details.resource_type)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{record.resource_details.title}</p>
                          <p className="text-xs text-gray-400">{record.resource_details.resource_type}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      {record.is_completed ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100 shadow-sm">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100 shadow-sm">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </td>

                    {/* Last Accessed Date */}
                    <td className="p-4 text-right">
                      <p className="text-sm text-gray-600 font-medium">
                        {new Date(record.last_accessed).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
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