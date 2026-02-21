'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, LayoutGrid, Settings2, Plus } from 'lucide-react';
import { getKnowledgeNode, createKnowledgeNode, updateKnowledgeNode, deleteKnowledgeNode } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import EditNodeModal from '@/components/tree/EditNodeModal';
import { ResourceManager } from '@/components/resources/ResourceManager';
import SubNodeList from './_components/SubNodeList';

export default function NodeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const nodeId = parseInt(params?.nodeId as string);

  const [currentNode, setCurrentNode] = useState<KnowledgeNode | null>(null);
  const [children, setChildren] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (nodeId) loadNodeData();
  }, [nodeId]);

  const loadNodeData = async () => {
    setIsLoading(true);
    try {
      const data = await getKnowledgeNode(nodeId, 2);
      setCurrentNode(data);
      setChildren(data.children || []);
    } catch (err) {
      router.push('/admin/tree');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (payload: CreateNodePayload) => {
    setIsProcessing(true);
    try {
      await createKnowledgeNode(payload);
      await loadNodeData();
      setIsCreateOpen(false);
    } finally { setIsProcessing(false); }
  };

  const handleUpdate = async (id: number, payload: UpdateNodePayload) => {
    setIsProcessing(true);
    try {
      await updateKnowledgeNode(id, payload);
      await loadNodeData();
      setIsEditOpen(false);
    } finally { setIsProcessing(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this node? All nested children and resources will be removed!")) return;
    setIsProcessing(true);
    try {
      await deleteKnowledgeNode(id);
      // Redirect to parent after deletion
      currentNode?.parent ? router.push(`/admin/tree/${currentNode.parent}`) : router.push('/admin/tree');
    } finally { setIsProcessing(false); }
  };

  if (isLoading) return <LoadingScreen message="Fetching hierarchy..." />;

  const isTopic = currentNode?.node_type === 'TOPIC';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-32 animate-in fade-in">
      {/* --- Breadcrumb / Back Navigation --- */}
      <button 
        onClick={() => currentNode?.parent ? router.push(`/admin/tree/${currentNode.parent}`) : router.push('/admin/tree')}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to {currentNode?.node_type === 'SUBJECT' ? 'Domain' : 'Parent'}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isTopic ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{currentNode?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{currentNode?.node_type}</span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-xs font-bold text-slate-400">ID: #{currentNode?.id}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => setIsEditOpen(true)} className="p-3 bg-slate-50 text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-100 rounded-2xl transition-all shadow-sm">
            <Settings2 className="w-5 h-5" />
          </button>
          {!isTopic && (
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Sub-Item
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {isTopic ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <BookOpen className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-black text-slate-800">Learning Resources</h2>
            </div>
            <ResourceManager nodeId={nodeId} />
          </div>
        ) : (
          <SubNodeList 
            childrenNodes={children}
            onNavigate={(id) => router.push(`/admin/tree/${id}`)}
            onEdit={(e, node) => { e.stopPropagation(); setIsEditOpen(true); }}
            onAddFirstItem={() => setIsCreateOpen(true)}
          />
        )}
      </div>

      <CreateNodeModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isProcessing}
        parentId={nodeId}
        parentType={currentNode?.node_type}
      />

      <EditNodeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        node={currentNode}
        isLoading={isProcessing}
      />
    </div>
  );
}