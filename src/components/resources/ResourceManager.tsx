'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2, FilePlus } from 'lucide-react';
import { Resource, ResourceType } from '@/types/resource';
import { getResourcesByNode, createResource, deleteResource } from '@/services/resource';
import { ResourceCard } from './ResourceCard';

export function ResourceManager({ nodeId }: { nodeId: number }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
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
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createResource({
        title,
        resource_type: type,
        node: nodeId,
        external_url: url
      });
      setTitle('');
      setUrl('');
      fetchResources();
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this resource?')) {
      await deleteResource(id);
      fetchResources();
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> Attach New Resource
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input 
            placeholder="Resource Title"
            className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <select 
            className="p-2.5 border rounded-lg text-sm bg-white"
            value={type}
            onChange={e => setType(e.target.value as ResourceType)}
          >
            <option value="PDF">PDF Document</option>
            <option value="VIDEO">Video Link</option>
            <option value="LINK">External Website</option>
          </select>
          <input 
            placeholder="URL (Drive, YouTube, etc.)"
            className="p-2.5 border rounded-lg text-sm outline-none"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
        </div>
        <button 
          disabled={adding}
          className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Resource</>}
        </button>
      </form>

      {/* Resource List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
        ) : resources.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed rounded-2xl text-slate-400 text-sm">
            No resources attached to this topic yet.
          </div>
        ) : (
          resources.map(res => (
            <ResourceCard key={res.id} resource={res} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
