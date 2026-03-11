// src/app/admin/tree/[nodeId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, LayoutGrid, Settings2, Plus, AlertTriangle } from 'lucide-react';
import { getKnowledgeNode, createKnowledgeNode, updateKnowledgeNode, deleteKnowledgeNode } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import EditNodeModal from '@/components/tree/EditNodeModal';
import { ResourceManager } from '@/components/resources/ResourceManager';
import SubNodeList from './_components/SubNodeList';
import ErrorState from './_components/ErrorState';
import NodeHeader from './_components/NodeHeader';

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
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (nodeId) loadNodeData();
  }, [nodeId]);

  const loadNodeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getKnowledgeNode(nodeId, 2);
      setCurrentNode(data);
      setChildren(data.children || []);
    } catch (err: any) {
      setError(err);
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
    } catch (err: any) {
      setError(err);
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleUpdate = async (id: number, payload: UpdateNodePayload) => {
    setIsProcessing(true);
    try {
      await updateKnowledgeNode(id, payload);
      await loadNodeData();
      setIsEditOpen(false);
    } catch (err: any) {
      setError(err);
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this node? All nested children and resources will be removed!")) return;
    setIsProcessing(true);
    try {
      await deleteKnowledgeNode(id);
      currentNode?.parent ? router.push(`/admin/tree/${currentNode.parent}`) : router.push('/admin/tree');
    } catch (err: any) {
      setError(err);
    } finally { 
      setIsProcessing(false); 
    }
  };

  if (isLoading) return <LoadingScreen message="Fetching hierarchy..." />;

  if (error || !currentNode) {
    return <ErrorState error={error?.message || "Failed to load node data."} onBack={() => router.push('/admin/tree')} />;
  }

  const isTopic = currentNode.node_type === 'TOPIC';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-32 animate-in fade-in duration-500">
      
      <NodeHeader 
        node={currentNode} 
        isTopic={isTopic}
        onBack={() => currentNode.parent ? router.push(`/admin/tree/${currentNode.parent}`) : router.push('/admin/tree')}
        onEdit={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
        onAddSubItem={() => setIsCreateOpen(true)}
      />

      <div className="space-y-6 sm:space-y-8">
        {isTopic ? (
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 sm:pb-6">
              <div className="p-2 sm:p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Learning Resources</h2>
            </div>
            <ResourceManager nodeId={nodeId} />
          </div>
        ) : (
          <SubNodeList 
            childrenNodes={children}
            onNavigate={(id) => router.push(`/admin/tree/${id}`)}
            onEdit={(e, node) => { e.stopPropagation(); setCurrentNode(node); setIsEditOpen(true); }}
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
        parentType={currentNode.node_type}
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