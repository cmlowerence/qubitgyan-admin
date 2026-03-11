// src/app/admin/contexts/_components/CreateContextForm.tsx
import { Plus, Loader2, Tag } from 'lucide-react';

interface CreateContextFormProps {
  newName: string;
  isCreating: boolean;
  onNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateContextForm({ 
  newName, 
  isCreating, 
  onNameChange, 
  onSubmit 
}: CreateContextFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm transition-colors">
      <div className="relative flex-1 group">
        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
        <input 
          placeholder="Establish new context (e.g. UPSC, Advanced Physics)"
          className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          value={newName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <button 
        disabled={isCreating || !newName.trim()}
        className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-purple-500/30"
      >
        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        <span>Generate</span>
      </button>
    </form>
  );
}