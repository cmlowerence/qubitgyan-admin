// src/app/admin/users/_components/UsersMobileList.tsx
import { Shield, GraduationCap, Ban, Info, User as UserIcon } from 'lucide-react';
import { User } from '@/services/users';
import UserActions from './UserActions';
import Link from 'next/link';

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
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse h-40" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="lg:hidden text-center py-12 px-4 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <UserIcon className="w-12 h-12 mb-3 opacity-20" />
        <p className="font-bold">No users found.</p>
        <p className="text-xs mt-1">Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:hidden">
      {users.map(user => {
        const isSelf = currentUser?.id === user.id;
        
        return (
          <div key={user.id} className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border shadow-sm flex flex-col gap-4 transition-all ${
              isSelf ? 'border-indigo-300 dark:border-indigo-700 ring-4 ring-indigo-50 dark:ring-indigo-900/20' : 'border-slate-100 dark:border-slate-800'
            }`}>
            
            <div className="flex items-start gap-4">
              <div className="relative shrink-0 mt-1">
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] object-cover border-2 border-white dark:border-slate-800 shadow-md" />
                ) : (
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] flex items-center justify-center text-lg font-black text-white shadow-md border-2 border-white dark:border-slate-800 ${
                    user.is_staff ? (user.is_superuser ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-purple-500 to-purple-700') : 'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}>
                    {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                  </div>
                )}
                {user.is_suspended && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate flex items-center gap-2">
                  <Link href={`/admin/users/${user.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
                    {user.first_name} {user.last_name}
                  </Link>
                  {isSelf && <span className="shrink-0 text-[9px] font-black text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {user.is_staff ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      user.is_superuser 
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50"
                      : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50"
                    }`}>
                      <Shield className="w-3 h-3" /> {user.is_superuser ? "Super Admin" : "Admin"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                      <GraduationCap className="w-3 h-3" /> Student
                    </span>
                  )}
                  {user.is_suspended && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50">
                      <Ban className="w-3 h-3" /> Suspended
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-0">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Added by {user.created_by || 'System'}</span>
              </div>
              <div className="shrink-0">
                <UserActions 
                  user={user} 
                  currentUser={currentUser} 
                  size="normal" 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                  onToggleSuspend={onToggleSuspend} 
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}