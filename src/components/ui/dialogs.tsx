// src/components/ui/dialogs.tsx
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

function ModalLayout({ isOpen, onClose, title, message, children, type = 'info' }: BaseModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    info: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
  };

  const icons = {
    danger: AlertTriangle,
    success: CheckCircle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[95%] sm:max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 sm:p-3.5 rounded-full shrink-0 ${colors[type]}`}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{message}</p>
            </div>
            <button onClick={onClose} className="p-1 sm:p-1.5 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 sm:px-6 py-4 sm:py-5 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AlertModal({ isOpen, onClose, title, message, type = 'info' }: BaseModalProps) {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title={title} message={message} type={type}>
      <button 
        onClick={onClose}
        className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-slate-900 active:scale-[0.98]"
      >
        Okay, Got it
      </button>
    </ModalLayout>
  );
}

interface ConfirmProps extends BaseModalProps {
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
}

export function ConfirmModal({ 
  isOpen, onClose, onConfirm, title, message, type = 'danger', isLoading, confirmText = "Confirm" 
}: ConfirmProps) {
  
  const confirmColors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-600/20 focus:ring-red-600',
    success: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 focus:ring-emerald-600',
    info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 focus:ring-blue-600'
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title={title} message={message} type={type}>
      <button 
        onClick={onClose}
        disabled={isLoading}
        className="w-full sm:w-auto px-5 py-3.5 sm:py-2.5 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        Cancel
      </button>
      <button 
        onClick={onConfirm}
        disabled={isLoading}
        className={`w-full sm:w-auto px-6 py-3.5 sm:py-2.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${confirmColors[type]}`}
      >
        {isLoading ? 'Processing...' : confirmText}
      </button>
    </ModalLayout>
  );
}