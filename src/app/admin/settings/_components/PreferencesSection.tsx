// src/app/admin/settings/_components/PreferencesSection.tsx
import { BellRing, LayoutTemplate } from 'lucide-react';

interface PreferencesSectionProps {
  notifications: boolean;
  compactMode: boolean;
  onNotificationsToggle: () => void;
  onCompactModeToggle: () => void;
}

export default function PreferencesSection({
  notifications,
  compactMode,
  onNotificationsToggle,
  onCompactModeToggle
}: PreferencesSectionProps) {
  return (
    <section className="space-y-5 sm:space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <LayoutTemplate className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Preferences
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
        
        <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 hidden sm:block">
              <BellRing className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Push Notifications</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Receive alerts for system events and updates.</p>
            </div>
          </div>
          <button 
            onClick={onNotificationsToggle}
            className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-500/30 shrink-0 ${
              notifications ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span className={`absolute top-1 left-1 inline-block w-5 h-5 sm:w-6 sm:h-6 transform bg-white rounded-full transition-transform duration-300 ease-spring shadow-sm ${
              notifications ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 hidden sm:block">
              <LayoutTemplate className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Compact Layout</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Decrease padding and increase data density on tables.</p>
            </div>
          </div>
          <button 
            onClick={onCompactModeToggle}
            className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-500/30 shrink-0 ${
              compactMode ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span className={`absolute top-1 left-1 inline-block w-5 h-5 sm:w-6 sm:h-6 transform bg-white rounded-full transition-transform duration-300 ease-spring shadow-sm ${
              compactMode ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
            }`} />
          </button>
        </div>

      </div>
    </section>
  );
}