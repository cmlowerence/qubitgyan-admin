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

  // Reset remarks when the modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRemarks('');
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const isApprove = actionType === 'approve';

  // Dynamic Theme Configurations
  const theme = {
    icon: isApprove ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <AlertCircle className="w-6 h-6 text-rose-600" />,
    iconBg: isApprove ? 'bg-emerald-100' : 'bg-rose-100',
    title: isApprove ? 'Approve Application' : 'Reject Application',
    description: isApprove 
      ? `You are about to approve the admission for ${studentName}. An account will be created and a welcome email will be sent.` 
      : `You are about to reject the admission for ${studentName}. This action cannot be easily undone.`,
    placeholder: isApprove ? 'Optional remarks (e.g., "Verified via school ID")' : 'Required: Reason for rejection...',
    buttonColor: isApprove 
      ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' 
      : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    ringColor: isApprove ? 'focus:border-emerald-500 focus:ring-emerald-500/20' : 'focus:border-rose-500 focus:ring-rose-500/20',
  };

  const handleConfirm = () => {
    // Optional logic: Force remarks if rejecting
    if (!isApprove && remarks.trim().length === 0) {
      // You could set a local error state here if you want to enforce remarks on rejection
      // setError('Remarks are required for rejection.');
      // return;
    }
    onConfirm(remarks.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !isProcessing && onClose()}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${theme.iconBg}`}>
              {theme.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{theme.title}</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {theme.description}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-gray-50/50">
          <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700 mb-2">
            Administrator Remarks <span className="text-gray-400 font-normal">{isApprove ? '(Optional)' : '(Recommended)'}</span>
          </label>
          <textarea
            id="remarks"
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={theme.placeholder}
            className={`w-full p-3 bg-white border border-gray-200 rounded-xl text-sm transition-all resize-none shadow-sm focus:outline-none focus:ring-4 ${theme.ringColor}`}
            disabled={isProcessing}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || (!isApprove && remarks.trim() === '')} // Disable if rejecting and no remarks
            className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center gap-2 ${theme.buttonColor} disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
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