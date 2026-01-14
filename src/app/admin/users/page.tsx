'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Shield, 
  GraduationCap, 
  Mail, 
  UserPlus 
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
      // Backend usually sends detailed validation errors
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

  // Client-side filtering
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name + ' ' + u.last_name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
            View all registered students and administrators. Create new staff accounts or remove access.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center gap-2 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          placeholder="Search by name, email, or username..." 
          className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {filteredUsers.length} Users Found
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">User</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact</th>
                <th className="p-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                // Skeleton Loader
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" /></td>
                    <td className="p-4"><div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded" /></td>
                    <td className="p-4"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    No users found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                          user.is_staff ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {user.first_name?.[0]}{user.last_name?.[0]}
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

                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Mail className="w-4 h-4 text-slate-300" />
                        {user.email}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setDeleteId(user.id)}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isProcessing}
      />

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User?"
        message="This will permanently delete the account. The user will lose access immediately."
        confirmText="Delete Account"
        type="danger"
        isLoading={isProcessing}
      />

      <AlertModal 
        isOpen={alertState.open}
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
        title={alertState.title}
        message={alertState.msg}
        type={alertState.type}
      />
    </div>
  );
}
