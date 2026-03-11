'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  getQueueStatus, 
  dispatchEmailBatch, 
  QueueStatus,
  getEmailList,
  sendIndividualEmail,
  QueuedEmail
} from '@/services/emails';
import { Mail, Send, AlertCircle, Clock, CheckCircle, RefreshCw, AlertTriangle, Inbox } from 'lucide-react';
import { AlertModal } from '@/components/ui/dialogs';
import DebugConsole from '@/components/debug/DebugConsole';

function EmailQueueList({ 
  refreshTrigger, 
  onEmailSent,
  showAlert
}: { 
  refreshTrigger: number, 
  onEmailSent: () => void,
  showAlert: (title: string, message: string, type: 'success' | 'danger' | 'info') => void
}) {
  const [emails, setEmails] = useState<QueuedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [listError, setListError] = useState<any>(null);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      setListError(null);
      const data = await getEmailList();
      setEmails(data);
    } catch (err: any) {
      setListError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [refreshTrigger, fetchEmails]);

  const handleSendIndividual = async (id: number) => {
    try {
      setSendingId(id);
      await sendIndividualEmail(id);
      
      showAlert(
        "Email Queued for Delivery", 
        "This email is now being processed in the background. The status will update shortly.", 
        "success"
      );

      setTimeout(() => {
        fetchEmails(); 
        onEmailSent(); 
      }, 2000);

    } catch (error: any) {
      showAlert("Sending Failed", error.message || "Failed to initiate email delivery. Please try again.", "danger");
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-8 gap-4">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="font-bold tracking-widest uppercase text-xs sm:text-sm text-slate-400 animate-pulse">Syncing Outbox...</p>
      </div>
    );
  }

  if (listError) {
    return (
      <div className="mt-8 animate-in fade-in duration-500">
        <DebugConsole error={listError} />
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm mt-8 text-center">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-full mb-4">
          <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Outbox Empty</p>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">No emails are currently waiting in the dispatch queue.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 mt-8 overflow-hidden transition-colors">
      <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Individual Dispatch</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Recent items in the delivery pipeline</p>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
        {emails.map((email) => (
          <div key={email.id} className="p-5 space-y-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{email.recipient}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">
                  {new Date(email.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest shrink-0 border ${
                email.status === 'sent' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' :
                email.status === 'failed' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400' :
                'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400'
              }`}>
                {email.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">{email.subject}</p>
              {email.error_message && email.status === 'failed' && (
                <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-lg">
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 break-words line-clamp-3">{email.error_message}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => handleSendIndividual(email.id)}
              disabled={sendingId === email.id || email.status === 'sent'}
              className="w-full py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-black rounded-xl border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-500/20 active:scale-[0.98]"
            >
              {sendingId === email.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {email.status === 'failed' ? 'Retry Sending' : 'Dispatch Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm sticky top-0">
            <tr>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap w-[20%]">Recipient</th>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap w-[40%]">Subject payload</th>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="p-5 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
              <th className="p-5 text-right text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {emails.map((email) => (
              <tr key={email.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="p-5 font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px]">{email.recipient}</td>
                <td className="p-5">
                  <div className="max-w-[300px] lg:max-w-[400px] truncate text-sm font-medium text-slate-700 dark:text-slate-300">{email.subject}</div>
                  {email.error_message && email.status === 'failed' && (
                    <div className="text-xs font-bold text-rose-500 dark:text-rose-400 mt-1.5 truncate max-w-[300px] lg:max-w-[400px] bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded border border-rose-100 dark:border-rose-800/50 inline-block">
                      {email.error_message}
                    </div>
                  )}
                </td>
                <td className="p-5">
                  <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest inline-flex items-center gap-1.5 border ${
                    email.status === 'sent' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' :
                    email.status === 'failed' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400' :
                    'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400'
                  }`}>
                    {email.status === 'sent' ? <CheckCircle className="w-3 h-3"/> : 
                     email.status === 'failed' ? <AlertCircle className="w-3 h-3"/> : 
                     <Clock className="w-3 h-3"/>}
                    {email.status}
                  </span>
                </td>
                <td className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  {new Date(email.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => handleSendIndividual(email.id)}
                    disabled={sendingId === email.id || email.status === 'sent'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
                  >
                    {sendingId === email.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden xl:inline">{email.status === 'failed' ? 'Retry' : 'Dispatch'}</span>
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

export default function EmailQueuePage() {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<any>(null);
  
  const [isCoolingDown, setIsCoolingDown] = useState(false); 
  
  const [batchLimit, setBatchLimit] = useState<number>(20);
  const [listRefreshTrigger, setListRefreshTrigger] = useState(0);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'danger' | 'info';
  }>({
    isOpen: false, title: '', message: '', type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'success' | 'danger' | 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const data = await getQueueStatus();
      setStatus(data);
    } catch (err: any) {
      setPageError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async () => {
    if (batchLimit < 1) {
      showAlert("Invalid Batch Limit", "Batch limit must be at least 1.", "danger");
      return;
    }

    try {
      setIsCoolingDown(true); 
      
      await dispatchEmailBatch(batchLimit);
      
      showAlert(
        "Batch Processing Initiated", 
        "Your emails have been securely queued for background dispatch. They will be sent momentarily. You can navigate away or refresh the page later to see the updated status.", 
        "success"
      );
      
      setTimeout(() => {
        loadStatus();
        setListRefreshTrigger(prev => prev + 1);
        setIsCoolingDown(false); 
      }, 3000);
      
    } catch (err: any) {
      showAlert("Dispatch Failed", err.message || "Failed to dispatch emails.", "danger");
      setIsCoolingDown(false);
    }
  };

  if (loading && !status && !pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <Mail className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-indigo-500" />
        <p className="font-bold tracking-widest uppercase text-xs sm:text-sm animate-pulse">Contacting Mail Server...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Server Exception
          </h1>
          <button 
            onClick={loadStatus}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={pageError} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Queue Dispatcher</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Monitor and batch-process pending system emails securely.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            loadStatus();
            setListRefreshTrigger(prev => prev + 1);
          }}
          disabled={loading || isCoolingDown}
          className="flex items-center justify-center gap-2 p-3 sm:px-5 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] w-full sm:w-auto"
          title="Refresh Queue Status"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span className="sm:hidden">Refresh Data</span>
        </button>
      </div>

      {status && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-5 transition-transform hover:-translate-y-1 duration-300 group">
            <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8"/>
            </div>
            <div className="text-center sm:text-left pt-1">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Pending</p>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none">{status.pending_emails ?? '0'}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-5 transition-transform hover:-translate-y-1 duration-300 group">
            <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8"/>
            </div>
            <div className="text-center sm:text-left pt-1">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Dispatched</p>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none">{status.total_sent ?? '0'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-5 transition-transform hover:-translate-y-1 duration-300 group">
            <div className="p-3 sm:p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8"/>
            </div>
            <div className="text-center sm:text-left pt-1">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Failed</p>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none">{status.failed_count ?? '0'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-center max-w-2xl mx-auto mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-100 dark:border-indigo-800/50">
            <Send className="w-10 h-10 text-indigo-600 dark:text-indigo-400 ml-1" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Manual Dispatch Engine</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
            Emails are processed securely via background threads. A batch configuration of 20-50 units is optimal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <div className="w-full sm:w-1/3 relative group">
              <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-900 px-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-500 z-10">Batch Size</label>
              <input 
                type="number" 
                min="1" 
                max="100"
                value={batchLimit}
                onChange={(e) => setBatchLimit(Number(e.target.value))}
                className="w-full px-4 py-4 sm:py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-center font-black text-lg sm:text-xl text-slate-800 dark:text-slate-100 transition-all relative z-0"
              />
            </div>
            <button
              onClick={handleDispatch}
              disabled={isCoolingDown || (status?.pending_emails === 0)}
              className="w-full sm:w-2/3 px-6 py-4 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
            >
              {isCoolingDown ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isCoolingDown ? 'Executing...' : 'Trigger Dispatch'}
            </button>
          </div>
          
          {status?.pending_emails === 0 && (
            <div className="mt-8 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/50 animate-in fade-in zoom-in-95">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-bold">Queue is optimal. All tasks completed.</span>
            </div>
          )}
        </div>
      </div>

      <EmailQueueList 
        refreshTrigger={listRefreshTrigger} 
        onEmailSent={loadStatus} 
        showAlert={showAlert}
      />

      <AlertModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

    </div>
  );
}