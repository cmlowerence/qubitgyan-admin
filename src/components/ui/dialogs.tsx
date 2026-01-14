'use client';

import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  children?: React.ReactNode;
  type?: 'danger' | 'success' | 'info';
}

// 1. Internal Base Modal Layout
function ModalLayout({ isOpen, onClose, title, message, children, type = 'info' }: BaseModalProps) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    danger: 'text-red-600 bg-red-50',
    success: 'text-green-600 bg-green-50',
    info: 'text-blue-600 bg-blue-50'
  };

  const icons = {
    danger: AlertTriangle,
    success: CheckCircle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${colors[type]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

// 2. Export: Alert Dialog (Replaces window.alert)
export function AlertModal({ isOpen, onClose, title, message, type = 'info' }: BaseModalProps) {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title={title} message={message} type={type}>
      <button 
        onClick={onClose}
        className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
      >
        Okay, Got it
      </button>
    </ModalLayout>
  );
}

// 3. Export: Confirmation Dialog (Replaces window.confirm)
interface ConfirmProps extends BaseModalProps {
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
}

export function ConfirmModal({ 
  isOpen, onClose, onConfirm, title, message, type = 'danger', isLoading, confirmText = "Confirm" 
}: ConfirmProps) {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title={title} message={message} type={type}>
      <button 
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button 
        onClick={onConfirm}
        disabled={isLoading}
        className={`px-6 py-2 text-white text-sm font-bold rounded-xl shadow-sm transition-transform active:scale-95 disabled:opacity-70 flex items-center gap-2 ${
          type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Processing...' : confirmText}
      </button>
    </ModalLayout>
  );
}
