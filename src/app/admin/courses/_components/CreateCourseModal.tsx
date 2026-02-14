'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { createCourse } from '@/services/courses';
import { getKnowledgeTree } from '@/services/tree';
import { KnowledgeNode } from '@/types/tree';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [rootNodeId, setRootNodeId] = useState<string>('');
  
  const [rootNodes, setRootNodes] = useState<KnowledgeNode[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch root nodes for the dropdown when the modal opens
  useEffect(() => {
    if (isOpen) {
      loadRootNodes();
    } else {
      // Reset form on close
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setRootNodeId('');
      setError('');
    }
  }, [isOpen]);

  const loadRootNodes = async () => {
    try {
      setLoadingNodes(true);
      // By default, your /nodes/ endpoint returns parent__isnull=True items
      const nodes = await getKnowledgeTree();
      setRootNodes(nodes);
    } catch (err) {
      console.error("Failed to fetch root nodes", err);
    } finally {
      setLoadingNodes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootNodeId) {
      setError('You must select a Root Node to wrap this course around.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createCourse({
        title,
        description,
        thumbnail_url: thumbnailUrl || undefined,
        root_node: Number(rootNodeId),
        is_published: false // Default to draft
      });
      onSuccess(); // Triggers a refresh of the course list
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create course.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> 
            Create New Course
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., Complete Physics for TGT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder="What will students learn?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach Root Knowledge Node</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                required
                value={rootNodeId}
                onChange={(e) => setRootNodeId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white"
                disabled={loadingNodes}
              >
                <option value="" disabled>
                  {loadingNodes ? 'Loading nodes...' : 'Select a top-level folder...'}
                </option>
                {rootNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} (Type: {node.node_type})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This node and all its nested children/resources will become the curriculum for this course.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}