// src/app/admin/resources/_components/ResourceList.tsx
import { Resource } from '@/types/resource';
import { FileText, Video, ClipboardCheck, Code, MoreVertical, ExternalLink, Pencil, Trash2, Loader2, Search } from 'lucide-react';

interface ResourceListProps {
  resources: Resource[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit: (resource: Resource) => void;
  onClearFilters: () => void;
}

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'PDF': return <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><FileText className="w-5 h-5" /></div>;
    case 'VIDEO': return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Video className="w-5 h-5" /></div>;
    case 'QUIZ': return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ClipboardCheck className="w-5 h-5" /></div>;
    default: return <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><Code className="w-5 h-5" /></div>;
  }
};

export default function ResourceList({ resources, isLoading, onDelete, onEdit, onClearFilters }: ResourceListProps) {
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">

        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />

        <p className="text-slate-400 font-medium animate-pulse">Scanning database...</p>

      </div>
  );
  if (resources.length === 0) return (
    
<div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 mx-4 md:mx-0">

        <div className="p-4 bg-white rounded-full shadow-sm mb-3">

          <Search className="w-8 h-8 text-slate-300" />

        </div>

        <h3 className="text-slate-900 font-bold">No resources found</h3>

        <p className="text-slate-500 text-sm mt-1 px-4">Try adjusting your filters or search terms.</p>

        <button 

          onClick={onClearFilters}

          className="mt-4 text-blue-600 text-sm font-bold hover:underline"

        >

          Clear filters

        </button>

      </div>
  );

  return (
    <div className="grid grid-cols-1 gap-3">
      {resources.map((res) => (
        <div 
          key={res.id} 
          className="group flex items-center gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all"
        >
          <TypeIcon type={res.resource_type} />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-blue-600 transition-colors">
              {res.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                {res.node_name || 'Unsorted'}
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">•</span>
              <span className="text-xs text-slate-400 hidden md:inline">
                Added {new Date(res.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(res)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(res.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}