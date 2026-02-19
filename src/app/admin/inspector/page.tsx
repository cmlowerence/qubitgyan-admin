'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useCurrentUser } from '@/context/current-user-context';
import { Terminal, Play } from 'lucide-react';

const defaultEndpoints = ['/system/health/', '/manager/emails/queue_status/', '/dashboard/stats/'];

export default function ApiInspectorPage() {
  const { user } = useCurrentUser();
  const [path, setPath] = useState(defaultEndpoints[0]);
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [body, setBody] = useState('{\n  "limit": 10\n}');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const runRequest = async () => {
    try {
      setLoading(true);
      const res = method === 'GET' ? await api.get(path) : await api.post(path, JSON.parse(body || '{}'));
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (error: any) {
      setResponse(JSON.stringify(error?.response?.data || { message: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };


  if (!user?.is_superuser) {
    return <div className="p-6 text-sm text-red-600">Superadmin access required for API Inspector.</div>;
  }
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Terminal className="w-5 h-5 text-indigo-600" />
        <h1 className="text-xl md:text-2xl font-bold">API Inspector (Superadmin)</h1>
      </div>
      <p className="text-sm text-slate-500">Lookup backend logs/responses by hitting admin/system endpoints directly from panel.</p>

      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <select value={method} onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')} className="px-3 py-2 border rounded-lg">
            <option>GET</option>
            <option>POST</option>
          </select>
          <input value={path} onChange={(e) => setPath(e.target.value)} className="sm:col-span-3 px-3 py-2 border rounded-lg" placeholder="/system/health/" />
        </div>

        {method === 'POST' && (
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full p-3 border rounded-lg font-mono text-xs" />
        )}

        <div className="flex gap-2 flex-wrap">
          {defaultEndpoints.map((ep) => (
            <button key={ep} onClick={() => setPath(ep)} className="text-xs px-2 py-1 rounded bg-slate-100">
              {ep}
            </button>
          ))}
        </div>

        <button onClick={runRequest} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2">
          <Play className="w-4 h-4" /> {loading ? 'Running...' : 'Run'}
        </button>
      </div>

      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-auto min-h-[260px]">{response || 'Response will appear here...'}</pre>
    </div>
  );
}
