// src/app/admin/settings/_components/AppearanceSection.tsx
import { Monitor, Sun, Moon, Smartphone, CheckCircle2 } from 'lucide-react';

interface AppearanceSectionProps {
  theme: string | undefined;
  onThemeChange: (theme: string) => void;
}

export default function AppearanceSection({ theme, onThemeChange }: AppearanceSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Monitor className="w-5 h-5" /> Appearance
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => onThemeChange('light')}
          className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
            theme === 'light' 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600' : 'text-slate-400'}`} />
            {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Light Mode</h3>
          <p className="text-xs text-slate-500 mt-1">Clean, high contrast.</p>
        </button>

        <button 
          onClick={() => onThemeChange('dark')}
          className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
            theme === 'dark' 
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-500' : 'text-slate-400'}`} />
            {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Dark Mode</h3>
          <p className="text-xs text-slate-500 mt-1">Easy on the eyes.</p>
        </button>

        <button 
          onClick={() => onThemeChange('system')}
          className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
            theme === 'system' 
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <Smartphone className={`w-6 h-6 ${theme === 'system' ? 'text-emerald-500' : 'text-slate-400'}`} />
            {theme === 'system' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200">System</h3>
          <p className="text-xs text-slate-500 mt-1">Matches your device.</p>
        </button>
      </div>
    </section>
  );
}
