'use client';

import { useEffect, useState } from 'react';
import { getManagerNotifications, createNotification, deleteNotification, AppNotification } from '@/services/notifications';
import { getUsers, User } from '@/services/users';
import { Bell, Send, Trash2, User as UserIcon, Globe, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';
import { AlertModal, ConfirmModal } from '@/components/ui/dialogs';
import DebugConsole from '@/components/debug/DebugConsole';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<any>(null);

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
      setPageError(null);
      const [notifsData, usersData] = await Promise.all([
        getManagerNotifications(),
        getUsers()
      ]);
      setNotifications(notifsData);
      setStudents(usersData.filter(u => !u.is_staff));
    } catch (err: any) {
      setPageError(err);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-[1.5rem] flex items-center justify-center animate-pulse">
          <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 dark:text-indigo-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs sm:text-sm animate-pulse">Synchronizing Data...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Sync Exception
          </h1>
          <button 
            onClick={loadData}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Fetch
          </button>
        </div>
        <DebugConsole error={pageError} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Communication Center</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Dispatch global announcements or targeted direct messages.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 lg:p-8 lg:sticky lg:top-8 transition-all">
            <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Composer</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Audience</label>
                <div className="relative group">
                  <select
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all appearance-none outline-none cursor-pointer"
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
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {targetUserId === 'GLOBAL' ? <Globe className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Scheduled Maintenance"
                  className="w-full px-4 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:font-medium placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your announcement here..."
                  className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-sm sm:text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all outline-none resize-y custom-scrollbar"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !title.trim() || !message.trim()}
                className="w-full py-4 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base rounded-xl transition-all flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              >
                {sending ? 'Dispatching...' : 'Dispatch Message'} <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Outbox History</h2>
            <span className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              {notifications.length} Total
            </span>
          </div>
          
          {notifications.length === 0 ? (
            <div className="py-16 sm:py-24 px-4 text-center bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-700">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">No messages sent</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base max-w-sm">Use the composer to dispatch your first notification to the student body.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 p-5 sm:p-6 lg:p-8 transition-all group flex flex-col sm:flex-row gap-5 sm:gap-6 focus-within:ring-4 focus-within:ring-slate-500/10">
                  
                  <div className="shrink-0">
                    {notif.target_user ? (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 shadow-sm transition-transform group-hover:scale-105" title="Direct Message">
                        <UserIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-transform group-hover:scale-105" title="Global Blast">
                        <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${notif.target_user ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400'}`}>
                            {notif.target_user ? 'Direct Message' : 'Global Broadcast'}
                          </span>
                          <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            {new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-1">{notif.title}</h3>
                        {notif.target_user && (
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">Target ID: {notif.target_user}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => setConfirmDeleteId(notif.id)}
                        className="p-3 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100 shrink-0 self-end sm:self-start focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-4 sm:mt-5 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{notif.message}</p>
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