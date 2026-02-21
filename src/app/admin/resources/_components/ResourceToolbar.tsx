// src/app/admin/resources/_components/ResourceToolbar.tsx
import { Search, Filter, RefreshCw, X, FileText, Play, HelpCircle, Pencil } from 'lucide-react';
import React from 'react';

interface ResourceToolbarProps {
  searchQuery: string;
  typeFilter: string;
  contextFilter: string;
  contexts: any[];
  isLoading: boolean;
  onSearchChange: (val: string) => void;
  onTypeChange: (val: string) => void;
  onContextChange: (val: string) => void;
  onRefresh: () => void;
}

export default function ResourceToolbar({
  searchQuery, typeFilter, contextFilter, contexts, isLoading,
  onSearchChange, onTypeChange, onContextChange, onRefresh
}: ResourceToolbarProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isLoading ? 'text-blue-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by filename or topic..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-2xl border transition-all md:hidden ${showFilters ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          <Filter className="w-5 h-5" />
        </button>

        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="hidden md:flex p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-3 animate-in slide-in-from-top-2 duration-200`}>
        <select 
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none hover:border-blue-300 transition-colors shadow-sm appearance-none"
        >
          <option value="ALL">All Formats</option>
          <option value="PDF">PDF Documents</option>
          <option value="VIDEO">Videos</option>
          <option value="QUIZ">Assessments</option>
          <option value="EXERCISE">Exercises</option>
        </select>

        <select 
          value={contextFilter}
          onChange={(e) => onContextChange(e.target.value)}
          className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none hover:border-blue-300 transition-colors shadow-sm appearance-none"
        >
          <option value="ALL">All Contexts</option>
          {contexts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {(typeFilter !== 'ALL' || contextFilter !== 'ALL' || searchQuery) && (
          <button 
            onClick={() => {onSearchChange(''); onTypeChange('ALL'); onContextChange('ALL');}}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}