'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FolderTree, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  ArrowLeft, 
  Image as ImageIcon, 
  Settings2, 
  Pencil,
  BookOpen
} from 'lucide-react';

// Services
import { 
  getKnowledgeNode, 
  createKnowledgeNode, 
  updateKnowledgeNode, 
  deleteKnowledgeNode 
} from '@/services/tree';

// Types
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';

// Components
import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import EditNodeModal from '@/components/tree/EditNodeModal';
import { ResourceManager } from '@/components/resources/ResourceManager';
import DebugConsole from '@/components/debug/DebugConsole';

export default function NodeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const nodeId = parseInt(params.nodeId as string);

  // Data State
  const [currentNode, setCurrentNode] = useState<KnowledgeNode | null>(null);
  const [children, setChildren] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);

  // Modal & Processing States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<KnowledgeNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadNodeData();
  }, [nodeId]);

  const loadNodeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getKnowledgeNode(nodeId);
      setCurrentNode(data);
      setChildren(data.children || []);
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

  // --- ACTIONS ---

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

      // Smart Redirect: If current folder is deleted, go back
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

  // --- RENDER HELPERS ---

  if (isLoading) return <LoadingScreen message="Accessing Knowledge..." />;

  if (error) {
    return (
      <div className="p-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 p-6 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Folder Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6 max-w-xs">{error}</p>
        <button onClick={() => router.back()} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const isTopic = currentNode?.node_type === 'TOPIC';

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Breadcrumb & Header */}
      <div className="space-y-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Parent
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isTopic ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 break-all leading-tight">
                {currentNode?.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isTopic ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                  {currentNode?.node_type}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500">ID: #{nodeId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={(e) => currentNode && openEditModal(e, currentNode)}
              className="p-3 bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:text-blue-600 rounded-xl transition-all active:scale-90"
            >
              <Settings2 className="w-5 h-5" />
            </button>
            {!isTopic && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-100 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" /> Add Sub-Item
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {children.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
                <FolderTree className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-slate-600 font-bold">This folder is empty</h3>
                <p className="text-slate-400 text-sm mt-1 mb-6">Start building your knowledge tree by adding items.</p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2 bg-white border border-slate-200 text-blue-600 text-sm font-bold rounded-lg hover:shadow-sm transition-all"
                >
                  Add First Item
                </button>
              </div>
            ) : (
              children.map((child) => (
                <div 
                  key={child.id}
                  onClick={() => router.push(`/admin/tree/${child.id}`)}
                  className="group relative cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <button
                    onClick={(e) => openEditModal(e, child)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {child.thumbnail_url ? (
                      <img src={child.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                        <ImageIcon className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                    <span className="absolute bottom-3 right-3 text-[10px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-slate-800 shadow-sm border border-black/5">
                      {child.node_type}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {child.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{child.children?.length || 0} Items</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span>{child.resource_count || 0} Resources</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. Modals & Debugging */}
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
