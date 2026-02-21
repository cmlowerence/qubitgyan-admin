'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Link as LinkIcon, Save, Loader2 } from 'lucide-react';
import { createCourse, updateCourse, Course } from '@/services/courses';
import { getKnowledgeTree } from '@/services/tree';
import { KnowledgeNode } from '@/types/tree';
import SupabaseMediaPicker from '@/components/media/SupabaseMediaPicker';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Course | null; // If present, we are in Edit mode
}

export default function CourseModal({ isOpen, onClose, onSuccess, initialData }: CourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    root_node: '',
  });
  
  const [rootNodes, setRootNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      loadRootNodes();
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          thumbnail_url: initialData.thumbnail_url || '',
          root_node: initialData.root_node.toString(),
        });
      } else {
        setFormData({ title: '', description: '', thumbnail_url: '', root_node: '' });
      }
    }
  }, [isOpen, initialData]);

  const loadRootNodes = async () => {
    try {
      const nodes = await getKnowledgeTree(1); // Assuming depth 1 gets the root domains
      setRootNodes(nodes);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      root_node: Number(formData.root_node),
      thumbnail_url: formData.thumbnail_url || undefined
    };

    try {
      if (isEdit && initialData) {
        await updateCourse(initialData.id, payload);
      } else {
        await createCourse({ ...payload, is_published: false });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom duration-300 sm:duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
            <input 
              type="text" required 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="e.g. TGT Non-Medical Physics"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea 
              required rows={3} 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
              placeholder="Summarize the course goals..."
            />
          </div>

          <SupabaseMediaPicker 
            value={formData.thumbnail_url} 
            onChange={(url) => setFormData({...formData, thumbnail_url: url})} 
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Root Knowledge Node</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select 
                required 
                value={formData.root_node} 
                onChange={(e) => setFormData({...formData, root_node: e.target.value})} 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="" disabled>Select a Top-Level Folder</option>
                {rootNodes.map((node) => (
                  <option key={node.id} value={node.id}>{node.name} ({node.node_type})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors order-2 sm:order-1">Cancel</button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}