'use client';

import { useEffect, useState, useMemo } from 'react';
import { getMediaList, getStorageStatus, uploadMedia, deleteMedia, bulkDeleteMedia, UploadedMedia, StorageStatus } from '@/services/media';
import { Image as ImageIcon, UploadCloud, Trash2, HardDrive, AlertTriangle, Copy, Check, Maximize2, Search, Filter, RefreshCw } from 'lucide-react';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';
import DebugConsole from '@/components/debug/DebugConsole';

export default function MediaManagerPage() {
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pageError, setPageError] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const [filenameInput, setFilenameInput] = useState('');
  const [filenameError, setFilenameError] = useState('');
  const [categoryInput, setCategoryInput] = useState<string>('General');
  const CATEGORY_OPTIONS = ['General','Thumbnails','Avatars','Banners','Other'] as const;

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({ open: false, title: '', msg: '', type: 'success' });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const [mediaData, statusData] = await Promise.all([
        getMediaList(),
        getStorageStatus()
      ]);
      setMedia(mediaData);
      setStatus(statusData);
    } catch (err: any) {
      setPageError(err);
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
      } catch (e) {}

      setFilenameInput('');
      setAlertState({ open: true, title: 'Uploaded', msg: 'Media uploaded successfully.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Upload failed', msg: err.message || 'Upload failed', type: 'danger' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setLoading(true);
      await deleteMedia(confirmDeleteId);
      setConfirmDeleteId(null);
      setSelectedIds(prev => prev.filter(id => id !== confirmDeleteId));
      await loadData();
      setAlertState({ open: true, title: 'Deleted', msg: 'Media deleted successfully.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Delete failed', msg: err.message || 'Failed to delete media.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

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
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedia.map(item => item.id));
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await bulkDeleteMedia(selectedIds);
      setIsBulkDeleteModalOpen(false);
      const count = selectedIds.length;
      setSelectedIds([]);
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-indigo-500" />
        <p className="font-bold tracking-widest uppercase text-xs sm:text-sm animate-pulse">Connecting to Storage...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Storage Exception
          </h1>
          <button 
            onClick={loadData}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={pageError} />
      </div>
    );
  }

  const usagePercentage = Number(status?.usage_percentage ?? status?.percentage_used ?? 0);
  const usedBytes = Number(status?.used_bytes ?? 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Media Library</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Manage course thumbnails and system assets.</p>
          </div>
        </div>
      </div>

      {status && (
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-4">
            <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-black text-sm sm:text-base tracking-tight">
              <HardDrive className="w-5 h-5 text-indigo-500" />
              Supabase Bucket Usage
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-max">
              {status.formatted_used || `${(usedBytes / 1024 / 1024).toFixed(2)} MB`} / {status.formatted_limit || '1 GB'}
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 85 ? 'bg-rose-500' : usagePercentage > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {usagePercentage > 85 && (
            <div className="flex items-center gap-2 mt-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl border border-rose-100 dark:border-rose-800/50">
              <AlertTriangle className="w-4 h-4 shrink-0" /> 
              <p className="text-xs sm:text-sm font-bold">Storage is almost full. Please clear unused media to prevent upload failures.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 lg:sticky lg:top-28 transition-colors">
            <h2 className="font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2.5 text-lg">
              <UploadCloud className="w-5 h-5 text-indigo-500" /> Upload Media
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block ml-1">Filename</label>
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
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
                />
                {filenameError ? (
                  <p className="text-[10px] sm:text-xs text-rose-500 mt-2 font-bold ml-1">{filenameError}</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-2 font-medium ml-1 leading-tight">Include extension or leave blank to auto-detect.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                <div className="relative">
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-400" />
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading || !!filenameError || !filenameInput.trim()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <div className={`bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 h-48 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:border-indigo-400 dark:group-hover:border-indigo-600 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                  <UploadCloud className={`w-10 h-10 text-indigo-400 dark:text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${uploading ? 'animate-bounce text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <p className="font-black text-indigo-900 dark:text-indigo-100 text-sm sm:text-base text-center tracking-tight">
                    {uploading ? 'Uploading...' : 'Select or Drop File'}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-600/60 dark:text-indigo-400/60 mt-2 text-center">Max 5MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 group min-w-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search filename..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
              <div className="relative shrink-0 w-full sm:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-400" />
              </div>
            </div>

            {filteredMedia.length > 0 && (
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleSelectAll} 
                  className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-4 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {selectedIds.length === filteredMedia.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedIds.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {filteredMedia.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-sm">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">No imagery found.</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upload new media or adjust your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredMedia.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-sm border overflow-hidden flex flex-col group relative transition-all duration-300 ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-500/30' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg'}`}
                  >
                    <div className={`absolute top-3 left-3 z-20 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}>
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(item.id)}
                          className="w-6 h-6 rounded-lg border-2 border-white dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer shadow-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm appearance-none checked:bg-indigo-600 checked:border-indigo-600 transition-colors"
                        />
                        {isSelected && <Check className="w-4 h-4 text-white absolute pointer-events-none" />}
                      </div>
                    </div>

                    <div 
                      className="aspect-square bg-slate-50 dark:bg-slate-950 relative p-3 flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => toggleSelection(item.id)}
                    >
                      <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] bg-[url('https://transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-0" />
                      <img 
                        src={item.file} 
                        alt={item.filename || `Media ${item.id}`} 
                        className={`max-w-full max-h-full object-contain drop-shadow-md rounded-xl relative z-10 transition-transform duration-500 ${isSelected ? 'scale-95' : 'group-hover:scale-105'}`} 
                      />
                      
                      {!isSelected && (
                        <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setPreviewImage(item.file); }}
                              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-xl transition-all backdrop-blur-md hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                              title="Preview Full Size"
                            >
                              <Maximize2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.file, item.id); }}
                              className="p-3 bg-indigo-500/80 hover:bg-indigo-600 text-white rounded-xl transition-all backdrop-blur-md hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                              title="Copy URL"
                            >
                              {copiedId === item.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-3 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl transition-all backdrop-blur-md hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                            title="Delete File"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title={item.filename || item.file.split('/').pop()}>
                        {item.filename || item.file.split('/').pop()}
                      </p>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                          {item.category || 'Uncategorized'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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

      {previewImage && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-950/90 dark:bg-black/90 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
          />
          <div className="absolute bottom-8 text-white/70 text-xs font-black uppercase tracking-widest bg-black/50 px-6 py-3 rounded-full backdrop-blur-md pointer-events-none">
            Click anywhere to close
          </div>
        </div>
      )}

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