// src/app/admin/media/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getMediaList, getStorageStatus, uploadMedia, deleteMedia, UploadedMedia, StorageStatus } from '@/services/media';
import { Image as ImageIcon, UploadCloud, Trash2, HardDrive, AlertTriangle } from 'lucide-react';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function MediaManagerPage() {
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Filename input for uploads (backend requires both file + filename)
  const [filenameInput, setFilenameInput] = useState('');
  const [filenameError, setFilenameError] = useState('');
  // Confirm / Alert UI state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({ open: false, title: '', msg: '', type: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch both the images and the storage status simultaneously
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
    // allow letters, numbers, hyphen, underscore and dot (no spaces)
    if (!/^[A-Za-z0-9_.-]+$/.test(trimmed)) return { valid: false, error: 'Only letters, numbers, dot, hyphen and underscore allowed (no spaces).' };

    // ensure extension is present; if missing, try to infer from uploaded file
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

    // Optional client-side size validation (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlertState({ open: true, title: 'File too large', msg: 'Please select an image under 5MB.', type: 'danger' });
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      await uploadMedia(file, normalized);
      setFilenameInput('');
      await loadData(); // Refresh gallery and storage status
      setAlertState({ open: true, title: 'Uploaded', msg: 'Media uploaded successfully.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Upload failed', msg: err.message || 'Upload failed', type: 'danger' });
    } finally {
      setUploading(false);
      // Clear the file input
      e.target.value = '';
    }
  };

  // open confirm dialog (user must confirm)
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setLoading(true);
      await deleteMedia(confirmDeleteId);
      setConfirmDeleteId(null);
      await loadData(); // Refresh gallery and storage status
      setAlertState({ open: true, title: 'Deleted', msg: 'Media deleted successfully.', type: 'success' });
    } catch (err: any) {
      const msg = err.message || 'Failed to delete media.';
      setAlertState({ open: true, title: 'Delete failed', msg, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !media.length) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Connecting to Supabase Storage...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <ImageIcon className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
          <p className="text-gray-500 text-sm">Manage course thumbnails and image assets.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* 1. Storage Status Widget */}
      {status && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <HardDrive className="w-5 h-5 text-gray-400" />
              Supabase Bucket Usage
            </div>
            <div className="text-sm font-medium text-gray-500">
              {status.formatted_used || `${(status.used_bytes / 1024 / 1024).toFixed(2)} MB`} / {status.formatted_limit || '1 GB'}
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${status.usage_percentage > 85 ? 'bg-red-500' : status.usage_percentage > 60 ? 'bg-amber-400' : 'bg-green-500'}`} 
              style={{ width: `${Math.min(status.usage_percentage, 100)}%` }}
            ></div>
          </div>
          
          {status.usage_percentage > 85 && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
              <AlertTriangle className="w-3 h-3" /> Storage is almost full. Super Admins should delete unused media.
            </p>
          )}
        </div>
      )}

      {/* 2. Upload Zone & Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Upload Button Card */}
        <div className="col-span-1">
          <div className="mb-3">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Filename</label>
            <input
              type="text"
              placeholder="e.g. course-thumbnail-hero.jpg"
              value={filenameInput}
              onChange={e => {
                setFilenameInput(e.target.value);
                const v = e.target.value.trim();
                if (!v) setFilenameError('');
                else if (v.length > 150) setFilenameError('Too long (max 150 chars).');
                else if (!/^[A-Za-z0-9_.-]*$/.test(v)) setFilenameError('Only letters, numbers, dot, hyphen and underscore allowed (no spaces).');
                else setFilenameError('');
              }}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
            {filenameError ? (
              <p className="text-[11px] text-red-500 mt-1">{filenameError}</p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1 italic">Provide a filename (letters, numbers, dash, underscore, dot). If you omit an extension it'll be inferred from the uploaded file.</p>
            )
          }
          </div>

          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 min-h-[200px] hover:bg-gray-100 hover:border-blue-400 transition-colors relative group cursor-pointer">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading || !!filenameError || !filenameInput.trim()}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <UploadCloud className={`w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors ${uploading ? 'animate-bounce text-blue-500' : ''}`} />
            <p className="font-semibold text-gray-700 text-center">{uploading ? 'Uploading...' : 'Click or Drag to Upload'}</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>

        {/* Image Grid */}
        {media.map((item) => (
          <div key={item.id} className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group relative">
            <div className="h-40 bg-gray-100 relative">
              <img src={item.file} alt={`Media ${item.id}`} className="w-full h-full object-cover" />
              
              {/* Overlay with Delete Action */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                  title="Delete from Supabase"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
              <span className="truncate max-w-[150px] font-medium text-gray-700" title={item.file.split('/').pop()}>
                {item.filename || item.file.split('/').pop()}
              </span>
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

      </div>

      {/* Confirm & Alert Modals (use project UI, not window.alert/confirm) */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete File?"
        message="Are you sure you want to permanently delete this image from Supabase? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        isLoading={loading && !!confirmDeleteId}
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