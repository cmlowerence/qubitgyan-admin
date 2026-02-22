// src/app/admin/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getManagerNotifications, createNotification, deleteNotification, AppNotification } from '@/services/notifications';
import { getUsers, User } from '@/services/users';
import { Bell, Send, Trash2, User as UserIcon, Globe, MessageSquare } from 'lucide-react';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState<string>('GLOBAL');
  const [sending, setSending] = useState(false);
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success' | 'danger' | 'info' }>({ open: false, title: '', msg: '', type: 'info' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifsData, usersData] = await Promise.all([
        getManagerNotifications(),
        getUsers()
      ]);
      setNotifications(notifsData);
      setStudents(usersData.filter(u => !u.is_staff));
    } catch (err) {
      setAlertState({ open: true, title: 'Error', msg: 'Failed to load communications data.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setAlertState({ open: true, title: 'Validation Error', msg: 'Title and Message are required.', type: 'danger' });
      return;
    }

    setSending(true);
    try {
      await createNotification({
        title,
        message,
        target_user: targetUserId === 'GLOBAL' ? null : Number(targetUserId)
      });
      
      setTitle('');
      setMessage('');
      setTargetUserId('GLOBAL');
      await loadData();
      setAlertState({ open: true, title: 'Message Dispatched', msg: 'Your notification was sent successfully.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Failed to Send', msg: err.message || "An unexpected error occurred.", type: 'danger' });
    } finally {
      setSending(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteNotification(confirmDeleteId);
      await loadData();
      setAlertState({ open: true, title: 'Deleted', msg: 'Notification permanently removed.', type: 'success' });
    } catch (err: any) {
      setAlertState({ open: true, title: 'Delete Failed', msg: err.message || 'Could not delete notification.', type: 'danger' });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <Bell className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-slate-500 font-medium">Synchronizing Communications...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100/50">
            <MessageSquare className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Communication Center</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Dispatch global announcements or targeted direct messages.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 lg:sticky lg:top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Send className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">Composer</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Audience</label>
                <div className="relative">
                  <select
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none outline-none cursor-pointer"
                  >
                    <option value="GLOBAL">Global Blast (All Students)</option>
                    <optgroup label="Direct Message">
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} ({student.username})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    {targetUserId === 'GLOBAL' ? <Globe className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Scheduled Maintenance"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your announcement here..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none custom-scrollbar"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !title.trim() || !message.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 active:scale-[0.98]"
              >
                {sending ? 'Dispatching...' : 'Dispatch Message'} <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xl font-extrabold text-slate-800">Outbox History</h2>
            <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{notifications.length} Total</span>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No messages sent</h3>
              <p className="text-slate-400 text-sm max-w-sm">Use the composer to send your first notification to students.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-100 p-5 md:p-6 transition-all group flex flex-col sm:flex-row gap-5">
                  
                  <div className="shrink-0">
                    {notif.target_user ? (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100" title="Direct Message">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100" title="Global Blast">
                        <Globe className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${notif.target_user ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                            {notif.target_user ? 'Direct Message' : 'Global Broadcast'}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">{notif.title}</h3>
                        {notif.target_user && (
                          <p className="text-xs font-bold text-slate-500 mt-1">Target ID: {notif.target_user}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => setConfirmDeleteId(notif.id)}
                        className="p-2.5 text-slate-400 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0 self-start focus:outline-none focus:ring-2 focus:ring-rose-500"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                      <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">{notif.message}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={executeDelete}
        title="Delete Notification?"
        message="Are you sure you want to permanently delete this notification? It will be removed from the recipients' inboxes immediately."
        confirmText="Yes, Delete"
        type="danger"
      />

      <AlertModal
        isOpen={alertState.open}
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
        title={alertState.title}
        message={alertState.msg}
        type={alertState.type}
      />
    </div>
  );
}