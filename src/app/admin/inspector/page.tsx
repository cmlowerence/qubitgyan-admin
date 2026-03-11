'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useCurrentUser } from '@/context/current-user-context';
import { Terminal, Play, ShieldAlert, Check, Copy, Activity, Server } from 'lucide-react';

const defaultEndpoints = ['/health/', '/manager/emails/queue_status/', '/dashboard/stats/'];

export default function ApiInspectorPage() {
  const { user } = useCurrentUser();
  const [path, setPath] = useState(defaultEndpoints[0]);
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [body, setBody] = useState('{\n  "limit": 10\n}');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runRequest = async () => {
    try {
      setLoading(true);
      const res = method === 'GET' ? await api.get(path) : await api.post(path, JSON.parse(body || '{}'));
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (error: any) {
      setResponse(JSON.stringify(error?.response?.data || { message: error.message }, null, 2));
    } finally {
      setLoading(false);
      setCopied(false);
    }
  };

  const copyToClipboard = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user?.is_superuser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in slide-in-from-bottom-4 p-4">
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 p-8 sm:p-12 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl shadow-rose-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-900 dark:text-rose-100 mb-3 tracking-tight">Security Clearance Required</h2>
          <p className="text-sm sm:text-base font-medium text-rose-600 dark:text-rose-400 leading-relaxed">
            Access Denied. The API Inspector is a root-level diagnostic tool restricted to Super Administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <Terminal className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">API Inspector</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Direct diagnostic interface for backend telemetry and endpoints.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Server className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-white">Request Builder</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Target Endpoint</label>
                <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-white dark:bg-slate-950">
                  <select 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')} 
                    className="px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-black border-none outline-none cursor-pointer sm:border-r border-slate-200 dark:border-slate-700 appearance-none text-center sm:text-left"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                  <input 
                    value={path} 
                    onChange={(e) => setPath(e.target.value)} 
                    className="flex-1 px-4 py-3 sm:py-3.5 bg-transparent text-slate-900 dark:text-white font-mono text-sm outline-none w-full placeholder:text-slate-400" 
                    placeholder="/api/v1/resource" 
                  />
                </div>
              </div>

              {method === 'POST' && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">JSON Payload</label>
                  <textarea 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                    rows={6} 
                    className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all custom-scrollbar resize-y" 
                    spellCheck={false}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {defaultEndpoints.map((ep) => (
                    <button 
                      key={ep} 
                      onClick={() => { setPath(ep); setMethod('GET'); }} 
                      className={`text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded-lg transition-colors border ${path === ep ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      {ep}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={runRequest} 
                disabled={loading || !path.trim()} 
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              >
                {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                {loading ? 'Executing Query...' : 'Execute Request'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div className="flex-1 bg-[#0A0A0A] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative group">
            
            <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 select-none">admin@qubitgyan:~ {path}</span>
              </div>
              <button 
                onClick={copyToClipboard}
                disabled={!response}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                title="Copy Output"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex-1 relative p-4 sm:p-6 overflow-auto custom-scrollbar min-h-[300px] lg:min-h-[500px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 font-mono gap-3">
                  <Activity className="w-8 h-8 animate-spin text-indigo-500" />
                  <span className="animate-pulse">Awaiting response...</span>
                </div>
              ) : response ? (
                <pre className="text-xs sm:text-sm font-mono text-emerald-400 break-all whitespace-pre-wrap leading-relaxed">
                  {response}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 font-mono gap-2 select-none">
                  <Terminal className="w-10 h-10 mb-2 opacity-20" />
                  <span>Output stream empty.</span>
                  <span className="text-[10px]">Execute a request to view telemetry data.</span>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}