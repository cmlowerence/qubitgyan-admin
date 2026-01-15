'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileStack,
  LibraryBig,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  // --- Effects ---

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 300);
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

  // --- Render ---

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <LibraryBig className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            Global Library
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-2 max-w-xl leading-relaxed">
            Search and manage your entire content database from one command center.
          </p>
        </div>
        
        {/* Stats - Horizontal on mobile, Stacked on Desktop */}
        <div className="flex items-center md:block gap-3 md:text-right bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl">
          <span className="text-2xl md:text-3xl font-black text-slate-800">{resources.length}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 md:ml-0 md:block">
            Visible Files
          </span>
        </div>
      </div>

      {/* 2. Responsive Toolbar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl p-4 -mx-4 md:mx-0 md:p-4 rounded-b-2xl md:rounded-2xl border-b md:border border-slate-200 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Bar - Full width on mobile */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-10 pr-4 py-3 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters - Grid on mobile, Row on desktop */}
          <div className="grid grid-cols-[1fr_1fr_auto] md:flex gap-2">
            
            {/* Type Filter */}
            <div className="relative">
              <select 
                className="w-full pl-3 pr-8 py-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50 shadow-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="PDF">PDF Docs</option>
                <option value="VIDEO">Videos</option>
                <option value="LINK">Links</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Context Filter */}
            <div className="relative">
              <select 
                className="w-full pl-3 pr-8 py-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50 shadow-sm"
                value={contextFilter}
                onChange={(e) => setContextFilter(e.target.value)}
              >
                <option value="ALL">All Tags</option>
                {contexts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button 
              onClick={fetchResources}
              className="px-4 bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center shadow-sm active:scale-95"
              title="Refresh List"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Resource Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Scanning database...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 mx-4 md:mx-0">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold">No resources found</h3>
            <p className="text-slate-500 text-sm mt-1 px-4">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => { setSearchQuery(''); setTypeFilter('ALL'); setContextFilter('ALL'); }}
              className="mt-4 text-blue-600 text-sm font-bold hover:underline"
            >
              Clear filters
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
