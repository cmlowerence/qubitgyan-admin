// src/app/admin/settings/_components/SettingsHeader.tsx
import { Settings } from 'lucide-react';

export default function SettingsHeader() {
  return (
    <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Settings className="w-8 h-8 text-slate-600 dark:text-slate-300" />
        </div>
        System Preferences
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 ml-14">
        Customize the look and feel of your Admin Panel.
      </p>
    </div>
  );
}
