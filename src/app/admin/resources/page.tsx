'use client';

import React, { useState, useEffect } from 'react';
import { Resource } from '@/types/resource';
import { getAllResources, deleteResource, updateResource } from '@/services/resource';
import { api } from '@/lib/api';
import { EditResourceModal } from '@/components/resources/EditResourceModal';
import { getMediaList, UploadedMedia } from '@/services/media';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';
import DebugConsole from '@/components/debug/DebugConsole';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import LibraryHeader from './_components/LibraryHeader';
import ResourceToolbar from './_components/ResourceToolbar';
import ResourceList from './_components/ResourceList';

export default function GlobalLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [error, setError] = useState<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [contextFilter, setContextFilter] = useState('ALL');

  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  useEffect(() => {
    const loadContexts = async () => {
      try {
        const res = await api.get('/contexts/');
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setContexts(data);
      } catch (err) {
      }
    };
    loadContexts();
    getMediaList().then(setMedia).catch(() => setMedia([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, typeFilter, contextFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllResources({
        search: searchQuery,
        type: typeFilter,
        context: contextFilter
      });
      setResources(data);
    } catch (err: any) {
      setError(err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (id: number, payload: any) => {
    setIsProcessing(true);
    try {
      await updateResource(id, payload);
      setEditingResource(null);
      await fetchResources();
      showAlert('Success', 'Resource updated successfully', 'success');
    } catch (err: any) {
      showAlert('Update Failed', err.message, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsProcessing(true);
    try {
      await deleteResource(deleteId);
      setDeleteId(null);
      await fetchResources();
      showAlert('Deleted', 'Resource removed permanently', 'success');
    } catch (err: any) {
      showAlert('Delete Failed', err.message, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const showAlert = (title: string, msg: string, type: 'success' | 'danger') => {
    setAlertState({ open: true, title, msg, type });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setContextFilter('ALL');
  };

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> System Exception
          </h1>
          <button 
            onClick={fetchResources}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={error} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-24 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      
      <LibraryHeader totalCount={resources.length} />

      <ResourceToolbar 
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        contextFilter={contextFilter}
        contexts={contexts}
        isLoading={loading}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onContextChange={setContextFilter}
        onRefresh={fetchResources}
      />

      <div className="min-h-[500px]">
        <ResourceList 
          resources={resources}
          isLoading={loading}
          onDelete={setDeleteId}
          onEdit={setEditingResource}
          onClearFilters={handleClearFilters}
        />
      </div>

      <EditResourceModal 
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        resource={editingResource}
        onSave={handleEditSave}
        isLoading={isProcessing}
        media={media}
      />

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resource?"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete Permanently"
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