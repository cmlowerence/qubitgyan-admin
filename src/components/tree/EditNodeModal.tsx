'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Trash2 } from 'lucide-react';
import { KnowledgeNode, UpdateNodePayload } from '@/types/tree';
import { getMediaList, UploadedMedia } from '@/services/media';
import { MediaUrlPicker } from '@/components/media/MediaUrlPicker';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateNodePayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  node: KnowledgeNode | null;
  isLoading: boolean;
}

export default function EditNodeModal({ isOpen, onClose, onSubmit, onDelete, node, isLoading }: EditNodeModalProps) {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [media, setMedia] = useState<UploadedMedia[]>([]);

  useEffect(() => {
    if (node) {
      setName(node.name);
      setThumbnail(node.thumbnail_url || '');
      setOrder(node.order);
      setIsActive(node.is_active);
    }
  }, [node]);

  useEffect(() => {
    if (!isOpen) return;
    getMediaList().then(setMedia).catch(() => setMedia([]));
  }, [isOpen]);

  if (!isOpen || !node) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(node.id, { name, thumbnail_url: thumbnail || undefined, order, is_active: isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-800">Edit {node.node_type}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value || '0'))} className="w-full p-2.5 border border-gray-200 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
              <div onClick={() => setIsActive(!isActive)} className={`cursor-pointer w-full p-2.5 border rounded-lg flex items-center gap-2 ${isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">{isActive ? 'Active' : 'Hidden'}</span>
              </div>
            </div>
          </div>

          <MediaUrlPicker value={thumbnail} onChange={setThumbnail} media={media} label="Thumbnail URL / Pick from storage" placeholder="https://..." />

          <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
            <button type="button" onClick={() => onDelete(node.id)} className="px-4 py-2.5 text-red-600 bg-red-50 rounded-lg flex items-center gap-2" title="Delete Node">
              <Trash2 className="w-5 h-5" />
            </button>
            <button type="submit" disabled={isLoading || !name} className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
