import { Users, UserPlus } from 'lucide-react';

interface UsersHeaderProps {
  onAdd: () => void;
}

export default function UsersHeader({ onAdd }: UsersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 md:gap-3">
          <span className="p-1.5 md:p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <Users className="w-5 h-5 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
          </span>
          User Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
          Manage access and permissions.
        </p>
      </div>
      
      <button 
        onClick={onAdd}
        className="w-full md:w-auto px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        Add User
      </button>
    </div>
  );
}
