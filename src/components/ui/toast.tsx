// src/components/ui/toast.tsx
'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

type ToastVariant = 'success' | 'info' | 'warning' | 'danger';
interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastContextValue = {
  push: (t: Omit<ToastItem, 'id'>) => string;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode; border: string }> = {
  success: { bg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100', border: 'border-emerald-200 dark:border-emerald-800/50', icon: <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100', border: 'border-blue-200 dark:border-blue-800/50', icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" /> },
  warning: { bg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100', border: 'border-amber-200 dark:border-amber-800/50', icon: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" /> },
  danger: { bg: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100', border: 'border-red-200 dark:border-red-800/50', icon: <AlertOctagon className="w-5 h-5 text-red-500 dark:text-red-400" /> },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2, 8);
    const next: ToastItem = {
      id,
      title: t.title,
      description: t.description,
      variant: t.variant || 'info',
      duration: t.duration ?? 4000,
    };
    setToasts((s) => [next, ...s]);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const timers: Record<string, number> = {} as Record<string, number>;
    toasts.forEach((t) => {
      if (timers[t.id]) return;
      timers[t.id] = window.setTimeout(() => remove(t.id), t.duration);
    });
    return () => {
      Object.values(timers).forEach((id) => window.clearTimeout(id));
    };
  }, [toasts, remove]);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed top-0 sm:top-4 right-0 sm:right-4 left-0 sm:left-auto z-[250] flex flex-col gap-2 sm:gap-3 p-4 sm:p-0 max-w-full sm:max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const style = variantStyles[t.variant || 'info'];
          return (
            <div
              key={t.id}
              className={`w-full rounded-2xl shadow-xl shadow-slate-900/5 border ${style.border} ${style.bg} px-4 py-3.5 sm:p-4 flex items-start gap-3.5 transition-all transform animate-in slide-in-from-top-4 sm:slide-in-from-right-8 fade-in pointer-events-auto backdrop-blur-md`}
              role="status"
            >
              <div className="shrink-0 pt-0.5">{style.icon}</div>
              <div className="flex-1 min-w-0 pt-0.5">
                {t.title && <div className="font-bold text-sm leading-tight truncate">{t.title}</div>}
                {t.description && <div className="text-sm opacity-80 font-medium mt-1 leading-snug break-words">{t.description}</div>}
              </div>
              <button onClick={() => remove(t.id)} className="shrink-0 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none transition-all">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}