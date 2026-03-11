// src/app/admin/admissions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAdmissions, approveAdmission, rejectAdmission, AdmissionRequest } from '@/services/admissions';
import AdmissionActionModal from '@/app/admin/admissions/AdmissionActionModal';
import { CheckCircle, XCircle, Clock, Search, Mail, Phone, AlertTriangle, RefreshCw, GraduationCap } from 'lucide-react';
import { AlertModal } from '@/components/ui/dialogs';
import DebugConsole from '@/components/debug/DebugConsole';

export default function AdmissionsDeskPage() {
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<AdmissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageError, setPageError] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [selectedStudent, setSelectedStudent] = useState<AdmissionRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success' | 'danger' | 'info' }>({
    open: false, title: '', msg: '', type: 'info'
  });

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
      setPageError(null);
      const data = await getAdmissions();
      setAdmissions(data);
      setFilteredAdmissions(data);
    } catch (error: any) {
      setPageError(error);
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (req: AdmissionRequest, action: 'approve' | 'reject') => {
    setSelectedStudent(req);
    setModalAction(action);
    setIsModalOpen(true);
  };

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
      
      setAlertState({
        open: true,
        title: modalAction === 'approve' ? 'Admission Approved' : 'Admission Rejected',
        msg: `The application for ${selectedStudent.student_first_name} has been processed successfully.`,
        type: 'success'
      });
      
      loadAdmissions(); 
    } catch (error: any) {
      setIsModalOpen(false);
      setAlertState({
        open: true,
        title: 'Action Failed',
        msg: error.message || `Failed to ${modalAction} the admission request.`,
        type: 'danger'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 px-3 py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm"><Clock className="w-3.5 h-3.5"/> Pending</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm"><CheckCircle className="w-3.5 h-3.5"/> Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 px-3 py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm"><XCircle className="w-3.5 h-3.5"/> Rejected</span>;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-500" />
        <p className="animate-pulse font-bold tracking-widest uppercase text-xs sm:text-sm">Fetching Queue...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Sync Exception
          </h1>
          <button 
            onClick={loadAdmissions}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={pageError} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admissions Desk</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Review and process incoming student enrollment applications.</p>
          </div>
        </div>

        <div className="relative w-full lg:w-80 shrink-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search applicants..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-transparent lg:bg-white lg:dark:bg-slate-900 rounded-[2rem] lg:shadow-sm lg:border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:hidden">
          {filteredAdmissions.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <Search className="w-10 h-10 mb-4 opacity-20" />
              <p className="font-bold text-lg">No applications found</p>
              <p className="text-sm mt-1">Try adjusting your search query.</p>
            </div>
          ) : (
            filteredAdmissions.map((req) => (
              <div key={req.id} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white text-lg truncate">{req.student_first_name} {req.student_last_name}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0">{getStatusBadge(req.status)}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-2">
                  <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                    <strong className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mr-2">Goal:</strong> 
                    <span className="font-medium">{req.learning_goal || 'Not specified'}</span>
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    <strong className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mr-2">Grade:</strong> 
                    <span className="font-medium">{req.class_grade || 'N/A'}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-3 truncate bg-slate-50 dark:bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0"/> 
                    <span className="truncate">{req.email}</span>
                  </span>
                  <span className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0"/> 
                    {req.phone}
                  </span>
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                    <button 
                      onClick={() => openActionModal(req, 'approve')} 
                      className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-200 dark:border-emerald-800/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => openActionModal(req, 'reject')} 
                      className="flex-1 py-3 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-sm font-black uppercase tracking-widest rounded-xl transition-all border border-rose-200 dark:border-rose-800/50 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="p-5 pl-8 w-[20%]">Applicant Identity</th>
                <th className="p-5 w-[25%]">Contact Info</th>
                <th className="p-5 w-[25%]">Goal & Grade</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right pr-8 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Search className="w-10 h-10 opacity-20" />
                      <p className="font-bold text-lg">No applications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-5 pl-8">
                      <p className="font-black text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {req.student_first_name} {req.student_last_name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                        Applied {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-5 space-y-2 min-w-0">
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2.5 truncate bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-100 dark:border-slate-800" title={req.email}>
                        <Mail className="w-4 h-4 text-slate-400 shrink-0"/> <span className="truncate">{req.email}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2.5 bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-100 dark:border-slate-800 w-max">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0"/> <span>{req.phone}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed" title={req.learning_goal}>{req.learning_goal || '-'}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mt-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 inline-block px-2.5 py-1 rounded-md">Grade: {req.class_grade || '-'}</p>
                    </td>
                    <td className="p-5 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-5 text-right pr-8 whitespace-nowrap">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openActionModal(req, 'approve')}
                            className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-200 dark:border-emerald-800/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:scale-95"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => openActionModal(req, 'reject')}
                            className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-rose-200 dark:border-rose-800/50 focus:outline-none focus:ring-4 focus:ring-rose-500/20 active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-100 dark:border-slate-800">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdmissionActionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        actionType={modalAction}
        studentName={selectedStudent?.student_first_name + ' ' + selectedStudent?.student_last_name || 'this student'}
        isProcessing={isProcessing}
      />

      <AlertModal 
        isOpen={alertState.open}
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
        title={alertState.title}
        message={alertState.msg}
        type={alertState.type}
      />
    </div>
  );
}