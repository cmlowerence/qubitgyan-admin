// src/app/admin/contexts/_components/ContextList.tsx
import { Tag, Trash2, Loader2, Hash } from 'lucide-react';

interface ContextListProps {
  contexts: any[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export default function ContextList({ contexts, isLoading, onDelete }: ContextListProps) {
  if (isLoading && contexts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-500" />
        <p className="font-bold tracking-widest uppercase text-xs sm:text-sm text-slate-400 animate-pulse">Retrieving Lexicon...</p>
      </div>
    );
  }

  if (contexts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-full mb-4">
          <Tag className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Lexicon Empty</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base max-w-md">No contexts detected in the system. Use the generator above to establish your primary nomenclature.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {contexts.map((ctx) => (
        <div 
          key={ctx.id} 
          className="group flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
        >
          <div className="flex items-center gap-3.5 sm:gap-4 overflow-hidden min-w-0">
            <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors shrink-0">
              <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400" />
            </div>
            <span className="font-black text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
              {ctx.name}
            </span>
          </div>
          
          <button 
            onClick={() => onDelete(ctx.id)}
            className="p-2.5 sm:p-3 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500"
            title="Purge Context"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}