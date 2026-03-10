// src/components/resources/ResourceCard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Trash2, 
  ExternalLink, 
  Eye,
  EyeOff,
  Calendar,
  Layers,
  GripVertical,
  Pencil
} from 'lucide-react';
import { Resource } from '@/types/resource';

interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: number) => void;
  onEdit: (resource: Resource) => void;
  dragHandleProps?: any; 
}

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be')) return parsedUrl.pathname.slice(1);
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') return parsedUrl.searchParams.get('v');
      if (parsedUrl.pathname.startsWith('/embed/')) return parsedUrl.pathname.split('/')[2];
      if (parsedUrl.pathname.startsWith('/shorts/')) return parsedUrl.pathname.split('/')[2];
    }
  } catch {}
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function toEmbedUrl(resource: Resource): string | null {
  const targetUrl = resource.external_url || resource.preview_link;
  if (!targetUrl) return null;

  const youtubeId = getYoutubeId(targetUrl);
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`;

  if (resource.resource_type === 'PDF' && /\.pdf(\?.*)?$/i.test(targetUrl)) {
    return `${targetUrl}#toolbar=0&view=FitH`;
  }

  return targetUrl;
}

export function ResourceCard({ resource, onDelete, onEdit, dragHandleProps }: ResourceCardProps) {
  const [isViewing, setIsViewing] = useState(false);
  const embedUrl = useMemo(() => toEmbedUrl(resource), [resource]);
  
  const getIcon = () => {
    switch (resource.resource_type) {
      case 'VIDEO': return <Video className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 dark:text-red-400" />;
      case 'PDF': return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400" />;
      default: return <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 dark:text-slate-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="group relative flex flex-col p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 w-full">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        
        <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto min-w-0">
          {dragHandleProps && (
            <div 
              {...dragHandleProps}
              className="mt-1 sm:mt-0 cursor-grab active:cursor-grabbing p-1.5 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 touch-none shrink-0 transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}

          <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 justify-center">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 truncate pr-2">
              {resource.title}
            </h4>
            
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1.5 mt-1.5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {resource.resource_type}
              </span>
              
              {resource.contexts && resource.contexts.length > 0 && (
                <>
                  <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md border border-purple-200 dark:border-purple-800/50 whitespace-nowrap">
                    {resource.contexts[0].name}
                  </span>
                </>
              )}
              
              <span className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {formatDate(resource.created_at)}
              </div>
              
              {resource.node_name && (
                 <>
                  <span className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
                    in {resource.node_name}
                  </span>
                 </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          
          {embedUrl && (
            <button 
              onClick={() => setIsViewing(!isViewing)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isViewing ? (
                <><EyeOff className="w-4 h-4" /> Close</>
              ) : (
                <><Eye className="w-4 h-4" /> Play</>
              )}
            </button>
          )}

          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto sm:ml-0">
            {resource.external_url && (
              <a 
                href={resource.external_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
                title="Open External Link"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}

            <button 
              onClick={() => onEdit(resource)}
              className="p-2.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Edit Resource"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button 
              onClick={() => onDelete(resource.id)}
              className="p-2.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {isViewing && embedUrl && (
        <div className="mt-4 sm:mt-5 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner">
          {resource.resource_type === 'PDF' ? (
            <iframe 
              src={embedUrl} 
              title={resource.title} 
              className="w-full h-[60vh] min-h-[400px]" 
            />
          ) : (
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title={resource.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}

      <span className="hidden lg:block absolute -top-2.5 -right-2.5 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        ID: {resource.id}
      </span>
    </div>
  );
}