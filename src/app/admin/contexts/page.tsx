// src/app/admin/contexts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getContexts, createContext, deleteContext, ProgramContext } from '@/services/contexts';
import ContextHeader from './_components/ContextHeader';
import CreateContextForm from './_components/CreateContextForm';
import ContextList from './_components/ContextList';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';
import DebugConsole from '@/components/debug/DebugConsole';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ContextManagerPage() {
  const [contexts, setContexts] = useState<ProgramContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

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
      setPageError(null);
      const data = await getContexts(); 
      setContexts(data);
    } catch (error: any) {
      setPageError(error);
      setAlert({
        open: true,
        title: "Synchronization Error",
        msg: "Failed to securely retrieve context tags from the server.",
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
        title: "Tag Generated",
        msg: "The context tag was successfully created and distributed.",
        type: 'success'
      });
    } catch (error: any) {
      setAlert({
        open: true,
        title: "Generation Failed",
        msg: error.message || "An unexpected error occurred while creating the tag.",
        type: 'danger'
      });
    } finally {
      setCreating(false);
    }
  };

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
    } catch (error: any) {
      setConfirmDelete({ open: false, id: null });
      setAlert({
        open: true,
        title: "Removal Failed",
        msg: error.message || "Failed to delete context. It may still be bound to active resources.",
        type: 'danger'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (pageError) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Subsystem Exception
          </h1>
          <button 
            onClick={loadContexts}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Fetch
          </button>
        </div>
        <DebugConsole error={pageError} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-24 animate-in fade-in duration-500">
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
        onDelete={initiateDelete}
      />

      <AlertModal 
        isOpen={alert.open}
        title={alert.title}
        message={alert.msg}
        type={alert.type}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      />

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Destroy Context Tag?"
        message="Are you sure you want to permanently delete this context tag? Resources bound to this tag may lose categorical structure."
        confirmText="Confirm Destruction"
        type="danger"
        isLoading={isDeleting}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleActualDelete}
      />
    </div>
  );
}