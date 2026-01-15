import { Search, Filter, RefreshCw } from 'lucide-react';

interface ResourceToolbarProps {
  searchQuery: string;
  typeFilter: string;
  contextFilter: string;
  contexts: any[];
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onRefresh: () => void;
}

export default function ResourceToolbar({
  searchQuery,
  typeFilter,
  contextFilter,
  contexts,
  isLoading,
  onSearchChange,
  onTypeChange,
  onContextChange,
  onRefresh
}: ResourceToolbarProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl p-4 -mx-4 md:mx-0 md:p-4 rounded-b-2xl md:rounded-2xl border-b md:border border-slate-200 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row gap-3">
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            className="w-full pl-10 pr-4 py-3 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-[1fr_1fr_auto] md:flex gap-2">
          
          <div className="relative">
            <select 
              className="w-full pl-3 pr-8 py-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50 shadow-sm"
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="PDF">PDF Docs</option>
              <option value="VIDEO">Videos</option>
              <option value="LINK">Links</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              className="w-full pl-3 pr-8 py-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50 shadow-sm"
              value={contextFilter}
              onChange={(e) => onContextChange(e.target.value)}
            >
              <option value="ALL">All Tags</option>
              {contexts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={onRefresh}
            className="px-4 bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center shadow-sm active:scale-95"
            title="Refresh List"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
