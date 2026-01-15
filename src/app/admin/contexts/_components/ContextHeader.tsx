import { Tag, RefreshCw } from 'lucide-react';

interface ContextHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ContextHeader({ isLoading, onRefresh }: ContextHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">Exam Contexts</h1>
          <p className="text-xs md:text-sm text-slate-500">Manage tags for resources (JEE, NEET, etc.)</p>
        </div>
      </div>
      <button 
        onClick={onRefresh} 
        className="self-start md:self-auto p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        aria-label="Refresh contexts"
      >
        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
