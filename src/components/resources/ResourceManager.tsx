'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2, FilePlus, AlertCircle, ListOrdered, Save, X } from 'lucide-react';
import { Resource, ResourceType } from '@/types/resource';
import { getResourcesByNode, createResource, deleteResource, reorderResources } from '@/services/resource';
import { ResourceCard } from './ResourceCard';

export function ResourceManager({ nodeId }: { nodeId: number }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchResources();
  }, [nodeId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResourcesByNode(nodeId);
      // Sort by the 'order' field from backend
      const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => a.order - b.order);
      setResources(sortedData);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const ids = resources.map(r => r.id);
      await reorderResources(ids);
      setIsSorting(false);
      fetchResources();
    } finally {
      setSavingOrder(false);
    }
  };

  const moveResource = (index: number, direction: 'up' | 'down') => {
    const newResources = [...resources];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= resources.length) return;
    
    [newResources[index], newResources[targetIndex]] = [newResources[targetIndex], newResources[index]];
    setResources(newResources);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createResource({
        title,
        resource_type: type,
        node: nodeId,
        google_drive_link: type === 'PDF' ? url : undefined,
        external_url: (type === 'VIDEO' || type === 'LINK') ? url : undefined,
      });
      setTitle(''); setUrl(''); fetchResources();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      {/* Header with Sort Toggle */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          {resources.length} Materials
        </h3>
        <button 
          onClick={() => isSorting ? handleSaveOrder() : setIsSorting(true)}
          disabled={savingOrder || resources.length < 2}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isSorting 
            ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {savingOrder ? <Loader2 className="w-3 h-3 animate-spin" /> : isSorting ? <Save className="w-3 h-3" /> : <ListOrdered className="w-3 h-3" />}
          {isSorting ? 'Save Order' : 'Reorder'}
        </button>
      </div>

      {!isSorting && (
        <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 animate-in fade-in zoom-in duration-300">
           {/* ... (Existing Form Inputs) ... */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Title" className="p-2 border rounded-lg text-sm" value={title} onChange={e => setTitle(e.target.value)} required />
              <select className="p-2 border rounded-lg text-sm bg-white" value={type} onChange={e => setType(e.target.value as ResourceType)}>
                <option value="PDF">Drive PDF</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">Link</option>
              </select>
              <input placeholder="URL" className="p-2 border rounded-lg text-sm" value={url} onChange={e => setUrl(e.target.value)} required />
           </div>
           <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Add Resource</button>
        </form>
      )}

      <div className="space-y-3">
        {resources.map((res, index) => (
          <div key={res.id} className="flex items-center gap-2">
            {isSorting && (
              <div className="flex flex-col gap-1">
                <button onClick={() => moveResource(index, 'up')} className="p-1 hover:bg-slate-100 rounded">▲</button>
                <button onClick={() => moveResource(index, 'down')} className="p-1 hover:bg-slate-100 rounded">▼</button>
              </div>
            )}
            <div className="flex-1">
              <ResourceCard resource={res} onDelete={(id) => deleteResource(id).then(fetchResources)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
