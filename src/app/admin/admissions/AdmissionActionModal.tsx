// src/app/admin/admissions/AdmissionActionModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AdmissionActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  actionType: 'approve' | 'reject';
  studentName: string;
  isProcessing: boolean;
}

export default function AdmissionActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  studentName,
  isProcessing
}: AdmissionActionModalProps) {
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRemarks('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const isApprove = actionType === 'approve';

  const theme = {
    icon: isApprove ? <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
    iconBg: isApprove ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/50',
    title: isApprove ? 'Approve Application' : 'Reject Application',
    description: isApprove 
      ? `You are about to approve the admission for ${studentName}. An account will be created and a welcome email will be dispatched.` 
      : `You are about to reject the admission for ${studentName}. This action will discard the request and notify the user.`,
    placeholder: isApprove ? 'Optional remarks (e.g., "Verified via school ID")' : 'Required: Reason for rejection...',
    buttonColor: isApprove 
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500/30 shadow-emerald-600/20' 
      : 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/30 shadow-rose-600/20',
    ringColor: isApprove ? 'focus:border-emerald-500 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/20' : 'focus:border-rose-500 focus:ring-rose-500/10 dark:focus:ring-rose-500/20',
  };

  const handleConfirm = () => {
    onConfirm(remarks.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isProcessing && onClose()}
        aria-hidden="true"
      />

      <div 
        className="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-5 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 border shadow-sm ${theme.iconBg}`}>
              {theme.icon}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{theme.title}</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-[280px]">
                {theme.description}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-400 shrink-0 -mr-2 sm:mr-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-white dark:bg-slate-950 overflow-y-auto custom-scrollbar flex-1">
          <label htmlFor="remarks" className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2.5 ml-1">
            Administrator Remarks <span className="font-bold text-slate-400 dark:text-slate-500 lowercase ml-1">{isApprove ? '(Optional)' : '(Required)'}</span>
          </label>
          <textarea
            id="remarks"
            rows={5}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={theme.placeholder}
            className={`w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all resize-y shadow-sm outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-4 ${theme.ringColor}`}
            disabled={isProcessing}
            autoFocus
          />
        </div>

        <div className="px-6 py-4 sm:py-5 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            Cancel Process
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || (!isApprove && remarks.trim() === '')}
            className={`w-full sm:w-auto px-6 py-3.5 sm:py-3 text-sm font-black rounded-xl shadow-lg focus:outline-none focus:ring-4 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] ${theme.buttonColor} disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              isApprove ? 'Confirm Approval' : 'Confirm Rejection'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}