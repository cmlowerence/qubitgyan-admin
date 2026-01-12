'use client';

import { useEffect, useState } from 'react';
import { getKnowledgeTree } from '@/services/tree';
import { KnowledgeNode } from '@/types/tree';
import { FolderTree, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import DebugConsole from '@/components/debug/DebugConsole'; // Import the new component

export default function TreeManagementPage() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the Debug Console
  const [debugData, setDebugData] = useState<any>(null);

  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugData(null);

      const data = await getKnowledgeTree();
      
      // Since the service now handles unwrapping, we can trust 'data' is an array
      if (Array.isArray(data)) {
        setNodes(data);
      } else {
        throw new Error(`Service returned invalid format: ${typeof data}`);
      }

    } catch (err: any) {
      console.error("Tree Fetch Error:", err);
      setError(err.message || 'Failed to load knowledge tree');
      
      // Capture details for the Debug Console
      setDebugData({
        message: err.message,
        name: err.name,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        targetUrl: process.env.NEXT_PUBLIC_API_URL, 
      });
      
      setNodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <FolderTree className="w-6 h-6 text-blue-600" />
            Knowledge Tree
          </h1>
          <p className="text-sm text-slate-500">Manage your domains, subjects, and topics.</p>
        </div>
        <button 
            onClick={loadTreeData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-sm transition-colors active:scale-95 disabled:opacity-50"
        >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
        </button>
      </div>

      {/* User-Friendly Error Banner */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Failed to load data</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
          <p className="text-sm">Connecting to Backend...</p>
        </div>
      ) : (
        /* Only render if NOT loading */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* List Visualization */}
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden min-h-[300px]">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h2 className="font-semibold text-slate-700 text-sm">Visual Tree</h2>
            </div>
            
            <div className="p-4">
              {nodes.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 mb-2">Database is empty.</p>
                  {!error && <span className="text-xs text-slate-300">Great! We are connected. Ready to add nodes.</span>}
                </div>
              ) : (
                <div className="space-y-2">
                  {nodes.map((node) => (
                    <div key={node.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        {node.thumbnail_url ? (
                          <div className="w-8 h-8 rounded bg-slate-200 flex-shrink-0 overflow-hidden">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={node.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-300">
                            <FolderTree className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-700 text-sm">{node.name}</p>
                          <p className="text-xs text-slate-400">{node.resource_count || 0} resources</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {node.node_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Raw JSON Preview */}
          <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-300 overflow-hidden flex flex-col max-h-[500px]">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Backend Response</h2>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500">JSON</span>
            </div>
            <div className="p-4 overflow-auto font-mono text-xs">
              <pre>{JSON.stringify(nodes, null, 2)}</pre>
            </div>
          </div>

        </div>
      )}

      {/* Modular Debug Console - Will only show if there is an error */}
      <DebugConsole error={debugData} />

    </div>
  );
}
