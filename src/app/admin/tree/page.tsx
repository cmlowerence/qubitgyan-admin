'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, RefreshCw, Plus, ChevronRight, LayoutGrid, Settings2, Image as ImageIcon } from 'lucide-react';
import { getKnowledgeTree, createKnowledgeNode, updateKnowledgeNode, deleteKnowledgeNode, TreeDepth } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import EditNodeModal from '@/components/tree/EditNodeModal';

export default function TreeManagementPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [depth, setDepth] = useState<TreeDepth>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadTreeData();
  }, [depth]);

  const loadTreeData = async () => {
    setIsLoading(true);
    try {
      const data = await getKnowledgeTree(depth);
      setNodes(data);
    } catch (err) {
      console.error(err);
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
    } finally { setIsProcessing(false); }
  };

  const handleUpdateNode = async (id: number, payload: UpdateNodePayload) => {
    setIsProcessing(true);
    try {
      await updateKnowledgeNode(id, payload);
      await loadTreeData();
      setIsEditModalOpen(false);
    } finally { setIsProcessing(false); }
  };

  const handleDeleteNode = async (id: number) => {
    if (!confirm("Delete this domain? This will remove all subjects and topics inside it!")) return;
    setIsProcessing(true);
    try {
      await deleteKnowledgeNode(id);
      await loadTreeData();
      setIsEditModalOpen(false);
    } finally { setIsProcessing(false); }
  };

  const openEdit = (e: React.MouseEvent, node: KnowledgeNode) => {
    e.stopPropagation();
    setSelectedNode(node);
    setIsEditModalOpen(true);
  };

  if (isLoading) return <LoadingScreen message="Loading Domains..." />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-indigo-600" /> Knowledge Tree
          </h1>
          <p className="text-slate-500 font-medium">Manage top-level domains and content hierarchy.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
          <select
            value={depth}
            onChange={(e) => setDepth((e.target.value === 'full' ? 'full' : Number(e.target.value)) as TreeDepth)}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value={1}>View Domains</option>
            <option value={2}>View Subjects</option>
            <option value="full">Full Tree</option>
          </select>
          <button 
            onClick={loadTreeData} 
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> New Domain
          </button>
        </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => {
          // Check if thumbnail exists (accounting for potentially different casing/structure depending on your type definition)
          // Adjust 'thumbnail_url' below if it's nested inside 'meta' or spelled differently in your raw API response.
          const hasImage = !!node.thumbnail_url;

          return (
            <div
              key={node.id}
              onClick={() => router.push(`/admin/tree/${node.id}`)}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 transition-all cursor-pointer min-h-[240px] flex flex-col"
            >
              {/* Background Image & Overlays */}
              {hasImage ? (
                <>
                  <img 
                    src={node.thumbnail_url} 
                    alt={node.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Heavy dark gradient at the bottom for text, lighter at the top for icons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-slate-900/20 z-0" />
                </>
              ) : (
                <>
                  {/* Fallback pattern/gradient if no image is available */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-700 ease-out z-0" />
                  <div className="absolute inset-0 opacity-10 bg-[url('https://transparenttextures.com/patterns/cubes.png')] z-0" />
                </>
              )}

              {/* Card Content (z-10 to stay above background) */}
              <div className="relative z-10 flex flex-col h-full p-6">
                
                {/* Top Row: Icons */}
                <div className="flex justify-between items-start mb-auto">
                  <div className="p-2.5 rounded-2xl backdrop-blur-md bg-white/20 text-white shadow-sm border border-white/10 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors">
                    <FolderTree className="w-6 h-6" />
                  </div>
                  
                  <button 
                    onClick={(e) => openEdit(e, node)}
                    className="p-2.5 rounded-xl backdrop-blur-md bg-black/20 text-white/70 hover:bg-white hover:text-indigo-600 border border-white/10 hover:border-white transition-all shadow-sm"
                    title="Edit Domain Settings"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Row: Text Info */}
                <div className="mt-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
                      {node.node_type}
                    </span>
                    <span className="text-[11px] font-medium text-white/60">
                      • {node.items_count || 0} items
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
                    {node.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-sm group-hover:text-white transition-colors">
                    Explore Domain <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
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