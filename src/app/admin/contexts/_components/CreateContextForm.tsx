// src/app/admin/contexts/_components/CreateContextForm.tsx
import { Plus, Loader2 } from 'lucide-react';

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
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <input 
        placeholder="New Context Name (e.g. UPSC)"
        className="flex-1 w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <button 
        disabled={isCreating || !newName}
        className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all"
      >
        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        <span>Add Tag</span>
      </button>
    </form>
  );
}
