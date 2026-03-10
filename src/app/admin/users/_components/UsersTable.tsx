// src/app/admin/users/_components/UsersTable.tsx
import { Shield, GraduationCap, Ban, Info } from 'lucide-react';
import { User } from '@/services/users';
import UserActions from './UserActions';
import Link from 'next/link';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  currentUser: User | null;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleSuspend: (id: number) => void;
}

export default function UsersTable({
  users,
  loading,
  currentUser,
  onEdit,
  onDelete,
  onToggleSuspend
}: UsersTableProps) {
  return (
    <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm min-h-[500px]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap w-[40%]">User Identity</th>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Role & Status</th>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Origin</th>
              <th className="p-5 text-right text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded-full" />
                      </div>
                    </div>
                  </td>
                  <td className="p-5"><div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                  <td className="p-5"><div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" /></td>
                  <td className="p-5"><div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-16 text-center text-slate-400 dark:text-slate-500 font-bold">
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelf = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className={`group transition-colors ${
                      user.is_suspended ? 'bg-rose-50/30 dark:bg-rose-900/5' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                    } ${isSelf ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                    
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                          ) : (
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-sm border-2 border-white dark:border-slate-800 ${
                              user.is_staff ? (user.is_superuser ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-purple-500 to-purple-700') : 'bg-gradient-to-br from-blue-500 to-blue-700'
                            }`}>
                              {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          {user.is_suspended && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Link href={`/admin/users/${user.id}`} className="font-black text-slate-900 dark:text-white text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
                              {user.first_name} {user.last_name}
                            </Link>
                            {isSelf && <span className="text-[9px] text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase tracking-widest shrink-0">You</span>}
                          </div>
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col items-start gap-2">
                        {user.is_staff ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            user.is_superuser 
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50"
                            : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50"
                          }`}>
                            <Shield className="w-3.5 h-3.5" /> {user.is_superuser ? "Super Admin" : "Admin"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                            <GraduationCap className="w-3.5 h-3.5" /> Student
                          </span>
                        )}

                        {user.is_suspended && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50">
                            <Ban className="w-3.5 h-3.5" /> Suspended
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-5">
                      {user.created_by ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          <Info className="w-3.5 h-3.5" />
                          <span>By <span className="text-slate-600 dark:text-slate-300">{user.created_by}</span></span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                          <Info className="w-3.5 h-3.5" /> System
                        </div>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      <UserActions 
                        user={user} 
                        currentUser={currentUser} 
                        onEdit={onEdit} 
                        onDelete={onDelete} 
                        onToggleSuspend={onToggleSuspend} 
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}