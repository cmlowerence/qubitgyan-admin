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
      case 'VIDEO': return <Video className="w-5 h-5 text-red-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 text-green-500" />;
      default: return <Layers className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="group relative flex flex-col p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3 w-full sm:w-auto min-w-0">
          {dragHandleProps && (
            <div 
              {...dragHandleProps}
              className="mt-1 sm:mt-0 cursor-grab active:cursor-grabbing p-1.5 text-slate-300 hover:text-slate-600 rounded hover:bg-slate-100 touch-none shrink-0"
              title="Drag to reorder"
            >
              <GripVertical className="w-5 h-5" />
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {resource.title}
            </h4>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {resource.resource_type}
              </span>
              
              {resource.contexts && resource.contexts.length > 0 && (
                <>
                  <span className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded border border-purple-200 whitespace-nowrap">
                    {resource.contexts[0].name}
                  </span>
                </>
              )}
              
              <span className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                {formatDate(resource.created_at)}
              </div>
              
              {resource.node_name && (
                 <>
                  <span className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px] sm:max-w-none">
                    in {resource.node_name}
                  </span>
                 </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto shrink-0">
          
          {embedUrl && (
            <button 
              onClick={() => setIsViewing(!isViewing)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {isViewing ? (
                <><EyeOff className="w-4 h-4" /> Close</>
              ) : (
                <><Eye className="w-4 h-4" /> Play</>
              )}
            </button>
          )}

          <div className="flex items-center gap-1">
            {resource.external_url && (
              <a 
                href={resource.external_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                title="Open External Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button 
              onClick={() => onEdit(resource)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit Resource"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button 
              onClick={() => onDelete(resource.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Inline Player */}
      {isViewing && embedUrl && (
        <div className="mt-4 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
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

      {/* Desktop ID Badge */}
      <span className="hidden sm:block absolute -top-2 -right-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ID: {resource.id}
      </span>
    </div>
  );
}