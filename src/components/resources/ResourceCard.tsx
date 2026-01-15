'use client';

import React from 'react';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Trash2, 
  ExternalLink, 
  Eye,
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

export function ResourceCard({ resource, onDelete, onEdit, dragHandleProps }: ResourceCardProps) {
  
  const getIcon = () => {
    switch (resource.resource_type) {
      case 'VIDEO': 
        return <Video className="w-5 h-5 text-red-500" />;
      case 'PDF': 
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'LINK': 
        return <LinkIcon className="w-5 h-5 text-green-500" />;
      default: 
        return <Layers className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300">
      
      {/* Left Section: Drag, Icon & Info */}
      {/* Added min-w-0 to allow truncation inside flex child */}
      <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
        
        {/* MODIFIED: Drag Handle is now visible on mobile */}
        {dragHandleProps && (
          <div 
            {...dragHandleProps}
            // Increased padding for touch targets on mobile
            className="mt-1 sm:mt-0 cursor-grab active:cursor-grabbing p-2 sm:p-1.5 -ml-2 sm:ml-0 text-slate-300 hover:text-slate-600 rounded hover:bg-slate-100 touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
          {getIcon()}
        </div>
        
        {/* min-w-0 is crucial for text truncation in flex containers */}
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-800 truncate">
            {resource.title}
          </h4>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
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
                <span className="text-[10px] font-bold text-slate-500 truncate max-w-[100px] sm:max-w-none">
                  in {resource.node_name}
                </span>
               </>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Actions */}
      {/* Adjusted spacing and padding for better mobile touch experience */}
      <div className="flex items-center justify-end sm:justify-end gap-2 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
        
        {(resource.preview_link || resource.external_url) && (
          <a 
            href={resource.preview_link || resource.external_url} 
            target="_blank" 
            rel="noopener noreferrer"
            // Increased vertical padding slightly for mobile tap accuracy
            className="flex items-center gap-2 px-4 sm:px-3 py-2 sm:py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="inline">View</span>
          </a>
        )}

        <div className="flex items-center gap-1">
          {(resource.external_url) && (
            <a 
              href={resource.external_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              title="Open Original Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button 
            onClick={() => onEdit(resource)}
            className="p-2.5 sm:p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Resource"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button 
            onClick={() => onDelete(resource.id)}
            className="p-2.5 sm:p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Resource"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ID Badge - Hidden on touch devices to prevent accidental overlap/clicks, visible on group hover for desktop */}
      <span className="hidden sm:block absolute -top-2 -right-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ID: {resource.id}
      </span>
    </div>
  );
}
