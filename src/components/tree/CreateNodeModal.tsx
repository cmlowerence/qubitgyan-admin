'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreateNodePayload, NodeType } from '@/types/tree';
import { getMediaList, UploadedMedia } from '@/services/media';
import { MediaUrlPicker } from '@/components/media/MediaUrlPicker';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNodePayload) => Promise<void>;
  isLoading: boolean;
  parentId?: number | null;
  parentType?: NodeType;
}

export default function CreateNodeModal({ isOpen, onClose, onSubmit, isLoading, parentId = null, parentType }: CreateNodeModalProps) {
  const [name, setName] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('DOMAIN');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);
  const [media, setMedia] = useState<UploadedMedia[]>([]);

  useEffect(() => {
    if (parentId) {
      if (parentType === 'DOMAIN') setNodeType('SUBJECT');
      else if (parentType === 'SUBJECT') setNodeType('SECTION');
      else setNodeType('TOPIC');
    } else setNodeType('DOMAIN');
  }, [parentId, parentType, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    getMediaList().then(setMedia).catch(() => setMedia([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, node_type: nodeType, parent: parentId, thumbnail_url: thumbnail || undefined, order });
    setName('');
    setThumbnail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{parentId ? 'Add Child Node' : 'Create New Domain'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
              <select value={nodeType} onChange={(e) => setNodeType(e.target.value as NodeType)} className="w-full p-2 bg-white border border-gray-200 rounded-lg">
                <option value="DOMAIN">Domain</option>
                <option value="SUBJECT">Subject</option>
                <option value="SECTION">Section</option>
                <option value="TOPIC">Topic</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value || '0'))} className="w-full p-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <MediaUrlPicker value={thumbnail} onChange={setThumbnail} media={media} label="Thumbnail URL / Pick from storage" placeholder="https://..." />

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading || !name} className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
