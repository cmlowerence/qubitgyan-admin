// src/app/admin/tree/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, RefreshCw, Plus, ChevronRight, LayoutGrid, Settings2, AlertTriangle } from 'lucide-react';
import { getKnowledgeTree, createKnowledgeNode, updateKnowledgeNode, deleteKnowledgeNode, TreeDepth } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import EditNodeModal from '@/components/tree/EditNodeModal';
import DebugConsole from '@/components/debug/DebugConsole';

export default function TreeManagementPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [depth, setDepth] = useState<TreeDepth>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadTreeData();
  }, [depth]);

  const loadTreeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getKnowledgeTree(depth);
      setNodes(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNode = async (payload: CreateNodePayload) => {
    setIsProcessing(true);
    try {
      await createKnowledgeNode(payload);
      await loadTreeData();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setError(err);
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleUpdateNode = async (id: number, payload: UpdateNodePayload) => {
    setIsProcessing(true);
    try {
      await updateKnowledgeNode(id, payload);
      await loadTreeData();
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err);
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleDeleteNode = async (id: number) => {
    if (!window.confirm("Delete this domain? This will remove all subjects and topics inside it!")) return;
    setIsProcessing(true);
    try {
      await deleteKnowledgeNode(id);
      await loadTreeData();
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err);
    } finally { 
      setIsProcessing(false); 
    }
  };

  const openEdit = (e: React.MouseEvent, node: KnowledgeNode) => {
    e.stopPropagation();
    setSelectedNode(node);
    setIsEditModalOpen(true);
  };

  if (isLoading) return <LoadingScreen message="Loading Knowledge Tree..." />;

  if (error) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" /> System Exception
          </h1>
          <button 
            onClick={loadTreeData}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-md transition-transform active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={error} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            Knowledge Tree
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            Manage top-level domains and content hierarchy.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-full md:w-auto">
          <select
            value={depth}
            onChange={(e) => setDepth((e.target.value === 'full' ? 'full' : Number(e.target.value)) as TreeDepth)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all shadow-sm"
          >
            <option value={1}>View Domains</option>
            <option value={2}>View Subjects</option>
            <option value="full">Full Hierarchy</option>
          </select>
          <button 
            onClick={loadTreeData} 
            className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <Plus className="w-5 h-5" /> <span className="hidden sm:inline">New Domain</span>
          </button>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <FolderTree className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-bold">No domains found.</p>
          <p className="text-sm mt-1">Create your first knowledge domain to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {nodes.map((node) => {
            const hasImage = !!node.thumbnail_url;

            return (
              <div
                key={node.id}
                onClick={() => router.push(`/admin/tree/${node.id}`)}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-600/10 dark:hover:shadow-indigo-900/20 transition-all duration-300 cursor-pointer min-h-[260px] flex flex-col focus:outline-none focus:ring-4 focus:ring-indigo-500"
                tabIndex={0}
              >
                {hasImage ? (
                  <>
                    <img 
                      src={node.thumbnail_url} 
                      alt={node.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/10 z-0" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-900 dark:to-black group-hover:scale-105 transition-transform duration-700 ease-out z-0" />
                    <div className="absolute inset-0 opacity-10 bg-[url('https://transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay" />
                  </>
                )}

                <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
                  
                  <div className="flex justify-between items-start mb-auto">
                    <div className="p-3 rounded-2xl backdrop-blur-md bg-white/10 text-white shadow-sm border border-white/20 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors">
                      <FolderTree className="w-6 h-6" />
                    </div>
                    
                    <button 
                      onClick={(e) => openEdit(e, node)}
                      className="p-3 rounded-xl backdrop-blur-md bg-black/20 text-white/70 hover:bg-white hover:text-indigo-600 border border-white/10 hover:border-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                      title="Edit Domain Settings"
                    >
                      <Settings2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[10px] sm:text-xs font-black text-white/90 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                        {node.node_type}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-white/60 bg-black/20 px-2.5 py-1 rounded-md backdrop-blur-sm">
                        {node.items_count || 0} items
                      </span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 drop-shadow-md line-clamp-2">
                      {node.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm group-hover:text-white transition-colors">
                      Explore Domain <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNode}
        isLoading={isProcessing}
      />

      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateNode}
        onDelete={handleDeleteNode}
        node={selectedNode}
        isLoading={isProcessing}
      />
    </div>
  );
}