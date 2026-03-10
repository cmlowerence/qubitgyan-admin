// src/components/layout/GlobalSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, FolderTree, FileText, User } from 'lucide-react';
import { globalSearch, SearchResult } from '@/services/search';

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setIsOpen(true);
      try {
        const data = await globalSearch(query);
        setResults(data || []);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNavigate = (item: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    if (item.url && item.url.startsWith('/admin')) {
        router.push(item.url);
    } else {
        switch(item.type) {
        case 'NODE': router.push(`/admin/tree`); break;
        case 'RESOURCE': router.push(`/admin/resources`); break;
        case 'USER': router.push(`/admin/users`); break;
        default: break;
        }
    }
  };

  const nodes = results.filter(r => r.type === 'NODE');
  const resources = results.filter(r => r.type === 'RESOURCE');
  const users = results.filter(r => r.type === 'USER');

  const hasResults = results.length > 0;

  return (
    <div className="relative w-full md:max-w-md lg:max-w-lg" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
          {loading ? (
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search students, resources..."
          className="block w-full pl-10 pr-4 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-800 rounded-full leading-5 bg-slate-100/50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all shadow-sm"
        />
        
        {/* Keyboard shortcut hint (hidden on mobile) */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none hidden sm:flex">
          <kbd className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 uppercase">
            /
          </kbd>
        </div>
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-[calc(100vw-32px)] sm:w-full -ml-[calc(50vw-50%-16px)] sm:ml-0 left-1/2 sm:left-auto sm:right-0 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[150] animate-in slide-in-from-top-2 fade-in">
          {!loading && !hasResults && query.length >= 2 && (
            <div className="p-6 sm:p-8 text-center flex flex-col items-center">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No results found</p>
              <p className="text-xs text-slate-500 mt-1">We couldn't find anything matching "{query}"</p>
            </div>
          )}

          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-2 sm:p-3 space-y-4 custom-scrollbar">
            
            {users.length > 0 && (
              <div>
                <h3 className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Users</h3>
                <div className="space-y-0.5">
                  {users.map(user => (
                    <button 
                      key={`user-${user.id}`}
                      onClick={() => handleNavigate(user)}
                      className="w-full flex items-center gap-3.5 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900 group"
                    >
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                        <User className="h-4 w-4 shrink-0" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.title}</p>
                        {user.subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.subtitle}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {resources.length > 0 && (
              <div>
                <h3 className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 mt-2">Resources</h3>
                <div className="space-y-0.5">
                  {resources.map(res => (
                    <button 
                      key={`res-${res.id}`}
                      onClick={() => handleNavigate(res)}
                      className="w-full flex items-center gap-3.5 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900 group"
                    >
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <FileText className="h-4 w-4 shrink-0" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{res.title}</p>
                        {res.subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{res.subtitle}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {nodes.length > 0 && (
              <div>
                <h3 className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 mt-2">Knowledge Nodes</h3>
                <div className="space-y-0.5">
                  {nodes.map(node => (
                    <button 
                      key={`node-${node.id}`}
                      onClick={() => handleNavigate(node)}
                      className="w-full flex items-center gap-3.5 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900 group"
                    >
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors">
                        <FolderTree className="h-4 w-4 shrink-0" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{node.title}</p>
                        {node.subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{node.subtitle}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}