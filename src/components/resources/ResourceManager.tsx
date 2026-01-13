'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2, FilePlus, Tag } from 'lucide-react';
import { Resource, ResourceType } from '@/types/resource';
import { getResourcesByNode, createResource, deleteResource } from '@/services/resource';
import { ResourceCard } from './ResourceCard';
import { api } from '@/lib/api'; 

export function ResourceManager({ nodeId }: { nodeId: number }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
  const [url, setUrl] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('');

  useEffect(() => {
    fetchResources();
    fetchContexts();
  }, [nodeId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResourcesByNode(nodeId);
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContexts = async () => {
    try {
      const response = await api.get('/contexts/');
      console.log("📥 Raw Context Data:", response.data); // DEBUG: Check console to see what backend sent

      let data: any[] = [];
      
      // 1. Handle Simple Array (Pagination Disabled)
      if (Array.isArray(response.data)) {
        data = response.data;
      } 
      // 2. Handle Django Pagination (Pagination Enabled: { count: x, results: [...] })
      else if (response.data && Array.isArray(response.data.results)) {
        console.log("⚠️ Detected Paginated Response. Extracting results...");
        data = response.data.results;
      }

      setContexts(data);
      
      // Auto-select the first context so the button is enabled immediately
      if (data.length > 0) {
        setSelectedContext(data[0].id.toString());
      } else {
        console.warn("❌ No contexts found in the data array.");
      }
    } catch (err) {
      console.error("Failed to load contexts:", err);
      setContexts([]);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 'Add' Button Clicked. Starting upload..."); // DEBUG: Proof the button works

    if (!selectedContext) {
      alert("Please select a context (JEE/NEET) first.");
      return;
    }

    setAdding(true);
    try {
      const payload = {
        title,
        resource_type: type,
        node: nodeId,
        context_ids: [parseInt(selectedContext)],
        google_drive_link: type === 'PDF' ? url : undefined,
        external_url: (type === 'VIDEO' || type === 'LINK') ? url : undefined,
      };

      console.log("📦 Sending Payload:", payload); // DEBUG: See exactly what we are sending
      await createResource(payload);
      
      setTitle('');
      setUrl('');
      fetchResources();
      alert("Resource added successfully!");
    } catch (err: any) {
      console.error("Upload Error:", err);
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert(`Upload Failed: ${msg}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> New Resource
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input 
            placeholder="Resource Title"
            className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          
          <div className="flex gap-2">
            <select 
              className="flex-1 p-2.5 border rounded-lg text-sm bg-white shadow-sm"
              value={type}
              onChange={e => setType(e.target.value as ResourceType)}
            >
              <option value="PDF">Drive PDF</option>
              <option value="VIDEO">Video Link</option>
              <option value="LINK">External Link</option>
            </select>

            <select 
              className="flex-1 p-2.5 border rounded-lg text-sm bg-white shadow-sm text-blue-600 font-bold"
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

        <input 
          placeholder={type === 'PDF' ? "Paste Google Drive Link" : "Paste URL"}
          className="w-full p-2.5 border rounded-lg text-sm outline-none shadow-sm"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />

        <button 
          // If contexts are missing or not selected, this button stays DISABLED
          disabled={adding || !selectedContext}
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add to Topic</>}
        </button>
        
        {/* Helper Message to explain why button is disabled */}
        {(!selectedContext || contexts.length === 0) && (
          <p className="text-[10px] text-red-500 font-bold text-center italic animate-pulse">
            {contexts.length === 0 
              ? "Loading contexts... (If stuck, check console logs)" 
              : "Please select a context from the list to enable the button."}
          </p>
        )}
      </form>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-200" /></div>
        ) : (Array.isArray(resources) && resources.length > 0) ? (
          resources.map(res => (
            <ResourceCard key={res.id} resource={res} onDelete={(id) => deleteResource(id).then(fetchResources)} />
          ))
        ) : (
          <div className="text-center p-12 border-2 border-dashed rounded-2xl text-slate-300 text-sm font-medium">
            No materials uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
