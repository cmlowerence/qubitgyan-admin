'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FolderTree, AlertCircle, RefreshCw, Plus, ArrowLeft, Image as ImageIcon, Settings2, Pencil } from 'lucide-react';

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
import EditNodeModal from '@/components/tree/EditNodeModal'; // NEW
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

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // NEW
  const [editingNode, setEditingNode] = useState<KnowledgeNode | null>(null); // NEW
  const [isProcessing, setIsProcessing] = useState(false); // Shared loading state for create/edit

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
      
      // 1. Perform the Delete
      await deleteKnowledgeNode(id);

      // 2. CHECK: Did we just delete the folder we are currently looking at?
      if (currentNode && id === currentNode.id) {
        // YES: We deleted the "Main Node". 
        // We cannot "refresh" because it's gone. We must leave.
        
        // If it had a parent, go to parent. If not, go to Root.
        if (currentNode.parent) {
          router.push(`/admin/tree/${currentNode.parent}`);
        } else {
          router.push('/admin/tree');
        }
        
        return; // Stop here! Do not try to load data.
      }

      // 3. NO: We deleted a child card. 
      // It is safe to refresh the current page.
      await loadNodeData();
      
      // Close modal
      setIsEditModalOpen(false);
      setEditingNode(null);

    } catch (err: any) {
      console.error("Delete Error:", err);
      alert(`Failed to delete: ${err.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };


  // Helper to open edit modal for a specific child
  const openEditModal = (e: React.MouseEvent, node: KnowledgeNode) => {
    e.stopPropagation(); // Prevent clicking the card (navigation)
    setEditingNode(node);
    setIsEditModalOpen(true);
  };

  // --- RENDER ---

  if (isLoading) return <LoadingScreen message="Loading Folder..." />;

  if (error) {
    return (
      <div className="p-4 min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Folder Not Found</h2>
        <p className="text-gray-500 max-w-xs mx-auto text-sm">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-20 max-w-7xl mx-auto">
      
      {/* Navigation & Header */}
      <div className="space-y-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit p-1 -ml-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parent
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="w-full md:w-auto">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-800 break-all">
              <FolderTree className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <span>{currentNode?.name}</span>
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                {currentNode?.node_type}
              </span>
              <span className="text-xs text-slate-500">
                {children.length} {children.length === 1 ? 'item' : 'items'} inside
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            {/* Edit Current Parent Node Button */}
            <button 
              onClick={(e) => {
                if (currentNode) openEditModal(e, currentNode);
              }}
              className="p-2.5 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-white rounded-lg shadow-sm active:scale-95 transition-all"
              title="Edit Folder Settings"
            >
              <Settings2 className="w-5 h-5" />
            </button>

            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 active:scale-95 transition-all"
            >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
            <FolderTree className="w-8 h-8 text-slate-300 mb-4" />
            <h3 className="text-slate-900 font-semibold text-lg mb-1">Empty Folder</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">No items found inside {currentNode?.name}.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2 bg-white border border-slate-200 text-blue-600 font-medium rounded-lg hover:border-blue-300 transition-all"
            >
              Create First Item
            </button>
          </div>
        ) : (
          children.map((child) => (
            <div 
              key={child.id}
              onClick={() => router.push(`/admin/tree/${child.id}`)}
              className="group relative cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-300 active:scale-[0.98]"
            >
              {/* EDIT BUTTON (Visible on Hover or Mobile) */}
              <button
                onClick={(e) => openEditModal(e, child)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur text-slate-600 hover:text-blue-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Edit Item"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Card Header / Thumbnail */}
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                {child.thumbnail_url ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img src={child.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  </div>
                )}
                
                {/* Type Badge */}
                <span className="absolute bottom-2 right-2 text-[10px] font-bold uppercase bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-md shadow-sm">
                  {child.node_type}
                </span>
                
                {/* Order Badge */}
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                  #{child.order}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {child.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>{child.children?.length || 0} items</span>
                  <span className="text-slate-300">•</span>
                  <span>{child.resource_count || 0} res</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateNodeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNode}
        isLoading={isProcessing}
        parentId={nodeId}
      />

      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateNode}
        onDelete={handleDeleteNode}
        node={editingNode}
        isLoading={isProcessing}
      />

      <DebugConsole error={debugData} />
    </div>
  );
}
