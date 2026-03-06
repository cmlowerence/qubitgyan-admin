'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  getQueueStatus, 
  dispatchEmailBatch, 
  QueueStatus,
  getEmailList, // Make sure to add this to your services
  sendIndividualEmail, // Make sure to add this to your services
  QueuedEmail // Make sure to add this to your services
} from '@/services/emails';
import { Mail, Send, AlertCircle, Clock, CheckCircle, RefreshCw, ChevronRight } from 'lucide-react';

// ==========================================
// LOCAL COMPONENT: Email Queue List
// ==========================================
function EmailQueueList({ 
  refreshTrigger, 
  onEmailSent 
}: { 
  refreshTrigger: number, 
  onEmailSent: () => void 
}) {
  const [emails, setEmails] = useState<QueuedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmailList();
      setEmails(data);
    } catch (err) {
      console.error("Failed to fetch email list", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch when the component mounts or when the bulk dispatcher triggers a refresh
  useEffect(() => {
    fetchEmails();
  }, [refreshTrigger, fetchEmails]);

  const handleSendIndividual = async (id: number) => {
    try {
      setSendingId(id);
      await sendIndividualEmail(id);
      await fetchEmails(); // Refresh the list
      onEmailSent(); // Tell the parent to refresh the top-level stats
    } catch (error) {
      console.error("Failed to send email", error);
      alert("Failed to send email. Check console for details.");
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 mt-8">Loading email list...</div>;
  }

  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8 text-center">
        <p className="text-gray-500">No emails found in the queue.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800">Individual Dispatch</h3>
        <p className="text-sm text-gray-500">Showing recent emails</p>
      </div>

      {/* MOBILE VIEW: Cards (Hidden on md and up) */}
      <div className="md:hidden flex flex-col divide-y divide-gray-100">
        {emails.map((email) => (
          <div key={email.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{email.recipient}</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(email.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                email.status === 'sent' ? 'bg-green-100 text-green-700' :
                email.status === 'failed' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-700 truncate">{email.subject}</p>
              {email.error_message && email.status === 'failed' && (
                <p className="text-xs text-red-500 mt-1 truncate">{email.error_message}</p>
              )}
            </div>
            <button
              onClick={() => handleSendIndividual(email.id)}
              disabled={sendingId === email.id || email.status === 'sent'}
              className="w-full mt-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sendingId === email.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {email.status === 'failed' ? 'Retry Sending' : 'Send Now'}
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Table (Hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Recipient</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {emails.map((email) => (
              <tr key={email.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{email.recipient}</td>
                <td className="px-6 py-4">
                  <div className="max-w-[250px] truncate">{email.subject}</div>
                  {email.error_message && email.status === 'failed' && (
                    <div className="text-xs text-red-500 mt-1 truncate max-w-[250px]">{email.error_message}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 ${
                    email.status === 'sent' ? 'bg-green-100 text-green-700' :
                    email.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {email.status === 'sent' ? <CheckCircle className="w-3 h-3"/> : 
                     email.status === 'failed' ? <AlertCircle className="w-3 h-3"/> : 
                     <Clock className="w-3 h-3"/>}
                    {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(email.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSendIndividual(email.id)}
                    disabled={sendingId === email.id || email.status === 'sent'}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingId === email.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {email.status === 'failed' ? 'Retry' : 'Send'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ==========================================
// MAIN COMPONENT: Email Queue Page
// ==========================================
export default function EmailQueuePage() {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [batchLimit, setBatchLimit] = useState<number>(20);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // This state is used to trigger a refresh in the child component when a bulk action occurs
  const [listRefreshTrigger, setListRefreshTrigger] = useState(0);

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
      
      // Trigger the list component to refresh its data
      setListRefreshTrigger(prev => prev + 1);
      
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
      
      {/* Existing Header */}
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
          onClick={() => {
            loadStatus();
            setListRefreshTrigger(prev => prev + 1); // Refresh list on manual refresh
          }}
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
              <p className="text-3xl font-bold text-gray-700">{status.pending_emails ?? 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sent</p>
              <p className="text-3xl font-bold text-gray-700">{status.total_sent ?? 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-3xl font-bold text-gray-700">{status.failed_count ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Existing Dispatch Control Panel */}
      {/* ... keeping the UI exactly as you had it ... */}
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

      {/* NEW: Individual Email List */}
      <EmailQueueList 
        refreshTrigger={listRefreshTrigger} 
        onEmailSent={loadStatus} 
      />

    </div>
  );
}