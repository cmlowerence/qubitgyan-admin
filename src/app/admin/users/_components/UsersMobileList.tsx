import { Shield, GraduationCap, Ban, Info } from 'lucide-react';
import { User } from '@/services/users';
import UserActions from './UserActions';

interface UsersMobileListProps {
  users: User[];
  loading: boolean;
  currentUser: User | null;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleSuspend: (id: number) => void;
}

export default function UsersMobileList({
  users,
  loading,
  currentUser,
  onEdit,
  onDelete,
  onToggleSuspend
}: UsersMobileListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="md:hidden text-center py-8 text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200">
         No users found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {users.map(user => (
        <div key={user.id} className={`bg-white dark:bg-slate-900 p-3.5 rounded-xl border shadow-sm flex flex-col gap-3 ${
            currentUser?.id === user.id ? 'border-indigo-200 dark:border-indigo-900 ring-1 ring-indigo-50 dark:ring-indigo-900/20' : 'border-slate-200 dark:border-slate-800'
          }`}>
          
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0">
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Av" className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-700" />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                    user.is_staff ? (user.is_superuser ? 'bg-amber-500' : 'bg-purple-500') : 'bg-blue-500'
                  }`}>
                    {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                  </div>
                )}
             </div>

             <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                   <h3 className="font-bold text-slate-900 dark:text-white text-base truncate pr-2">
                     {user.first_name} {user.last_name}
                     {currentUser?.id === user.id && <span className="ml-2 text-indigo-500 text-[10px] uppercase tracking-wider">(You)</span>}
                   </h3>
                </div>
                <p className="text-xs text-slate-500 font-mono truncate">@{user.username}</p>
                
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {user.is_staff ? (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      user.is_superuser 
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                      : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                    }`}>
                      <Shield className="w-2.5 h-2.5" /> {user.is_superuser ? "Super Admin" : "Admin"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <GraduationCap className="w-2.5 h-2.5" /> Student
                    </span>
                  )}
                  {user.is_suspended && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                      <Ban className="w-2.5 h-2.5" /> Suspended
                    </span>
                  )}
                </div>
             </div>
          </div>

          <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-y-2 gap-x-2">
             <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-full max-w-full">
               <Info className="w-3 h-3 flex-shrink-0" />
               <span className="truncate">By @{user.created_by || 'system'}</span>
             </div>
             <div className="ml-auto">
                <UserActions 
                  user={user} 
                  currentUser={currentUser} 
                  size="small" 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                  onToggleSuspend={onToggleSuspend} 
                />
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
