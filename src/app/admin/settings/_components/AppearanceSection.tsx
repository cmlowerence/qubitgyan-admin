// src/app/admin/settings/_components/AppearanceSection.tsx
import { Monitor, Sun, Moon, Smartphone, CheckCircle2 } from 'lucide-react';

interface AppearanceSectionProps {
  theme: string | undefined;
  onThemeChange: (theme: string) => void;
}

export default function AppearanceSection({ theme, onThemeChange }: AppearanceSectionProps) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Theme & Appearance
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <button 
          onClick={() => onThemeChange('light')}
          className={`group relative p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            theme === 'light' 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/10 scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl transition-colors ${theme === 'light' ? 'bg-blue-100 dark:bg-blue-800/30' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'}`}>
              <Sun className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-500'}`} />
            </div>
            <div className={`transition-transform duration-300 ${theme === 'light' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Light Mode</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Clean, crisp, and high contrast visibility.</p>
        </button>

        <button 
          onClick={() => onThemeChange('dark')}
          className={`group relative p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
            theme === 'dark' 
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10 scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl transition-colors ${theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20'}`}>
              <Moon className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500'}`} />
            </div>
            <div className={`transition-transform duration-300 ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <CheckCircle2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Dark Mode</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Deep, immersive, and easy on the eyes.</p>
        </button>

        <button 
          onClick={() => onThemeChange('system')}
          className={`group relative p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
            theme === 'system' 
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-lg shadow-emerald-500/10 scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl transition-colors ${theme === 'system' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20'}`}>
              <Smartphone className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'system' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-500'}`} />
            </div>
            <div className={`transition-transform duration-300 ${theme === 'system' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">System</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Seamlessly adapts to your device settings.</p>
        </button>
      </div>
    </section>
  );
}