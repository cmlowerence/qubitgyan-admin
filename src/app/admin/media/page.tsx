'use client';

import { useEffect, useState, useMemo } from 'react';
import { getMediaList, getStorageStatus, uploadMedia, deleteMedia, bulkDeleteMedia, UploadedMedia, StorageStatus } from '@/services/media';
import { Image as ImageIcon, UploadCloud, Trash2, HardDrive, AlertTriangle, Copy, Check, Maximize2, Search, Filter } from 'lucide-react';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function MediaManagerPage() {
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Filename & Category inputs for uploads
  const [filenameInput, setFilenameInput] = useState('');
  const [filenameError, setFilenameError] = useState('');
  const [categoryInput, setCategoryInput] = useState<string>('General');
  const CATEGORY_OPTIONS = ['General','Thumbnails','Avatars','Banners','Other'] as const;

  // Interaction States
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({ open: false, title: '', msg: '', type: 'success' });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Bulk Delete States
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [mediaData, statusData] = await Promise.all([
        getMediaList(),
        getStorageStatus()
      ]);
      setMedia(mediaData);
      setStatus(statusData);
    } catch (err: any) {
      setError(err.message || 'Failed to load media gallery.');
    } finally {
      setLoading(false);
    }
  };

  const validateAndNormalizeFilename = (name: string, file?: File) => {
    const trimmed = name.trim();
    if (!trimmed) return { valid: false, error: 'Filename cannot be empty.' };
    if (trimmed.length > 150) return { valid: false, error: 'Filename is too long (max 150 chars).' };
    if (/[\\/]/.test(trimmed)) return { valid: false, error: 'Filename must not contain path separators.' };
    if (!/^[A-Za-z0-9_.-]+$/.test(trimmed)) return { valid: false, error: 'Only letters, numbers, dot, hyphen and underscore allowed (no spaces).' };

    if (!/\.[A-Za-z0-9]{1,6}$/.test(trimmed)) {
      if (!file) return { valid: false, error: 'Please include a file extension (e.g. .jpg) or upload a file to infer it.' };
      const parts = file.name.split('.');
      const ext = parts.length > 1 ? parts.pop() : '';
      if (!ext) return { valid: false, error: 'Cannot infer file extension; add it to the filename.' };
      return { valid: true, normalized: `${trimmed}.${ext}` };
    }

    return { valid: true, normalized: trimmed };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { valid, normalized, error: vErr } = validateAndNormalizeFilename(filenameInput, file);
    if (!valid) {
      setFilenameError(vErr || 'Invalid filename');
      setAlertState({ open: true, title: 'Invalid filename', msg: vErr || 'Please correct the filename.', type: 'danger' });
      e.target.value = '';
      return;
    }
    setFilenameError('');

    if (file.size > 5 * 1024 * 1024) {
      setAlertState({ open: true, title: 'File too large', msg: 'Please select an image under 5MB.', type: 'danger' });
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      const uploaded = await uploadMedia(file, normalized, categoryInput);

      setMedia(prev => [uploaded, ...prev]);

      try {
        const s = await getStorageStatus();
        setStatus(s);
      } catch (e) { /* non-critical */ }

      setFilenameInput('');
      setAlertState({ open: true, title: 'Uploaded', msg: 'Media uploaded successfully.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Upload failed', msg: err.message || 'Upload failed', type: 'danger' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Restored individual delete handler
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setLoading(true);
      await deleteMedia(confirmDeleteId);
      setConfirmDeleteId(null);
      
      // Also remove from selectedIds if it was selected
      setSelectedIds(prev => prev.filter(id => id !== confirmDeleteId));
      
      await loadData();
      setAlertState({ open: true, title: 'Deleted', msg: 'Media deleted successfully.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Delete failed', msg: err.message || 'Failed to delete media.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Bulk Delete Functions
  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredMedia = useMemo(() => {
    return media.filter(item => {
      const matchesSearch = (item.filename || item.file).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [media, searchQuery, filterCategory]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([]); // Deselect all if all are currently selected
    } else {
      setSelectedIds(filteredMedia.map(item => item.id)); // Select all currently visible
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await bulkDeleteMedia(selectedIds);
      setIsBulkDeleteModalOpen(false);
      
      const count = selectedIds.length;
      setSelectedIds([]); // Clear selections
      await loadData();
      
      setAlertState({ open: true, title: 'Bulk Delete Successful', msg: `Successfully deleted ${count} items.`, type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Bulk Delete failed', msg: err.message || 'Failed to delete media files.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && !media.length) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Connecting to Supabase Storage...</div>;
  }

  const usagePercentage = Number(status?.usage_percentage ?? status?.percentage_used ?? 0);
  const usedBytes = Number(status?.used_bytes ?? 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <ImageIcon className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Media Library</h1>
          <p className="text-gray-500 text-xs md:text-sm">Manage course thumbnails and image assets.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Storage Status Widget */}
      {status && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-3">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
              <HardDrive className="w-4 h-4 text-gray-400" />
              Supabase Bucket Usage
            </div>
            <div className="text-sm font-medium text-gray-500">
              {status.formatted_used || `${(usedBytes / 1024 / 1024).toFixed(2)} MB`} / {status.formatted_limit || '1 GB'}
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${usagePercentage > 85 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-amber-400' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {usagePercentage > 85 && (
            <p className="text-xs text-red-500 flex items-center gap-1.5 mt-3 bg-red-50 p-2 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5" /> Storage is almost full. Please clear unused media.
            </p>
          )}
        </div>
      )}

      {/* Two-Column Layout for Desktop, Stacked for Mobile */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar: Upload Zone */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" /> Upload New File
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Filename</label>
                <input
                  type="text"
                  placeholder="e.g. hero-banner.jpg"
                  value={filenameInput}
                  onChange={e => {
                    setFilenameInput(e.target.value);
                    const v = e.target.value.trim();
                    if (!v) setFilenameError('');
                    else if (v.length > 150) setFilenameError('Too long (max 150 chars).');
                    else if (!/^[A-Za-z0-9_.-]*$/.test(v)) setFilenameError('Only letters/numbers/./-/_ allowed.');
                    else setFilenameError('');
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                {filenameError ? (
                  <p className="text-[11px] text-red-500 mt-1.5 font-medium">{filenameError}</p>
                ) : (
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">Include extension (or leave off to auto-detect).</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center p-6 mt-2 hover:bg-blue-50 hover:border-blue-400 transition-colors relative group cursor-pointer h-40">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading || !!filenameError || !filenameInput.trim()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <UploadCloud className={`w-8 h-8 text-blue-400 mb-3 group-hover:text-blue-600 transition-colors ${uploading ? 'animate-bounce text-blue-600' : ''}`} />
                <p className="font-semibold text-blue-900 text-sm text-center">{uploading ? 'Uploading...' : 'Select File'}</p>
                <p className="text-[11px] text-blue-600/70 mt-1 text-center">Max 5MB. Requires filename.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Gallery */}
        <div className="flex-1 space-y-4">
          
          {/* Gallery Controls (Search, Filter, & Bulk Actions) */}
          <div className="flex flex-col xl:flex-row gap-3 justify-between items-start xl:items-center">
            
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative shrink-0 w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {/* Bulk Actions Menu */}
            {filteredMedia.length > 0 && (
              <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end bg-white p-1.5 rounded-lg border border-gray-200">
                <button 
                  onClick={handleSelectAll} 
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 transition-colors"
                >
                  {selectedIds.length === filteredMedia.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedIds.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Image Grid */}
          {filteredMedia.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col group relative transition-all duration-200 ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'}`}
                  >
                    {/* Bulk Select Checkbox */}
                    <div className={`absolute top-2 left-2 z-10 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm bg-white"
                      />
                    </div>

                    {/* Image Viewport */}
                    <div 
                      className="aspect-square bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-gray-50 relative p-2 flex items-center justify-center cursor-pointer"
                      onClick={() => toggleSelection(item.id)} // Allow clicking the whole image to select it
                    >
                      <img 
                        src={item.file} 
                        alt={item.filename || `Media ${item.id}`} 
                        className="max-w-full max-h-full object-contain drop-shadow-sm rounded" 
                      />
                      
                      {/* Hover Overlay Actions (Hidden if bulk-selecting to avoid misclicks) */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setPreviewImage(item.file); }}
                              className="p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
                              title="Preview Full Size"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.file, item.id); }}
                              className="p-2.5 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full transition-colors backdrop-blur-md"
                              title="Copy URL"
                            >
                              {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="mt-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-md"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Image Metadata */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                      <p className="text-xs font-semibold text-gray-700 truncate" title={item.filename || item.file.split('/').pop()}>
                        {item.filename || item.file.split('/').pop()}
                      </p>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                          {item.category || 'Uncategorized'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal (For Full Size Preview) */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
          />
          <p className="absolute bottom-6 text-white/50 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
            Click anywhere to close
          </p>
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Single Image?"
        message="Are you sure you want to permanently delete this image from Supabase? This will break any content currently using this URL."
        confirmText="Yes, Delete"
        type="danger"
        isLoading={loading && !!confirmDeleteId}
      />

      {/* Bulk Delete Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Images?`}
        message={`Are you sure you want to permanently delete these ${selectedIds.length} images? This action cannot be undone.`}
        confirmText="Yes, Delete All Selected"
        type="danger"
        isLoading={loading && isBulkDeleteModalOpen}
      />

      <AlertModal
        isOpen={alertState.open}
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
        title={alertState.title}
        message={alertState.msg}
        type={alertState.type === 'danger' ? 'danger' : 'success'}
      />

    </div>
  );
}