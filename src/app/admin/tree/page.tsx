'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { FolderTree, AlertCircle, RefreshCw, Plus } from 'lucide-react';

// Services & Types
import { getKnowledgeTree, createKnowledgeNode } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload } from '@/types/tree';

// Components
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import DebugConsole from '@/components/debug/DebugConsole';

export default function TreeManagementPage() {
  const router = useRouter();

  // Data State
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debug State
  const [debugData, setDebugData] = useState<any>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Initial Fetch
  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugData(null);

      const data = await getKnowledgeTree();
      
      if (Array.isArray(data)) {
        setNodes(data);
      } else {
        throw new Error(`Invalid data format. Expected Array, got: ${typeof data}`);
      }

    } catch (err: any) {
      console.error("Tree Fetch Error:", err);
      setError(err.message || 'Failed to load knowledge tree');
      
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

  const handleCreateNode = async (payload: CreateNodePayload) => {
    try {
      setIsCreating(true);
      await createKnowledgeNode(payload);
      await loadTreeData();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(`Failed to create node: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // --- RENDER ---

  if (isLoading) {
    return <LoadingScreen message="Loading Knowledge Tree..." />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <FolderTree className="w-6 h-6 text-blue-600" />
            Knowledge Tree
          </h1>
          <p className="text-sm text-slate-500">Manage your root domains (e.g., Science, Arts).</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
              onClick={loadTreeData}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-sm transition-colors active:scale-95"
              title="Refresh Data"
          >
              <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all active:scale-95"
          >
              <Plus className="w-4 h-4" />
              Add Domain
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Failed to load data</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
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
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Create your first Domain
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {nodes.map((node) => (
                  <div 
                    key={node.id} 
                    onClick={() => router.push(`/admin/tree/${node.id}`)}
                    className="cursor-pointer p-3 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-blue-200 hover:shadow-sm transition-all flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      {node.thumbnail_url ? (
                        <div className="w-8 h-8 rounded bg-slate-200 flex-shrink-0 overflow-hidden border border-slate-200">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={node.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                          <FolderTree className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div>
                        <p className="font-medium text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{node.name}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Order: {node.order}</span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs text-slate-400">{node.resource_count || 0} resources</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                      {node.node_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* JSON Preview */}
        <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-300 overflow-hidden flex flex-col max-h-[500px]">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
            <h2 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Backend Response</h2>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500">JSON</span>
          </div>
          <div className="p-4 overflow-auto font-mono text-xs custom-scrollbar">
            <pre>{JSON.stringify(nodes, null, 2)}</pre>
          </div>
        </div>

      </div>

      <CreateNodeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNode}
        isLoading={isCreating}
      />
      
      <DebugConsole error={debugData} />

    </div>
  );
}
