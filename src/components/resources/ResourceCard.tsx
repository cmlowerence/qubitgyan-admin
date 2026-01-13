'use client';

import React from 'react';
import { FileText, Video, Link as LinkIcon, Trash2, ExternalLink, Download } from 'lucide-react';
import { Resource } from '@/types/resource';

interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: number) => void;
}

export function ResourceCard({ resource, onDelete }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.resource_type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-red-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all group">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
          {getIcon()}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-slate-800 truncate">{resource.title}</h4>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            {resource.resource_type}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href={resource.external_url || resource.file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <button 
          onClick={() => onDelete(resource.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
