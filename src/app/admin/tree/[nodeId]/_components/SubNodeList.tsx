// src/app/admin/tree/[nodeId]/_components/SubNodeList.tsx
import { Pencil, Image as ImageIcon, FolderTree } from 'lucide-react';
import { KnowledgeNode } from '@/types/tree';

interface SubNodeListProps {
  childrenNodes: KnowledgeNode[];
  onNavigate: (id: number) => void;
  onEdit: (e: React.MouseEvent, node: KnowledgeNode) => void;
  onAddFirstItem: () => void;
}

export default function SubNodeList({ 
  childrenNodes, 
  onNavigate, 
  onEdit, 
  onAddFirstItem 
}: SubNodeListProps) {
  
  if (!Array.isArray(childrenNodes) || childrenNodes.length === 0) {
    return (
      <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
        <FolderTree className="w-12 h-12 text-slate-200 mb-4" />
        <h3 className="text-slate-600 font-bold">This folder is empty</h3>
        <p className="text-slate-400 text-sm mt-1 mb-6">Start building your knowledge tree by adding items.</p>
        <button 
          onClick={onAddFirstItem}
          className="px-6 py-2 bg-white border border-slate-200 text-blue-600 text-sm font-bold rounded-lg hover:shadow-sm transition-all"
        >
          Add First Item
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {childrenNodes.map((child: any) => (
        <div 
          key={child.id}
          onClick={() => onNavigate(child.id)}
          className="group relative cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <button
            onClick={(e) => onEdit(e, child)}
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
              <span>{child.items_count || 0} Items</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span>{child.resource_count || 0} Resources</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
