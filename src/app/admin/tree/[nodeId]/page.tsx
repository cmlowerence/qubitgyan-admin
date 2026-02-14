// src/app/admin/tree/[nodeId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

// Services & Types
import { 
  getKnowledgeNode, 
  createKnowledgeNode, 
  updateKnowledgeNode, 
  deleteKnowledgeNode 
} from '@/services/tree';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';

// Components
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import EditNodeModal from '@/components/tree/EditNodeModal';
import { ResourceManager } from '@/components/resources/ResourceManager'; 
import DebugConsole from '@/components/debug/DebugConsole';

// Dumb Components
import NodeHeader from './_components/NodeHeader';
import SubNodeList from './_components/SubNodeList';
import ErrorState from './_components/ErrorState';

export default function NodeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const nodeId = params?.nodeId ? parseInt(params.nodeId as string) : 0;

  const [currentNode, setCurrentNode] = useState<KnowledgeNode | null>(null);
  const [children, setChildren] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<KnowledgeNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (nodeId) {
      loadNodeData();
    }
  }, [nodeId]);

  const loadNodeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getKnowledgeNode(nodeId);
      setCurrentNode(data);
      setChildren(Array.isArray(data.children) ? data.children : []);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || 'Failed to load node details');
      setDebugData({
        message: err.message,
        status: err.response?.status,
        responseData: err.response?.data,
        targetUrl: `/nodes/${nodeId}/`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNode = async (payload: CreateNodePayload) => {
    try {
      setIsProcessing(true);
      await createKnowledgeNode(payload);
      await loadNodeData(); 
      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(`Failed to create: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateNode = async (id: number, payload: UpdateNodePayload) => {
    try {
      setIsProcessing(true);
      await updateKnowledgeNode(id, payload);
      await loadNodeData();
      setIsEditModalOpen(false);
      setEditingNode(null);
    } catch (err: any) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteNode = async (id: number) => {
    try {
      setIsProcessing(true);
      await deleteKnowledgeNode(id);

      if (currentNode && id === currentNode.id) {
        currentNode.parent 
          ? router.push(`/admin/tree/${currentNode.parent}`) 
          : router.push('/admin/tree');
        return;
      }

      await loadNodeData();
      setIsEditModalOpen(false);
      setEditingNode(null);
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const openEditModal = (e: React.MouseEvent, node: KnowledgeNode) => {
    e.stopPropagation();
    setEditingNode(node);
    setIsEditModalOpen(true);
  };

  if (isLoading) return <LoadingScreen message="Accessing Knowledge..." />;

  if (error) {
    return <ErrorState error={error} onBack={() => router.back()} />;
  }

  const isTopic = currentNode?.node_type === 'TOPIC';

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      <NodeHeader 
        node={currentNode}
        isTopic={isTopic}
        onBack={() => router.back()}
        onEdit={(e) => currentNode && openEditModal(e, currentNode)}
        onAddSubItem={() => setIsCreateModalOpen(true)}
      />

      <div className="space-y-4">
        {isTopic ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4 px-1">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="font-black text-slate-800 uppercase tracking-tight">Learning Resources</h2>
            </div>
            <ResourceManager nodeId={nodeId} />
          </div>
        ) : (
          <SubNodeList 
            childrenNodes={children}
            onNavigate={(id) => router.push(`/admin/tree/${id}`)}
            onEdit={openEditModal}
            onAddFirstItem={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      <CreateNodeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNode}
        isLoading={isProcessing}
        parentId={nodeId}
        parentType={currentNode?.node_type}
      />

      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateNode}
        onDelete={handleDeleteNode}
        node={editingNode}
        isLoading={isProcessing}
      />

      <div className="mt-12 opacity-50 grayscale hover:grayscale-0 transition-all">
        <DebugConsole error={debugData} />
      </div>

    </div>
  );
}
