'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ContextHeader from './_components/ContextHeader';
import CreateContextForm from './_components/CreateContextForm';
import ContextList from './_components/ContextList';

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
      loadContexts();
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
      <ContextHeader 
        isLoading={loading} 
        onRefresh={loadContexts} 
      />
      
      <CreateContextForm 
        newName={newName}
        isCreating={creating}
        onNameChange={setNewName}
        onSubmit={handleCreate}
      />

      <ContextList 
        contexts={contexts}
        isLoading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
