import { Search, Filter, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';

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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1 group min-w-0">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isLoading ? 'text-indigo-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resources by title or topic..."
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all md:hidden flex items-center justify-center shrink-0 focus:outline-none focus:ring-4 ${
            showFilters 
              ? 'bg-indigo-600 border-indigo-600 text-white focus:ring-indigo-500/30' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 focus:ring-slate-500/20'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>

        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="hidden md:flex p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shrink-0"
          title="Refresh Resources"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
        </button>
      </div>

      <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4 animate-in slide-in-from-top-4 duration-300`}>
        <div className="w-full sm:w-auto relative flex-1 sm:flex-none">
          <select 
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full sm:w-auto px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors shadow-sm appearance-none cursor-pointer pr-10"
          >
            <option value="ALL">All Content Types</option>
            <option value="PDF">PDF Documents</option>
            <option value="VIDEO">Videos</option>
            <option value="QUIZ">Assessments</option>
            <option value="EXERCISE">Exercises</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-400" />
        </div>

        <div className="w-full sm:w-auto relative flex-1 sm:flex-none">
          <select 
            value={contextFilter}
            onChange={(e) => onContextChange(e.target.value)}
            className="w-full sm:w-auto px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors shadow-sm appearance-none cursor-pointer pr-10"
          >
            <option value="ALL">All Contexts / Tags</option>
            {contexts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-400" />
        </div>

        {(typeFilter !== 'ALL' || contextFilter !== 'ALL' || searchQuery) && (
          <button 
            onClick={() => {onSearchChange(''); onTypeChange('ALL'); onContextChange('ALL');}}
            className="w-full sm:w-auto text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-rose-500/20"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}