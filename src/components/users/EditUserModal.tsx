'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Lock, UserCog, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { User, UpdateUserPayload } from '@/services/users';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateUserPayload) => Promise<void>;
  isLoading: boolean;
  user: User | null;
}

const PREBUILT_AVATARS = [
  "https://api.dicebear.com/9.x/micah/svg?seed=Jameson",
  "https://api.dicebear.com/9.x/micah/svg?seed=Adrian",
  "https://api.dicebear.com/9.x/toon-head/svg?seed=Jameson",
  "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Brian",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar",
  "https://api.dicebear.com/9.x/toon-head/svg?seed=Kingston",
  "https://api.dicebear.com/9.x/toon-head/svg?seed=Brian",
  "https://api.dicebear.com/9.x/micah/svg?seed=Kingston",
  "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Jameson",
  "https://api.dicebear.com/9.x/toon-head/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
];

export function EditUserModal({ isOpen, onClose, onSubmit, isLoading, user }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserPayload>({
    username: '', 
    email: '',
    first_name: '',
    last_name: '',
    profile: { avatar_url: '' }
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile: { avatar_url: user.avatar_url || '' }
      });
      setNewPassword(''); 
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Final sync before submission
    const payload: UpdateUserPayload = { 
      ...formData,
      username: formData.email,
      // always include profile.avatar_url ('' = clear)
      profile: { avatar_url: formData.profile?.avatar_url ?? '' }
    };

    if (newPassword) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      payload.password = newPassword;
    }

    onSubmit(user.id, payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 shrink-0">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-indigo-600" />
            Edit Profile: <span className="text-slate-500 font-mono text-sm">{user.email}</span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Names Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">First Name</label>
              <input 
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500" 
                value={formData.first_name} 
                onChange={e => setFormData({ ...formData, first_name: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Last Name</label>
              <input 
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500" 
                value={formData.last_name} 
                onChange={e => setFormData({ ...formData, last_name: e.target.value })} 
                required 
              />
            </div>
          </div>

          {/* Email Address (Primary Identity) */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email Address</label>
            <input 
              type="email"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value, username: e.target.value })} 
              required 
            />
            <p className="text-[10px] text-slate-400 mt-1 italic">Updating the email will also update the system username.</p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Avatar Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Profile Picture
            </label>
            
            <input 
              type="url"
              placeholder="Paste image URL here..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500" 
              value={formData.profile?.avatar_url || ''} 
              onChange={e => setFormData({ 
                ...formData, 
                profile: { ...formData.profile, avatar_url: e.target.value } 
              })} 
            />

            <div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {PREBUILT_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      profile: { ...formData.profile, avatar_url: url } 
                    })}
                    className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                      formData.profile?.avatar_url === url 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-110' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    {formData.profile?.avatar_url === url && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Security (Password Reset) */}
          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20 space-y-2">
            <label className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase flex items-center gap-2">
              <Lock className="w-3 h-3" /> Change Password
            </label>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Leave blank to keep current password.
            </p>
            <input 
              type="password"
              placeholder="Enter new password..."
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800 rounded-lg text-sm outline-none focus:border-orange-500" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              minLength={6}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}