// src/app/admin/student-activity/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllStudentActivity, AdminProgressRecord } from '@/services/student-activity';
import { Activity, Search, CheckCircle, Clock, PlayCircle, FileText, Link as LinkIcon, Download } from 'lucide-react';

export default function StudentActivityPage() {
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
        record.user_details.username.toLowerCase().includes(lowerQuery) ||
        record.user_details.email.toLowerCase().includes(lowerQuery) ||
        record.resource_details.title.toLowerCase().includes(lowerQuery)
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

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'PDF': return <FileText className="w-4 h-4 text-red-500" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'LINK': return <LinkIcon className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Fetching Student Analytics...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
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
          <button className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-colors shadow-sm" title="Export CSV">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Student Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 text-xs">
                          {record.user_details.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{record.user_details.username}</p>
                          <p className="text-xs text-gray-500">{record.user_details.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Resource Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getResourceTypeIcon(record.resource_details.resource_type)}
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{record.resource_details.title}</p>
                          <p className="text-xs text-gray-400">{record.resource_details.resource_type}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      {record.is_completed ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </td>

                    {/* Last Accessed Date */}
                    <td className="p-4 text-right">
                      <p className="text-sm text-gray-600">
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