// src/app/admin/settings/_components/AccessibilitySection.tsx
import { Zap, RefreshCcw } from 'lucide-react';

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
    <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Zap className="w-5 h-5" /> Accessibility & Performance
      </h2>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        
        <div className="p-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Reduced Motion</h4>
            <p className="text-sm text-slate-500">Disable complex animations for a faster feel.</p>
          </div>
          <button 
            onClick={onMotionToggle}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              reducedMotion ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out mt-1 ml-1 ${
              reducedMotion ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Clear Cache & Reload</h4>
            <p className="text-sm text-slate-500">Fixes UI glitches by clearing local state.</p>
          </div>
          <button 
            onClick={onClearCache}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Reload App
          </button>
        </div>
      </div>
    </section>
  );
}
