'use client';

import { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

export default function ContextManagerPage() {
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contexts/');
      // Handle both paginated and non-paginated responses
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setContexts(data);
    } catch (error) {
      console.error("Failed to load contexts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      await api.post('/contexts/', { 
        name: newName, 
        description: 'Created via Admin Panel' 
      });
      setNewName('');
      loadContexts(); // Refresh list
    } catch (error) {
      alert("Failed to create context");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this context? This might affect resources tagged with it.")) return;
    try {
      await api.delete(`/contexts/${id}/`);
      loadContexts();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800">Exam Contexts</h1>
            <p className="text-xs md:text-sm text-slate-500">Manage tags for resources (JEE, NEET, etc.)</p>
          </div>
        </div>
        <button 
          onClick={loadContexts} 
          className="self-start md:self-auto p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Creation Form - Stacked on Mobile, Row on Desktop */}
      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <input 
          placeholder="New Context Name (e.g. UPSC)"
          className="flex-1 w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button 
          disabled={creating || !newName}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Add Tag</span>
        </button>
      </form>

      {/* Responsive Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {loading && contexts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            <p className="text-slate-400 text-sm mt-2">Loading tags...</p>
          </div>
        ) : contexts.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Tag className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No contexts found.</p>
            <p className="text-slate-300 text-xs">Create one above to get started.</p>
          </div>
        ) : (
          contexts.map((ctx) => (
            <div 
              key={ctx.id} 
              className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span className="font-bold text-slate-700 truncate text-sm md:text-base">
                  {ctx.name}
                </span>
              </div>
              
              <button 
                onClick={() => handleDelete(ctx.id)}
                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
                title="Delete Context"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
