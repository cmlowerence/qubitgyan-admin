'use client';

import { useEffect, useState } from 'react';
import { getContexts, createContext, deleteContext, ProgramContext } from '@/services/contexts'; 
import ContextHeader from './_components/ContextHeader';
import CreateContextForm from './_components/CreateContextForm';
import ContextList from './_components/ContextList';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function ContextManagerPage() {
  const [contexts, setContexts] = useState<ProgramContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  // --- Modal States ---
  const [alert, setAlert] = useState<{ open: boolean; title: string; msg: string; type: 'success' | 'danger' | 'info' }>({
    open: false, title: '', msg: '', type: 'info'
  });

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({
    open: false, id: null
  });

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      setLoading(true);
      const data = await getContexts(); 
      setContexts(data);
    } catch (error) {
      setAlert({
        open: true,
        title: "Load Error",
        msg: "Failed to retrieve contexts from the server.",
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      await createContext(newName, 'Created via Admin Panel');
      setNewName('');
      loadContexts();
      setAlert({
        open: true,
        title: "Success",
        msg: "Context tag created successfully.",
        type: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        title: "Creation Failed",
        msg: "There was an error creating the context tag.",
        type: 'danger'
      });
    } finally {
      setCreating(false);
    }
  };

  // Trigger the Confirm Modal instead of window.confirm
  const initiateDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };

  const handleActualDelete = async () => {
    if (!confirmDelete.id) return;

    try {
      setIsDeleting(true);
      await deleteContext(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      loadContexts();
    } catch (error) {
      setConfirmDelete({ open: false, id: null });
      setAlert({
        open: true,
        title: "Delete Failed",
        msg: "Failed to delete context. It may still be linked to active resources.",
        type: 'danger'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 pb-20">
      <ContextHeader isLoading={loading} onRefresh={loadContexts} />
      
      <CreateContextForm 
        newName={newName} 
        isCreating={creating} 
        onNameChange={setNewName} 
        onSubmit={handleCreate} 
      />
      
      <ContextList 
        contexts={contexts} 
        isLoading={loading} 
        onDelete={initiateDelete} // Now triggers our modal
      />

      {/* --- UI Modals --- */}
      
      <AlertModal 
        isOpen={alert.open}
        title={alert.title}
        message={alert.msg}
        type={alert.type}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      />

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Delete Context"
        message="Are you sure you want to delete this context? This might affect resources currently tagged with it."
        confirmText="Delete Tag"
        type="danger"
        isLoading={isDeleting}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleActualDelete}
      />
    </div>
  );
}