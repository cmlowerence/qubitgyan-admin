// src/app/admin/users/_components/UsersHeader.tsx
import { Users, UserPlus } from 'lucide-react';

interface UsersHeaderProps {
  onAdd: () => void;
}

export default function UsersHeader({ onAdd }: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          Directory
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          Manage system access, roles, and user profiles.
        </p>
      </div>
      
      <button 
        onClick={onAdd}
        className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:opacity-90 shadow-lg shadow-slate-900/20 dark:shadow-white/10 transition-all flex items-center justify-center gap-2.5 text-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-slate-900"
      >
        <UserPlus className="w-5 h-5" />
        Add New User
      </button>
    </div>
  );
}