'use client';

import { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, Loader2, Save } from 'lucide-react';
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
    if (!confirm("Delete this context?")) return;
    try {
      await api.delete(`/contexts/${id}/`);
      loadContexts();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-50 rounded-xl">
          <Tag className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Program Contexts</h1>
          <p className="text-sm text-slate-500">Manage exam categories (JEE, NEET, etc.)</p>
        </div>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleCreate} className="flex gap-2 p-4 bg-white border rounded-xl shadow-sm">
        <input 
          placeholder="New Context Name (e.g. UPSC)"
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button 
          disabled={creating || !newName}
          className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
        ) : contexts.length === 0 ? (
          <div className="col-span-full text-center p-8 text-slate-400">No contexts found.</div>
        ) : (
          contexts.map((ctx) => (
            <div key={ctx.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700">{ctx.name}</span>
              <button 
                onClick={() => handleDelete(ctx.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
