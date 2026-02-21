'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, RefreshCw, Plus, ChevronRight, LayoutGrid, Settings2 } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-indigo-600" /> Knowledge Tree
          </h1>
          <p className="text-slate-500 font-medium">Manage top-level domains and content hierarchy.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
          <select
            value={depth}
            onChange={(e) => setDepth((e.target.value === 'full' ? 'full' : Number(e.target.value)) as TreeDepth)}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none"
          >
            <option value={1}>View Domains</option>
            <option value={2}>View Subjects</option>
            <option value="full">Full Tree</option>
          </select>
          <button onClick={loadTreeData} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><RefreshCw className="w-5 h-5" /></button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> New Domain
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => router.push(`/admin/tree/${node.id}`)}
            className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all text-left flex flex-col gap-4 border-b-4 border-b-slate-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FolderTree className="w-6 h-6" />
              </div>
              <button 
                onClick={(e) => openEdit(e, node)}
                className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">{node.name}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-tighter">{node.node_type} • {node.resource_count || 0} items</p>
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 text-indigo-600 font-bold text-xs">
              Explore Sub-Items <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

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