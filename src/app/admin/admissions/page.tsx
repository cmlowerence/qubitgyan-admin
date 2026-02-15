// src/app/admin/admissions/page.tsx  
'use client';

import { useEffect, useState } from 'react';
import { getAdmissions, processAdmission, AdmissionRequest } from '@/services/admissions';
import { CheckCircle, XCircle, Clock, Search, Mail, Phone } from 'lucide-react';

export default function AdmissionsDeskPage() {
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      const data = await getAdmissions();
      setAdmissions(data);
    } catch (error) {
      // console.error("Failed to load admissions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    const actionText = status === 'APPROVED' ? 'Approve' : 'Reject';
    const remarks = window.prompt(`Optional: Enter remarks for this ${actionText.toLowerCase()} action.`);
    
    if (remarks === null) return; // User cancelled the prompt

    setProcessingId(id);
    try {
      await processAdmission(id, { 
        status, 
        review_remarks: remarks || undefined 
      });
      // Refresh the list after successful processing
      loadAdmissions();
    } catch (error: any) {
      alert(`Failed to ${actionText}: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-semibold"><Clock className="w-3 h-3"/> Pending</span>;
      case 'APPROVED':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'REJECTED':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold"><XCircle className="w-3 h-3"/> Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Admissions Queue...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admissions Desk</h1>
          <p className="text-gray-500 text-sm">Review and manage student applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile cards (visible on small screens) */}
        <div className="md:hidden divide-y divide-gray-100">
          {admissions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No applications found.</div>
          ) : (
            admissions.map((req) => (
              <div key={req.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <p className="font-semibold text-gray-800">{req.student_name}</p>
                    <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{req.learning_goal || '-'}</p>
                    <p className="text-xs text-gray-400 mt-1">Grade: {req.class_grade || '-'}</p>
                  </div>
                  <div className="ml-2">{getStatusBadge(req.status)}</div>
                </div>

                <div className="flex items-center justify-between mt-3 gap-4">
                  <div className="text-sm text-gray-600 flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400"/> {req.email}</div>
                  <div className="flex gap-2">
                    {req.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleProcess(req.id, 'APPROVED')} disabled={processingId === req.id} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">Approve</button>
                        <button onClick={() => handleProcess(req.id, 'REJECTED')} disabled={processingId === req.id} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-md">Reject</button>
                      </>
                    )}
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
                <th className="p-4">Applicant</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Goal / Grade</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No applications found.</td>
                </tr>
              ) : (
                admissions.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{req.student_name}</p>
                    </td>
                    <td className="p-4 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400"/> {req.email}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="w-3 h-3 text-gray-400"/> {req.phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-800 line-clamp-2 max-w-xs">{req.learning_goal || '-'}</p>
                      <p className="text-xs text-gray-400 mt-1">Grade: {req.class_grade || '-'}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {req.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleProcess(req.id, 'APPROVED')}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleProcess(req.id, 'REJECTED')}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
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