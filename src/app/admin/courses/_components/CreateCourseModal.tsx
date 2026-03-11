// src/app/admin/courses/_components/CreateCourseModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Link as LinkIcon, Save, Loader2, AlertTriangle } from 'lucide-react';
import { createCourse, updateCourse, Course } from '@/services/courses';
import { getKnowledgeTree } from '@/services/tree';
import { KnowledgeNode } from '@/types/tree';
import SupabaseMediaPicker from '@/components/media/SupabaseMediaPicker';
import DebugConsole from '@/components/debug/DebugConsole';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Course | null; 
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
  const [error, setError] = useState<any>(null);

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      loadRootNodes();
      setError(null);
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
      const nodes = await getKnowledgeTree(1); 
      setRootNodes(nodes);
    } catch (e: any) { 
      setError(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 border-0 sm:border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shrink-0">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {isEdit ? 'Edit Course Blueprint' : 'Construct New Course'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {error && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-xl text-sm flex items-start gap-3 text-rose-700 dark:text-rose-400 font-medium mb-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error?.message || 'An unexpected error occurred during the operation.'}</p>
              </div>
              {error?.responseData && (
                <div className="mt-2">
                  <DebugConsole error={error} />
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Title</label>
            <input 
              type="text" required 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none transition-all font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium" 
              placeholder="e.g. Advanced Thermodynamics"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Description</label>
            <textarea 
              required rows={4} 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none transition-all resize-y font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 custom-scrollbar" 
              placeholder="Outline the course objectives and target audience..."
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <SupabaseMediaPicker 
              value={formData.thumbnail_url} 
              onChange={(url) => setFormData({...formData, thumbnail_url: url})} 
              label="Course Thumbnail Cover"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Root Knowledge Domain</label>
            <div className="relative group">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select 
                required 
                value={formData.root_node} 
                onChange={(e) => setFormData({...formData, root_node: e.target.value})} 
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl appearance-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none transition-all font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="" disabled>Select Target Domain</option>
                {rootNodes.map((node) => (
                  <option key={node.id} value={node.id}>{node.name} ({node.node_type})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-400 group-focus-within:border-t-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="pt-2 sm:pt-4 flex flex-col-reverse sm:flex-row gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl sm:rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Discard
            </button>
            <button 
              type="submit" 
              disabled={loading || !formData.title.trim() || !formData.root_node} 
              className="w-full sm:flex-1 px-6 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Course Config' : 'Initialize Course'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}