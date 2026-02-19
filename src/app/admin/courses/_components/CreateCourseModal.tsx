'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Link as LinkIcon } from 'lucide-react';
import { createCourse } from '@/services/courses';
import { getKnowledgeTree } from '@/services/tree';
import { KnowledgeNode } from '@/types/tree';
import { getMediaList, UploadedMedia } from '@/services/media';
import { MediaUrlPicker } from '@/components/media/MediaUrlPicker';

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
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadRootNodes();
      getMediaList().then(setMedia).catch(() => setMedia([]));
    } else {
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
      const nodes = await getKnowledgeTree(1);
      setRootNodes(nodes);
    } finally {
      setLoadingNodes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootNodeId) return setError('You must select a Root Node to wrap this course around.');

    setSubmitting(true);
    setError('');

    try {
      await createCourse({ title, description, thumbnail_url: thumbnailUrl || undefined, root_node: Number(rootNodeId), is_published: false });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create course.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Create New Course</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none" />
          </div>

          <MediaUrlPicker value={thumbnailUrl} onChange={setThumbnailUrl} media={media} label="Thumbnail URL / Pick from storage" placeholder="https://..." />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach Root Knowledge Node</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select required value={rootNodeId} onChange={(e) => setRootNodeId(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white" disabled={loadingNodes}>
                <option value="" disabled>{loadingNodes ? 'Loading nodes...' : 'Select a top-level folder...'}</option>
                {rootNodes.map((node) => <option key={node.id} value={node.id}>{node.name} (Type: {node.node_type})</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-50 font-medium rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50">{submitting ? 'Creating...' : 'Create Draft'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
