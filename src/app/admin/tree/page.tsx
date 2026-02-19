'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, AlertCircle, RefreshCw, Plus } from 'lucide-react';

import { getKnowledgeTree, createKnowledgeNode, TreeDepth } from '@/services/tree';
import { KnowledgeNode, CreateNodePayload } from '@/types/tree';

import LoadingScreen from '@/components/ui/loading-screen';
import CreateNodeModal from '@/components/tree/CreateNodeModal';

export default function TreeManagementPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState<TreeDepth>(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTreeData(depth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depth]);

  const loadTreeData = async (selectedDepth: TreeDepth = depth) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getKnowledgeTree(selectedDepth);
      setNodes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load knowledge tree');
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

  if (isLoading) return <LoadingScreen message="Loading Knowledge Tree..." />;

  return (
    <div className="p-4 md:p-6 space-y-5 pb-20">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-800">
            <FolderTree className="w-6 h-6 text-blue-600" />
            Knowledge Tree
          </h1>
          <p className="text-sm text-slate-500">Fetch by depth to reduce backend load and keep the UI fast.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={depth}
            onChange={(e) => setDepth((e.target.value === 'full' ? 'full' : Number(e.target.value)) as TreeDepth)}
            className="px-3 py-2 border border-slate-200 rounded-md bg-white text-sm"
          >
            <option value={1}>Depth 1</option>
            <option value={2}>Depth 2</option>
            <option value={3}>Depth 3</option>
            <option value="full">Full</option>
          </select>
          <button onClick={() => loadTreeData()} className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-md">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            <Plus className="w-4 h-4" /> Add Domain
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Failed to load tree</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden min-h-[300px]">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold text-slate-700 text-sm">Domains</h2>
        </div>
        <div className="p-4 space-y-2">
          {nodes.length === 0 ? (
            <p className="text-slate-400 text-sm">No domains found.</p>
          ) : (
            nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => router.push(`/admin/tree/${node.id}`)}
                className="w-full text-left p-3 border border-slate-100 rounded-lg hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-700 text-sm">{node.name}</p>
                  <p className="text-xs text-slate-400">{node.resource_count || 0} resources</p>
                </div>
                <span className="text-[10px] font-semibold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">{node.node_type}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNode}
        isLoading={isCreating}
      />
    </div>
  );
}
