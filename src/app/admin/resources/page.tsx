'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileStack, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { Resource } from '@/types/resource';
import { getAllResources, deleteResource, updateResource } from '@/services/resource';
import { api } from '@/lib/api';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { EditResourceModal } from '@/components/resources/EditResourceModal';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function GlobalLibraryPage() {
  // --- State ---
  const [resources, setResources] = useState<Resource[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [contextFilter, setContextFilter] = useState('ALL');

  // Modals
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Shared for edit/delete loading
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  // --- Effects ---

  // 1. Load Contexts for the Filter Dropdown
  useEffect(() => {
    const loadContexts = async () => {
      try {
        const res = await api.get('/contexts/');
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setContexts(data);
      } catch (err) {
        console.error("Failed to load filter contexts");
      }
    };
    loadContexts();
  }, []);

  // 2. Fetch Resources whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 300); // Debounce search slightly
    return () => clearTimeout(timer);
  }, [searchQuery, typeFilter, contextFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources({
        search: searchQuery,
        type: typeFilter,
        context: contextFilter
      });
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch global resources");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleEditSave = async (id: number, payload: any) => {
    setIsProcessing(true);
    try {
      await updateResource(id, payload);
      setEditingResource(null);
      await fetchResources(); // Refresh list to show changes
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

  // --- Render ---

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20 space-y-8">
      
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <FileStack className="w-8 h-8 text-blue-600" />
            Global Resource Library
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Manage your entire content database from one place. Search, filter, and organize materials across all subjects.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-3xl font-black text-slate-800">{resources.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visible Files</p>
        </div>
      </div>

      {/* 2. Toolbar (Search & Filter) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 -mx-4 md:mx-0 md:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Search by title, folder, or context..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          
          {/* Type Filter */}
          <div className="relative min-w-[140px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select 
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="PDF">PDF Documents</option>
              <option value="VIDEO">Video Links</option>
              <option value="LINK">External URLs</option>
            </select>
          </div>

          {/* Context Filter */}
          <div className="relative min-w-[140px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select 
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50"
              value={contextFilter}
              onChange={(e) => setContextFilter(e.target.value)}
            >
              <option value="ALL">All Contexts</option>
              {contexts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={fetchResources}
            className="p-2.5 bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Resource Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium">Scanning database...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold">No resources found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setTypeFilter('ALL'); setContextFilter('ALL'); }}
              className="mt-4 text-blue-600 text-sm font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((res) => (
              <ResourceCard 
                key={res.id} 
                resource={res} 
                onDelete={(id) => setDeleteId(id)}
                onEdit={(r) => setEditingResource(r)}
                // Note: dragHandleProps is omitted here, so the Grip icon will be hidden
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Modals */}
      <EditResourceModal 
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        resource={editingResource}
        onSave={handleEditSave}
        isLoading={isProcessing}
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
