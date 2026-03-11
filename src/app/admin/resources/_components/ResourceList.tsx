import { Resource } from '@/types/resource';
import { FileText, Video, ClipboardCheck, Code, Pencil, Trash2, Loader2, Search, ExternalLink } from 'lucide-react';

interface ResourceListProps {
  resources: Resource[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit: (resource: Resource) => void;
  onClearFilters: () => void;
}

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'PDF': return <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl"><FileText className="w-6 h-6" /></div>;
    case 'VIDEO': return <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl"><Video className="w-6 h-6" /></div>;
    case 'QUIZ': return <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl"><ClipboardCheck className="w-6 h-6" /></div>;
    default: return <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl"><Code className="w-6 h-6" /></div>;
  }
};

export default function ResourceList({ resources, isLoading, onDelete, onEdit, onClearFilters }: ResourceListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning database...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/30 mx-4 md:mx-0">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
          <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">No resources found</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 px-4">Try adjusting your filters or search terms to find what you're looking for.</p>
        <button 
          onClick={onClearFilters}
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {resources.map((res) => (
        <div 
          key={res.id} 
          className="group flex flex-col p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 min-h-[140px]"
        >
          <div className="flex items-start gap-4 mb-auto">
            <TypeIcon type={res.resource_type} />
            
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                {res.title}
              </h4>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md truncate max-w-[120px] sm:max-w-[160px]">
                {res.node_name || 'Unsorted'}
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                {new Date(res.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
              {res.external_url && (
                <a 
                  href={res.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Open Link"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              <button 
                onClick={() => onEdit(res)}
                className="p-2 sm:p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit Resource"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={() => onDelete(res.id)}
                className="p-2 sm:p-2.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
                title="Delete Resource"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}