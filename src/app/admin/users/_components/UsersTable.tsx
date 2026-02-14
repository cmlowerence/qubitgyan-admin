// src/app/admin/users/_components/UsersTable.tsx
import { Shield, GraduationCap, Ban, Info } from 'lucide-react';
import { User } from '@/services/users';
import UserActions from './UserActions';

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
    <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">User Identity</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Role & Status</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Created By</th>
              <th className="p-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4"><div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                  <td className="p-4"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" /></td>
                  <td className="p-4"></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="p-12 text-center text-slate-400">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className={`group transition-colors ${
                    user.is_suspended ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  } ${currentUser?.id === user.id ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                         <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                          user.is_staff ? (user.is_superuser ? 'bg-amber-500' : 'bg-purple-500') : 'bg-blue-500'
                        }`}>
                          {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {user.first_name} {user.last_name}
                          {currentUser?.id === user.id && <span className="text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">(You)</span>}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1.5">
                      {user.is_staff ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          user.is_superuser 
                          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                          : "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                        }`}>
                          <Shield className="w-3 h-3" /> {user.is_superuser ? "Super Admin" : "Admin"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <GraduationCap className="w-3 h-3" /> Student
                        </span>
                      )}

                      {user.is_suspended && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {user.created_by ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span>by <span className="font-mono font-medium text-slate-700 dark:text-slate-300">@{user.created_by}</span></span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 italic">System</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                     <UserActions 
                       user={user} 
                       currentUser={currentUser} 
                       onEdit={onEdit} 
                       onDelete={onDelete} 
                       onToggleSuspend={onToggleSuspend} 
                     />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
