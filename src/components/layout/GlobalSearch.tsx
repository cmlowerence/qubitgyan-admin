'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, FileText, Folder, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { globalSearch, SearchResult } from '@/services/search';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        const data = await globalSearch(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 w-full bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-sm hover:bg-slate-100 transition-all"
      >
        <Search className="w-4 h-4" />
        <span>Search anything...</span>
        <span className="ml-auto text-[10px] bg-white border px-1.5 py-0.5 rounded shadow-sm">/</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm p-4 md:pt-24 flex justify-center">
      <div className="bg-white w-full max-w-2xl h-fit max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        <div className="p-4 border-b flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-500" />
          <input 
            autoFocus
            placeholder="Search nodes, files, or users..."
            className="flex-1 outline-none text-slate-800 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => {setIsOpen(false); setQuery('');}} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading && <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>}
          
          {!loading && results.map((res) => (
            <button
              key={`${res.type}-${res.id}`}
              onClick={() => {
                router.push(res.url);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
            >
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                {res.type === 'NODE' && <Folder className="w-4 h-4 text-blue-500" />}
                {res.type === 'RESOURCE' && <FileText className="w-4 h-4 text-amber-500" />}
                {res.type === 'USER' && <User className="w-4 h-4 text-purple-500" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{res.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{res.subtitle}</p>
              </div>
            </button>
          ))}
          
          {!loading && query.length > 1 && results.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm italic">
              No matches found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
