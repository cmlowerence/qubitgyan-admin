'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Shield, 
  GraduationCap, 
  UserPlus,
  Lock,
  UserCheck,
  Ban,
  Info,
  Pencil // New Icon
} from 'lucide-react';
import { 
  User, 
  getUsers, 
  createUser, 
  deleteUser, 
  toggleSuspendUser, 
  updateUser, // New Service
  CreateUserPayload,
  UpdateUserPayload // New Interface
} from '@/services/users';
import { api } from '@/lib/api'; 
import { CreateUserModal } from '@/components/users/CreateUserModal';
import { EditUserModal } from '@/components/users/EditUserModal'; // New Component
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null); // New State for Edit
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [suspendId, setSuspendId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  // 1. Fetch Data
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [usersData, meRes] = await Promise.all([
          getUsers(),
          api.get('/users/me/')
        ]);
        setUsers(usersData);
        setCurrentUser(meRes.data);
      } catch (err) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  // 2. Handlers
  const handleCreate = async (data: CreateUserPayload) => {
    setIsProcessing(true);
    try {
      await createUser(data);
      await fetchUsers();
      setIsCreateOpen(false);
      showAlert('Success', `User ${data.username} created successfully!`, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message;
      showAlert('Creation Failed', errorMsg, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  // New: Handle Update (Edit / Reset Password)
  const handleUpdate = async (id: number, data: UpdateUserPayload) => {
    setIsProcessing(true);
    try {
      await updateUser(id, data);
      await fetchUsers();
      setEditUser(null);
      showAlert('Updated', 'User profile updated successfully.', 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to update user.";
      showAlert('Update Failed', errorMsg, 'danger');
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
      const msg = err.response?.data?.error || 'Failed to delete user.';
      showAlert('Error', msg, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSuspend = async () => {
    if (!suspendId) return;
    const userToToggle = users.find(u => u.id === suspendId);
    if (!userToToggle) return;

    const newState = !userToToggle.is_suspended;
    setIsProcessing(true);
    try {
      await toggleSuspendUser(suspendId, newState);
      setSuspendId(null);
      await fetchUsers();
      showAlert(
        newState ? 'Suspended' : 'Activated', 
        `User access has been ${newState ? 'blocked' : 'restored'}.`, 
        'success'
      );
    } catch (err: any) {
      showAlert('Error', 'Failed to update status.', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const showAlert = (title: string, msg: string, type: 'success' | 'danger') => {
    setAlertState({ open: true, title, msg, type });
  };

  // 3. Render Helpers
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name + ' ' + u.last_name).toLowerCase().includes(search.toLowerCase())
  );

  const canManageUser = (targetUser: User) => {
    if (!currentUser) return false;
    if (currentUser.is_superuser) return true;
    return !targetUser.is_staff;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
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

      {/* Toolbar */}
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

      {/* Responsive Table Wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
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
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" /></td>
                    <td className="p-4"><div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" /></td>
                    <td className="p-4"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="p-12 text-center text-slate-400">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`group transition-colors ${user.is_suspended ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                    {/* 1. Identity */}
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
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* 2. Role & Status */}
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

                    {/* 3. Created By */}
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

                    {/* 4. Actions */}
                    <td className="p-4 text-right">
                      {canManageUser(user) ? (
                        <div className="flex justify-end gap-2">
                          {/* Suspend Toggle */}
                          <button 
                            onClick={() => setSuspendId(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.is_suspended 
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" 
                                : "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            }`}
                            title={user.is_suspended ? "Unsuspend User" : "Suspend User"}
                          >
                            {user.is_suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>

                          {/* New: Edit Button */}
                          <button 
                            onClick={() => setEditUser(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            title="Edit User / Reset Password"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button 
                            onClick={() => setDeleteId(user.id)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-block p-2 text-slate-200 dark:text-slate-700" title="Access Protected">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
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
        currentUser={currentUser}
      />

      {/* New: Edit User Modal */}
      <EditUserModal 
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSubmit={handleUpdate}
        isLoading={isProcessing}
        user={editUser}
      />

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Delete User?" 
        message="This will permanently delete the account. This action cannot be undone." 
        confirmText="Delete Account" 
        type="danger" 
        isLoading={isProcessing}
      />

      <ConfirmModal
        isOpen={!!suspendId}
        onClose={() => setSuspendId(null)}
        onConfirm={handleToggleSuspend}
        title={users.find(u => u.id === suspendId)?.is_suspended ? "Reactivate User?" : "Suspend User?"}
        message={users.find(u => u.id === suspendId)?.is_suspended 
          ? "The user will regain access to the platform immediately." 
          : "The user will be blocked from logging in until reactivated."}
        confirmText={users.find(u => u.id === suspendId)?.is_suspended ? "Activate" : "Suspend"}
        type={users.find(u => u.id === suspendId)?.is_suspended ? "success" : "danger"}
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
