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

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search Effect
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
        // console.error("Search failed", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Wait 300ms after last keystroke

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNavigate = (item: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    // Fallback routing just in case your backend 'url' is meant for the API rather than the frontend
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

  // Group the flat array into categories for the UI
  const nodes = results.filter(r => r.type === 'NODE');
  const resources = results.filter(r => r.type === 'RESOURCE');
  const users = results.filter(r => r.type === 'USER');

  const hasResults = results.length > 0;

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search students, courses, resources (Press '/')"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white dark:bg-slate-950 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50">
          {!loading && !hasResults && query.length >= 2 && (
            <div className="p-4 text-center text-sm text-slate-500">
              No results found for "{query}"
            </div>
          )}

          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            
            {/* Users */}
            {users.length > 0 && (
              <div>
                <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Users</h3>
                {users.map(user => (
                  <button 
                    key={`user-${user.id}`}
                    onClick={() => handleNavigate(user)}
                    className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <User className="h-5 w-5 text-purple-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{user.title}</p>
                      {user.subtitle && <p className="text-xs text-slate-500 truncate">{user.subtitle}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <div>
                <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-2">Resources</h3>
                {resources.map(res => (
                  <button 
                    key={`res-${res.id}`}
                    onClick={() => handleNavigate(res)}
                    className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{res.title}</p>
                      {res.subtitle && <p className="text-xs text-slate-500 truncate">{res.subtitle}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Nodes */}
            {nodes.length > 0 && (
              <div>
                <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-2">Knowledge Nodes</h3>
                {nodes.map(node => (
                  <button 
                    key={`node-${node.id}`}
                    onClick={() => handleNavigate(node)}
                    className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <FolderTree className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{node.title}</p>
                      {node.subtitle && <p className="text-xs text-slate-500 truncate">{node.subtitle}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}