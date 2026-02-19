// src/app/admin/emails/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getQueueStatus, dispatchEmailBatch, QueueStatus } from '@/services/emails';
import { Mail, Send, AlertCircle, Clock, CheckCircle, RefreshCw } from 'lucide-react';

export default function EmailQueuePage() {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [batchLimit, setBatchLimit] = useState<number>(20);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await getQueueStatus();
      setStatus(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load queue status.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async () => {
    if (batchLimit < 1) {
      setMessage({ type: 'error', text: 'Batch limit must be at least 1.' });
      return;
    }

    try {
      setDispatching(true);
      setMessage(null);
      const response = await dispatchEmailBatch(batchLimit);
      
      setMessage({ 
        type: 'success', 
        text: `Successfully dispatched ${response.dispatched_count} emails.` 
      });
      
      // Refresh the queue numbers after sending
      await loadStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to dispatch emails.' });
    } finally {
      setDispatching(false);
    }
  };

  if (loading && !status) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Checking Mail Server...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Mail className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Email Queue Dispatcher</h1>
            <p className="text-gray-500 text-sm">Monitor and batch-process pending system emails safely.</p>
          </div>
        </div>
        <button 
          onClick={loadStatus}
          disabled={loading || dispatching}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh Queue Status"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Stats Dashboard */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-3xl font-bold text-gray-700">{status.pending_emails || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sent</p>
              <p className="text-3xl font-bold text-gray-700">{status.total_sent || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-3xl font-bold text-gray-700">{status.failed_count || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Control Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-2xl mx-auto mt-8">
        <Send className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Manual Dispatch Control</h2>
        <p className="text-gray-500 text-sm mb-6">
          To prevent Gmail from blocking your account for spam, send emails in small batches. 
          A batch size of 20-50 is recommended.
        </p>

        <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
          <div className="flex-1">
            <label className="sr-only">Batch Limit</label>
            <input 
              type="number" 
              min="1" 
              max="100"
              value={batchLimit}
              onChange={(e) => setBatchLimit(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-center font-bold text-lg"
            />
          </div>
          <button
            onClick={handleDispatch}
            disabled={dispatching || (status?.pending_emails === 0)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {dispatching ? 'Sending...' : 'Dispatch Batch'}
          </button>
        </div>
        
        {status?.pending_emails === 0 && (
          <p className="text-sm text-green-600 font-medium mt-4">
            🎉 The queue is currently empty. All caught up!
          </p>
        )}
      </div>

    </div>
  );
}