// src/components/resources/ResourceManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2, FilePlus, Inbox } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Resource, ResourceType } from '@/types/resource';
import { getResourcesByNode, createResource, deleteResource, updateResource, reorderResources } from '@/services/resource';
import { getMediaList, UploadedMedia } from '@/services/media';
import { ResourceCard } from './ResourceCard';
import { api } from '@/lib/api';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs'; 
import { EditResourceModal } from './EditResourceModal';
import { MediaUrlPicker } from '@/components/media/MediaUrlPicker';

export function ResourceManager({ nodeId }: { nodeId: number }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
  const [url, setUrl] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [media, setMedia] = useState<UploadedMedia[]>([]);

  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchContexts();
    getMediaList().then(setMedia).catch(() => setMedia([]));
  }, [nodeId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResourcesByNode(nodeId);
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setResources(sorted);
    } catch (err) {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContexts = async () => {
    try {
      const response = await api.get('/contexts/');
      let data: any[] = [];
      if (Array.isArray(response.data)) data = response.data;
      else if (response.data && Array.isArray(response.data.results)) data = response.data.results;
      
      setContexts(data);
      if (data.length > 0) setSelectedContext(data[0].id.toString());
    } catch (err) {
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return; 
    if (result.destination.index === result.source.index) return;

    const newResources = Array.from(resources);
    const [movedItem] = newResources.splice(result.source.index, 1);
    newResources.splice(result.destination.index, 0, movedItem);
    
    setResources(newResources);

    try {
      const ids = newResources.map(r => r.id);
      await reorderResources(ids);
    } catch (err) {
      showAlert('Reorder Failed', 'Could not save new order.', 'danger');
      fetchResources();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContext) {
      showAlert('Missing Context', 'Please select a context.', 'danger');
      return;
    }
    setAdding(true);
    try {
      await createResource({
        title,
        resource_type: type,
        node: nodeId,
        context_ids: [parseInt(selectedContext)],
        google_drive_link: type === 'PDF' ? url : undefined,
        external_url: (type === 'VIDEO' || type === 'LINK') ? url : undefined,
      });
      setTitle('');
      setUrl('');
      await fetchResources();
      showAlert('Success', 'Resource added successfully!', 'success');
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      showAlert('Upload Failed', msg, 'danger');
    } finally {
      setAdding(false);
    }
  };

  const handleEditSave = async (id: number, data: any) => {
    setIsSavingEdit(true);
    try {
      await updateResource(id, data);
      setEditingResource(null);
      await fetchResources(); 
      showAlert('Success', 'Resource updated!', 'success');
    } catch (err: any) {
      showAlert('Update Failed', err.message, 'danger');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteResource(deleteId);
      await fetchResources();
      setDeleteId(null);
    } catch (err: any) {
      showAlert('Delete Failed', err.message, 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const showAlert = (title: string, msg: string, type: 'success' | 'danger') => {
    setAlertState({ open: true, title, msg, type });
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 shadow-sm w-full transition-all">
        <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <FilePlus className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          New Resource
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Title</label>
            <input 
              placeholder="e.g. Intro to Thermodynamics"
              className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all font-medium text-slate-800 dark:text-slate-100"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Type</label>
              <select 
                className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all font-bold text-slate-700 dark:text-slate-200 cursor-pointer appearance-none" 
                value={type} 
                onChange={e => setType(e.target.value as ResourceType)}
              >
                <option value="PDF">Drive PDF</option>
                <option value="VIDEO">Video Link</option>
                <option value="LINK">External Link</option>
              </select>
            </div>
            
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Tag</label>
              <select 
                className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all text-indigo-600 dark:text-indigo-400 font-bold cursor-pointer appearance-none" 
                value={selectedContext} 
                onChange={e => setSelectedContext(e.target.value)} 
                required
              >
                <option value="">Select Context</option>
                {Array.isArray(contexts) && contexts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <MediaUrlPicker
            value={url}
            onChange={setUrl}
            media={media}
            label={type === 'PDF' ? 'Google Drive Link / Select File' : 'External URL / Select File'}
            placeholder={type === 'PDF' ? 'Paste Google Drive Link' : 'Paste URL'}
          />
        </div>
        
        <button 
          disabled={adding || !selectedContext || !title.trim()} 
          className="w-full py-3.5 sm:py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Add Resource</>}
        </button>
      </form>

      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="flex justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 md:p-16 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl text-slate-400 dark:text-slate-500 transition-colors">
            <Inbox className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm sm:text-base font-bold tracking-wide">No materials uploaded yet.</p>
            <p className="text-xs mt-1 opacity-70">Add a resource above to get started.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="resources-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 sm:space-y-4">
                  {resources.map((res, index) => (
                    <Draggable key={res.id} draggableId={res.id.toString()} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps}
                          className="w-full max-w-full" 
                        >
                          <ResourceCard 
                            resource={res} 
                            onDelete={(id) => setDeleteId(id)}
                            onEdit={(r) => setEditingResource(r)} 
                            dragHandleProps={provided.dragHandleProps} 
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <AlertModal 
        isOpen={alertState.open} 
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))} 
        title={alertState.title} 
        message={alertState.msg} 
        type={alertState.type} 
      />
      
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
        title="Delete Resource?" 
        message="Are you sure you want to delete this resource? This action cannot be undone." 
        confirmText="Yes, Delete" 
        type="danger" 
        isLoading={isDeleting} 
      />

      <EditResourceModal 
        isOpen={!!editingResource} 
        onClose={() => setEditingResource(null)} 
        resource={editingResource}
        onSave={handleEditSave}
        isLoading={isSavingEdit}
        media={media}
      />
    </div>
  );
}