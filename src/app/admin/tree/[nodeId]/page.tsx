'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FolderTree, AlertCircle, RefreshCw, Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react';

import { getKnowledgeNode, createKnowledgeNode } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload } from '@/types/tree';

import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';
import DebugConsole from '@/components/debug/DebugConsole';

export default function NodeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // The ID from the URL (e.g., "5" from /admin/tree/5)
  const nodeId = parseInt(params.nodeId as string);

  // State
  const [currentNode, setCurrentNode] = useState<KnowledgeNode | null>(null);
  const [children, setChildren] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadNodeData();
  }, [nodeId]);

  const loadNodeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the specific node (Backend returns node + children)
      const data = await getKnowledgeNode(nodeId);
      
      setCurrentNode(data);
      // The serializer returns children in the 'children' field
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

  const handleCreateNode = async (payload: CreateNodePayload) => {
    try {
      setIsCreating(true);
      await createKnowledgeNode(payload);
      await loadNodeData(); // Refresh to see the new child
      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(`Failed to create node: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // --- RENDER ---

  if (isLoading) return <LoadingScreen message="Loading Folder..." />;

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Folder Not Found</h2>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
        <DebugConsole error={debugData} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20">
      
      {/* Header: Breadcrumb & Actions */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parent
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <FolderTree className="w-6 h-6 text-blue-600" />
              {currentNode?.name}
            </h1>
            <p className="text-sm text-slate-500">
              Type: <span className="font-semibold uppercase text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{currentNode?.node_type}</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={loadNodeData}
                className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-sm"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
            
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm active:scale-95 transition-all"
            >
                <Plus className="w-4 h-4" />
                Add {currentNode?.node_type === 'DOMAIN' ? 'Subject' : 'Topic'}
            </button>
          </div>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FolderTree className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">This folder is empty.</p>
            <p className="text-sm text-slate-400 mb-6">Start by adding sub-topics or subjects.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Create New Item
            </button>
          </div>
        ) : (
          children.map((child) => (
            <div 
              key={child.id}
              onClick={() => router.push(`/admin/tree/${child.id}`)}
              className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl overflow-hidden transition-all duration-200"
            >
              {/* Card Header / Thumbnail */}
              <div className="h-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                {child.thumbnail_url ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img src={child.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                
                <span className="absolute top-2 right-2 text-[10px] font-bold uppercase bg-white/90 backdrop-blur text-slate-700 px-2 py-1 rounded shadow-sm">
                  {child.node_type}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 truncate group-hover:text-blue-600 transition-colors">{child.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Order: {child.order}</span>
                  <span>•</span>
                  <span>{child.children?.length || 0} items</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* JSON Debugger */}
      <div className="mt-8 border border-slate-200 rounded-xl bg-slate-900 text-slate-300 overflow-hidden">
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800">
          <h2 className="font-mono text-xs font-bold text-slate-500 uppercase">Current Node Data</h2>
        </div>
        <div className="p-4 overflow-auto font-mono text-xs max-h-40">
          <pre>{JSON.stringify(currentNode, null, 2)}</pre>
        </div>
      </div>

      <CreateNodeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNode}
        isLoading={isCreating}
        parentId={nodeId} // Pass the ID so the backend knows where to put it!
      />

    </div>
  );
}
