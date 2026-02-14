// src/app/admin/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getManagerNotifications, createNotification, deleteNotification, AppNotification } from '@/services/notifications';
import { getUsers, User } from '@/services/users';
import { Bell, Send, Trash2, Users as UsersIcon, User as UserIcon, Globe } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Composer State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState<string | number>('GLOBAL');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

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
      // Filter out staff so we only message students
      setStudents(usersData.filter(u => !u.is_staff));
    } catch (err: any) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Title and Message are required.");
      return;
    }

    setSending(true);
    setError('');

    try {
      await createNotification({
        title,
        message,
        target_user: targetUserId === 'GLOBAL' ? null : Number(targetUserId)
      });
      
      // Reset form and refresh
      setTitle('');
      setMessage('');
      setTargetUserId('GLOBAL');
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification? It will be removed from student inboxes.")) return;
    try {
      await deleteNotification(id);
      await loadData();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading && notifications.length === 0) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Communications...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Bell className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Communication Center</h1>
          <p className="text-gray-500 text-sm">Send global announcements or direct messages to students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: The Composer */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" /> New Message
            </h2>

            <form onSubmit={handleSend} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="GLOBAL">🌍 Global Blast (All Students)</option>
                  <optgroup label="Direct Message">
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        👤 {student.first_name} {student.last_name} ({student.username})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Scheduled Maintenance"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your announcement here..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {sending ? 'Dispatching...' : 'Dispatch Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Message History */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Message History</h2>
          
          {notifications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications sent yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 group flex flex-col sm:flex-row gap-4">
                
                <div className="shrink-0 pt-1">
                  {notif.target_user ? (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center" title="Direct Message">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center" title="Global Blast">
                      <Globe className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{notif.title}</h3>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {notif.target_user ? `Targeted Student ID: ${notif.target_user}` : 'All Students'} • {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap">{notif.message}</p>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}