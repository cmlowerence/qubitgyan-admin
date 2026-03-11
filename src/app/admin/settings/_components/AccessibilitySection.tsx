// src/app/admin/settings/_components/AccessibilitySection.tsx
import { Zap, RefreshCcw, EyeOff } from 'lucide-react';

interface AccessibilitySectionProps {
  reducedMotion: boolean;
  onMotionToggle: () => void;
  onClearCache: () => void;
}

export default function AccessibilitySection({ 
  reducedMotion, 
  onMotionToggle, 
  onClearCache 
}: AccessibilitySectionProps) {
  return (
    <section className="space-y-5 sm:space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Accessibility & Performance
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
        
        <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 hidden sm:block">
              <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Reduced Motion</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Disable complex UI animations for a faster, simpler experience.</p>
            </div>
          </div>
          <button 
            onClick={onMotionToggle}
            className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shrink-0 ${
              reducedMotion ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span className={`absolute top-1 left-1 inline-block w-5 h-5 sm:w-6 sm:h-6 transform bg-white rounded-full transition-transform duration-300 ease-spring shadow-sm ${
              reducedMotion ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 hidden sm:block">
              <RefreshCcw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Clear Cache & Reload</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Resolve persistent UI glitches by flushing the application state.</p>
            </div>
          </div>
          <button 
            onClick={onClearCache}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 shrink-0"
          >
            <RefreshCcw className="w-4 h-4" /> Hard Reload
          </button>
        </div>
      </div>
    </section>
  );
}