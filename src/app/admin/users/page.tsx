'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Shield, 
  GraduationCap, 
  Mail, 
  UserPlus,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { User, getUsers, createUser, deleteUser, CreateUserPayload } from '@/services/users';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateUserPayload) => {
    setIsProcessing(true);
    try {
      await createUser(data);
      await fetchUsers();
      setIsCreateOpen(false);
      showAlert('Success', `User ${data.username} created successfully!`, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data 
        ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
        : err.message;
      showAlert('Creation Failed', errorMsg, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsProcessing(true);
    try {
      await deleteUser(deleteId);
      setDeleteId(null);
      await fetchUsers();
      showAlert('Deleted', 'User has been removed.', 'success');
    } catch (err: any) {
      showAlert('Error', 'Failed to delete user.', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const showAlert = (title: string, msg: string, type: 'success' | 'danger') => {
    setAlertState({ open: true, title, msg, type });
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name + ' ' + u.last_name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            User Management
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
            Manage student access and administrator privileges.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full md:w-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* 2. Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search users..." 
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {filteredUsers.length} Users Found
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      
      {/* A. MOBILE VIEW: Cards (Visible on small screens) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {loading ? (
           [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)
        ) : filteredUsers.length === 0 ? (
           <div className="text-center p-8 text-slate-400 text-sm">No users found.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0 ${
                  user.is_staff ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                </div>
                
                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{user.first_name} {user.last_name}</h4>
                    {user.is_staff && <Shield className="w-3 h-3 text-purple-500" />}
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">@{user.username}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => setDeleteId(user.id)}
                className="p-2 -mr-2 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* B. DESKTOP VIEW: Table (Hidden on mobile) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">User Identity</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="p-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4"><div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                  <td className="p-4"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" /></td>
                  <td className="p-4"><div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded" /></td>
                  <td className="p-4"></td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="p-12 text-center text-slate-400">No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                        user.is_staff ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {user.is_staff ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <GraduationCap className="w-3 h-3" /> Student
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setDeleteId(user.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreateUserModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} isLoading={isProcessing} />
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete User?" message="This will permanently delete the account." confirmText="Delete Account" type="danger" isLoading={isProcessing} />
      <AlertModal isOpen={alertState.open} onClose={() => setAlertState(prev => ({ ...prev, open: false }))} title={alertState.title} message={alertState.msg} type={alertState.type} />
    </div>
  );
}
