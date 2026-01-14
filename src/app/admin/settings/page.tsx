'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tags, 
  Plus, 
  Trash2, 
  Loader2, 
  Save 
} from 'lucide-react';
import { getContexts, createContext, deleteContext, ProgramContext } from '@/services/settings';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function SettingsPage() {
  const [contexts, setContexts] = useState<ProgramContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Modal State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  useEffect(() => {
    fetchContexts();
  }, []);

  const fetchContexts = async () => {
    try {
      setLoading(true);
      const data = await getContexts();
      setContexts(data);
    } catch (err) {
      console.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setAdding(true);
    try {
      await createContext(newName, newDesc);
      setNewName('');
      setNewDesc('');
      await fetchContexts();
      showAlert('Success', 'New tag created successfully', 'success');
    } catch (err: any) {
      showAlert('Error', err.message, 'danger');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContext(deleteId);
      setDeleteId(null);
      await fetchContexts();
      showAlert('Deleted', 'Tag removed successfully', 'success');
    } catch (err: any) {
      showAlert('Error', 'Cannot delete this tag because it is being used by resources.', 'danger');
    }
  };

  const showAlert = (title: string, msg: string, type: 'success' | 'danger') => {
    setAlertState({ open: true, title, msg, type });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Tags className="w-8 h-8 text-purple-600" />
          </div>
          Settings & Configuration
        </h1>
        <p className="text-slate-500 mt-2 ml-14">
          Manage the tags (contexts) used to categorize your study materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Create Form */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create New Tag
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Tag Name</label>
                <input 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Olympiad"
                  className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
                  required
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Description (Optional)</label>
                <textarea 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Short description..."
                  rows={3}
                  className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={adding || !newName}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Tag
              </button>
            </form>
          </div>
        </div>

        {/* Right: List of Tags */}
        <div className="md:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4">Active Tags ({contexts.length})</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {contexts.map((ctx) => (
                <div key={ctx.id} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all">
                  <div>
                    <h4 className="font-bold text-slate-800">{ctx.name}</h4>
                    {ctx.description && <p className="text-xs text-slate-500 mt-0.5">{ctx.description}</p>}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-300">ID: {ctx.id}</span>
                    <button 
                      onClick={() => setDeleteId(ctx.id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Tag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {contexts.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-400 font-medium">No tags created yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Tag?"
        message="Are you sure? Resources using this tag might lose their categorization."
        confirmText="Delete Tag"
        type="danger"
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
