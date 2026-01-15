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
  const btnClass = size === 'small' ? 'p-1.5' : 'p-2';
  const iconClass = size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  
  const isSelf = currentUser?.id === user.id;
  const hasRankAuthority = currentUser?.is_superuser || !user.is_staff;

  // SCENARIO 1: IT IS ME
  if (isSelf) {
    return (
      <div className="flex items-center justify-end gap-1.5">
         <span className="text-[10px] text-slate-400 font-medium mr-1 hidden sm:inline-block">
           (You)
         </span>
         <button 
          onClick={() => onEdit(user)}
          className={`${btnClass} text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300 rounded-lg transition-colors`}
          title="Edit Profile"
        >
          <Pencil className={iconClass} />
        </button>
      </div>
    );
  }

  // SCENARIO 2: NO AUTHORITY
  if (!hasRankAuthority) {
    return (
      <div className="inline-flex items-center gap-1.5 p-1.5 text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-medium uppercase tracking-wide border border-slate-100 dark:border-slate-700 select-none cursor-not-allowed">
        <Lock className={iconClass} /> Protected
      </div>
    );
  }
  
  // SCENARIO 3: FULL AUTHORITY
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button 
        onClick={() => onToggleSuspend(user.id)}
        className={`${btnClass} rounded-lg transition-colors border ${
          user.is_suspended 
            ? "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800" 
            : "text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800"
        }`}
        title={user.is_suspended ? "Unsuspend" : "Suspend"}
      >
        {user.is_suspended ? <UserCheck className={iconClass} /> : <Ban className={iconClass} />}
      </button>

      <button 
        onClick={() => onEdit(user)}
        className={`${btnClass} text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300 rounded-lg transition-colors`}
        title="Edit"
      >
        <Pencil className={iconClass} />
      </button>

      <button 
        onClick={() => onDelete(user.id)}
        className={`${btnClass} text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 rounded-lg transition-colors`}
        title="Delete"
      >
        <Trash2 className={iconClass} />
      </button>
    </div>
  );
}
