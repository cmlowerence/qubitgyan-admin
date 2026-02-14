'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2, Shield, GraduationCap, AlertCircle, Image as ImageIcon, Check } from 'lucide-react';
import { CreateUserPayload, User } from '@/services/users';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload) => Promise<void>;
  isLoading: boolean;
  currentUser: User | null;
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

export function CreateUserModal({ isOpen, onClose, onSubmit, isLoading, currentUser }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserPayload>({
    username: '', 
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_staff: false,
    profile: {
      avatar_url: ''
    }
  });
  
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        is_staff: false,
        profile: { avatar_url: '' }
      });
      setConfirmPass('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }
    const finalData = {
      ...formData,
      username: formData.email 
    };

    onSubmit(finalData);
  };

  const isSuperUser = currentUser?.is_superuser || false;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 shrink-0">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Add New User
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Role Toggle */}
          <div className={`grid gap-3 mb-2 ${isSuperUser ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_staff: false })}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                !formData.is_staff 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-xs font-bold">Student Account</span>
            </button>
            
            {isSuperUser && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_staff: true })}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  formData.is_staff 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300'
                }`}
              >
                <Shield className="w-6 h-6" />
                <span className="text-xs font-bold">Staff / Admin</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">First Name</label>
              <input className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Last Name</label>
              <input className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} required />
            </div>
          </div>

          {/* Email serves as Username */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email Address</label>
            <input 
              type="email" 
              placeholder="user@example.com"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value, username: e.target.value })} 
              required 
            />
            <p className="text-[10px] text-slate-400 mt-1 italic">This email will be used for both login and identity.</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Profile Picture
            </label>
            
            <input 
              type="url"
              placeholder="Paste image URL here..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" 
              value={formData.profile?.avatar_url || ''} 
              onChange={e => setFormData({ 
                ...formData, 
                profile: { ...formData.profile, avatar_url: e.target.value }
              })} 
            />

            <div>
              <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-wider">Or choose a preset:</p>
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
                        ? 'border-blue-500 ring-2 ring-blue-500/20 scale-110' 
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Password</label>
              <input type="password" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Confirm</label>
              <input type="password" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required minLength={6} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:opacity-90 flex items-center gap-2 transition-all">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}