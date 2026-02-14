// src/app/admin/tree/[nodeId]/_components/NodeHeader.tsx
import { 
  FolderTree, 
  ArrowLeft, 
  Settings2, 
  Plus
} from 'lucide-react';
import { KnowledgeNode } from '@/types/tree';

interface NodeHeaderProps {
  node: KnowledgeNode | null;
  isTopic: boolean;
  onBack: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onAddSubItem: () => void;
}

export default function NodeHeader({ 
  node, 
  isTopic, 
  onBack, 
  onEdit, 
  onAddSubItem 
}: NodeHeaderProps) {
  return (
    <div className="space-y-4">
      <button 
        onClick={onBack}
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
              {node?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isTopic ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                {node?.node_type}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500">ID: #{node?.id}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={onEdit}
            className="p-3 bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:text-blue-600 rounded-xl transition-all active:scale-90"
          >
            <Settings2 className="w-5 h-5" />
          </button>
          {!isTopic && (
            <button 
              onClick={onAddSubItem}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-100 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Sub-Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
