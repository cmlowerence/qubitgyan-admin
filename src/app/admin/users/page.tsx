// src/app/admin/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, getUsers, getCurrentUser, createUser, deleteUser, toggleSuspendUser, updateUser, 
  CreateUserPayload, UpdateUserPayload 
} from '@/services/users';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import { EditUserModal } from '@/components/users/EditUserModal';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

// Dumb Components
import UsersHeader from './_components/UsersHeader';
import UserSearch from './_components/UserSearch';
import UsersMobileList from './_components/UsersMobileList';
import UsersTable from './_components/UsersTable';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
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
        const [usersData, meData] = await Promise.all([
          getUsers(),
          getCurrentUser()
        ]);
        setUsers(usersData);
        setCurrentUser(meData);
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

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name + ' ' + u.last_name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 space-y-5 animate-in fade-in duration-500">
      
      <UsersHeader onAdd={() => setIsCreateOpen(true)} />

      <UserSearch value={search} onChange={setSearch} />

      <UsersMobileList 
        users={filteredUsers}
        loading={loading}
        currentUser={currentUser}
        onEdit={setEditUser}
        onDelete={setDeleteId}
        onToggleSuspend={setSuspendId}
      />

      <UsersTable 
        users={filteredUsers}
        loading={loading}
        currentUser={currentUser}
        onEdit={setEditUser}
        onDelete={setDeleteId}
        onToggleSuspend={setSuspendId}
      />

      {/* Modals & Dialogs */}
      <CreateUserModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreate} 
        isLoading={isProcessing} 
        currentUser={currentUser} 
      />
      
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
        message="Permanent action." 
        confirmText="Delete" 
        type="danger" 
        isLoading={isProcessing} 
      />
      
      <ConfirmModal 
        isOpen={!!suspendId} 
        onClose={() => setSuspendId(null)} 
        onConfirm={handleToggleSuspend} 
        title={users.find(u => u.id === suspendId)?.is_suspended ? "Activate?" : "Suspend?"} 
        message="Toggle access." 
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
