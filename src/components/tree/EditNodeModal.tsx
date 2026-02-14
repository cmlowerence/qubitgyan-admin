// src/components/tree/EditNodeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { KnowledgeNode, UpdateNodePayload } from '@/types/tree';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateNodePayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>; // Pass delete capability here too
  node: KnowledgeNode | null;
  isLoading: boolean;
}

export default function EditNodeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  node, 
  isLoading 
}: EditNodeModalProps) {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Load node data when modal opens
  useEffect(() => {
    if (node) {
      setName(node.name);
      setThumbnail(node.thumbnail_url || '');
      setOrder(node.order);
      setIsActive(node.is_active);
    }
  }, [node]);

  if (!isOpen || !node) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(node.id, {
      name,
      thumbnail_url: thumbnail || undefined,
      order,
      is_active: isActive
    });
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${node.name}"?\nThis action cannot be undone.`)) {
      await onDelete(node.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-800">Edit {node.node_type}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          {/* Order & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
              <div 
                onClick={() => setIsActive(!isActive)}
                className={`cursor-pointer w-full p-2.5 border rounded-lg flex items-center gap-2 ${isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
              >
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">{isActive ? 'Active' : 'Hidden'}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
            
            {/* Delete Button (Left) */}
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
              title="Delete Node"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Save Button (Right - Expands) */}
            <button
              type="submit"
              disabled={isLoading || !name}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
