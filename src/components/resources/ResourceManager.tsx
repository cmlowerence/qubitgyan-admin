'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2, FilePlus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Resource, ResourceType } from '@/types/resource';
import { getResourcesByNode, createResource, deleteResource, updateResource, reorderResources } from '@/services/resource';
import { ResourceCard } from './ResourceCard';
import { api } from '@/lib/api'; 
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs'; 
import { EditResourceModal } from './EditResourceModal';

export function ResourceManager({ nodeId }: { nodeId: number }) {
  // Data State
  const [resources, setResources] = useState<Resource[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
  const [url, setUrl] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('');

  // Dialog & Modal States
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit State
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchContexts();
  }, [nodeId]);

  // --- Fetching ---
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
      console.error("Failed to load contexts");
    }
  };

  // --- Drag & Drop Logic ---
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

  // --- Handlers ---
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
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Upload Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 space-y-4 shadow-sm w-full">
        <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> New Resource
        </h3>
        
        {/* Responsive Grid: 1 column on mobile, 2 on medium screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          
          {/* Title Input */}
          <input 
            placeholder="Resource Title"
            className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          {/* Select Inputs Container: Stack vertically on mobile, row on small screens+ */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              className="w-full sm:flex-1 p-2.5 border rounded-lg text-sm bg-white shadow-sm" 
              value={type} 
              onChange={e => setType(e.target.value as ResourceType)}
            >
              <option value="PDF">Drive PDF</option>
              <option value="VIDEO">Video Link</option>
              <option value="LINK">External Link</option>
            </select>
            
            <select 
              className="w-full sm:flex-1 p-2.5 border rounded-lg text-sm bg-white shadow-sm text-blue-600 font-bold" 
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

        {/* URL Input */}
        <input 
          placeholder={type === 'PDF' ? "Paste Google Drive Link" : "Paste URL"} 
          className="w-full p-2.5 border rounded-lg text-sm outline-none shadow-sm" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          required 
        />
        
        {/* Submit Button */}
        <button 
          disabled={adding || !selectedContext} 
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 touch-manipulation"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add to Topic</>}
        </button>
      </form>

      {/* --- DRAGGABLE LIST --- */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-200" /></div>
        ) : resources.length === 0 ? (
          <div className="text-center p-8 md:p-12 border-2 border-dashed rounded-2xl text-slate-300 text-sm font-medium">
            No materials uploaded yet.
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="resources-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {resources.map((res, index) => (
                    <Draggable key={res.id} draggableId={res.id.toString()} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps}
                          className="w-full max-w-full" // Ensure card doesn't overflow
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

      {/* --- MODALS --- */}
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
        message="Are you sure? This cannot be undone." 
        confirmText="Delete" 
        type="danger" 
        isLoading={isDeleting} 
      />

      <EditResourceModal 
        isOpen={!!editingResource} 
        onClose={() => setEditingResource(null)} 
        resource={editingResource}
        onSave={handleEditSave}
        isLoading={isSavingEdit}
      />
    </div>
  );
}
