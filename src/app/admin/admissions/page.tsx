'use client';

import { useEffect, useState } from 'react';
import { getAdmissions, approveAdmission, rejectAdmission, AdmissionRequest } from '@/services/admissions';
import AdmissionActionModal from '@/app/admin/admissions/AdmissionActionModal';
import { CheckCircle, XCircle, Clock, Search, Mail, Phone } from 'lucide-react';

export default function AdmissionsDeskPage() {
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<AdmissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [selectedStudent, setSelectedStudent] = useState<AdmissionRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadAdmissions();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAdmissions(admissions);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredAdmissions(admissions.filter(req => 
        req.student_first_name.toLowerCase().includes(lower) || 
        req.student_last_name.toLowerCase().includes(lower) ||
        req.email.toLowerCase().includes(lower)
      ));
      
    }
  }, [searchTerm, admissions]);

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      const data = await getAdmissions();
      setAdmissions(data);
      setFilteredAdmissions(data);
    } catch (error) {
      console.error("Failed to load admissions", error);
    } finally {
      setLoading(false);
    }
  };

  // Opens the dialog box instead of window.prompt
  const openActionModal = (req: AdmissionRequest, action: 'approve' | 'reject') => {
    setSelectedStudent(req);
    setModalAction(action);
    setIsModalOpen(true);
  };

  // Handles the actual API call when "Confirm" is clicked inside the modal
  const handleConfirmAction = async (remarks: string) => {
    if (!selectedStudent) return;
    
    setIsProcessing(true);
    try {
      if (modalAction === 'approve') {
        await approveAdmission(selectedStudent.id, remarks);
      } else {
        await rejectAdmission(selectedStudent.id, remarks);
      }
      setIsModalOpen(false);
      loadAdmissions(); // Refresh the list
    } catch (error: any) {
      alert(`Failed to ${modalAction}: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm"><Clock className="w-3.5 h-3.5"/> Pending</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm"><CheckCircle className="w-3.5 h-3.5"/> Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm"><XCircle className="w-3.5 h-3.5"/> Rejected</span>;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 space-y-4">
        <Clock className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="animate-pulse font-medium">Loading Admissions Queue...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions Desk</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage incoming student applications.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* MOBILE VIEW (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredAdmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No applications found.</div>
          ) : (
            filteredAdmissions.map((req) => (
              <div key={req.id} className="p-5 space-y-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{req.student_first_name} {req.student_last_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0">{getStatusBadge(req.status)}</div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                  <p className="text-sm text-gray-800 line-clamp-2"><strong>Goal:</strong> {req.learning_goal || 'Not specified'}</p>
                  <p className="text-xs text-gray-500"><strong>Grade:</strong> {req.class_grade || 'N/A'}</p>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-gray-400 shrink-0"/> <span className="truncate">{req.email}</span></span>
                  <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400 shrink-0"/> {req.phone}</span>
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => openActionModal(req, 'approve')} className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg transition-colors border border-emerald-200">
                      Approve
                    </button>
                    <button onClick={() => openActionModal(req, 'reject')} className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold rounded-lg transition-colors border border-rose-200">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4 max-w-xs">Goal & Grade</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p>No applications found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{req.student_first_name} {req.student_last_name}</p>
                    </td>
                    <td className="p-4 space-y-1.5 min-w-0 max-w-[200px]">
                      <p className="text-sm text-gray-600 flex items-center gap-2 truncate" title={req.email}>
                        <Mail className="w-4 h-4 text-gray-400 shrink-0"/> <span className="truncate">{req.email}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0"/> <span className="truncate">{req.phone}</span>
                      </p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-sm text-gray-800 line-clamp-2" title={req.learning_goal}>{req.learning_goal || '-'}</p>
                      <p className="text-xs text-indigo-600 font-medium mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded">Grade: {req.class_grade || '-'}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openActionModal(req, 'approve')}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg transition-colors border border-emerald-200 shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => openActionModal(req, 'reject')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold rounded-lg transition-colors border border-rose-200 shadow-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* The beautifully designed Remarks Modal */}
      <AdmissionActionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        actionType={modalAction}
        studentName={selectedStudent?.student_first_name + ' ' + selectedStudent?.student_last_name || 'this student'}
        isProcessing={isProcessing}
      />
    </div>
  );
}