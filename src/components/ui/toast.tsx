'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ToastVariant = 'success' | 'info' | 'warning' | 'danger';
interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
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
      {/* Toast container (top-right) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-xs w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-full rounded-lg shadow-lg border px-4 py-3 flex items-start gap-3 transition-transform transform translate-y-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}
            role="status"
          >
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{t.title}</div>}
              {t.description && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{t.description}</div>}
            </div>
            <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-90 p-1 rounded focus:outline-none">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
