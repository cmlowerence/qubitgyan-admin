// src/app/admin/contexts/_components/ContextList.tsx
import { Tag, Trash2, Loader2 } from 'lucide-react';

interface ContextListProps {
  contexts: any[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export default function ContextList({ contexts, isLoading, onDelete }: ContextListProps) {
  // Loading State
  if (isLoading && contexts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
        <p className="text-slate-400 text-sm mt-2">Loading tags...</p>
      </div>
    );
  }

  // Empty State
  if (contexts.length === 0) {
    return (
      <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
        <Tag className="w-10 h-10 text-slate-200 mx-auto mb-2" />
        <p className="text-slate-400 font-medium">No contexts found.</p>
        <p className="text-slate-300 text-xs">Create one above to get started.</p>
      </div>
    );
  }

  // List State
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {contexts.map((ctx) => (
        <div 
          key={ctx.id} 
          className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            <span className="font-bold text-slate-700 truncate text-sm md:text-base">
              {ctx.name}
            </span>
          </div>
          
          <button 
            onClick={() => onDelete(ctx.id)}
            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
            title="Delete Context"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
