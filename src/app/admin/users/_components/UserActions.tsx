// src/app/admin/users/_components/UserActions.tsx
import { Pencil, Trash2, Ban, UserCheck, Lock } from 'lucide-react';
import { User } from '@/services/users';

interface UserActionsProps {
  user: User;
  currentUser: User | null;
  size?: 'small' | 'normal';
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleSuspend: (id: number) => void;
}

export default function UserActions({ 
  user, 
  currentUser, 
  size = 'normal',
  onEdit,
  onDelete,
  onToggleSuspend
}: UserActionsProps) {
  const btnClass = size === 'small' ? 'p-2' : 'p-2.5';
  const iconClass = size === 'small' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5';
  
  const isSelf = currentUser?.id === user.id;
  const hasRankAuthority = currentUser?.is_superuser || (currentUser?.can_manage_users && !user.is_staff);

  if (isSelf) {
    return (
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => onEdit(user)}
          className={`${btnClass} text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          title="Edit Your Profile"
        >
          <Pencil className={iconClass} />
        </button>
      </div>
    );
  }

  if (!hasRankAuthority) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 select-none cursor-not-allowed">
        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Protected
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
      <button 
        onClick={() => onToggleSuspend(user.id)}
        className={`${btnClass} rounded-xl transition-all border focus:outline-none focus:ring-2 ${
          user.is_suspended 
            ? "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/40 focus:ring-emerald-500" 
            : "text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/40 focus:ring-amber-500"
        }`}
        title={user.is_suspended ? "Restore Access" : "Suspend Access"}
      >
        {user.is_suspended ? <UserCheck className={iconClass} /> : <Ban className={iconClass} />}
      </button>

      <button 
        onClick={() => onEdit(user)}
        className={`${btnClass} text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        title="Edit User Profile"
      >
        <Pencil className={iconClass} />
      </button>

      <button 
        onClick={() => onDelete(user.id)}
        className={`${btnClass} text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/40 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-500`}
        title="Delete User"
      >
        <Trash2 className={iconClass} />
      </button>
    </div>
  );
}