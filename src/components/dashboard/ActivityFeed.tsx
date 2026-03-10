// src/components/dashboard/ActivityFeed.tsx
import React from 'react';
import { FileText, Video, Link as LinkIcon, Clock, Activity } from 'lucide-react';

export function ActivityFeed({ activity }: { activity: any[] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'PDF': return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case 'VIDEO': return <Video className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default: return <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all w-full">
      <h3 className="font-black text-slate-800 dark:text-slate-100 mb-5 sm:mb-6 flex items-center gap-2 tracking-tight text-base sm:text-lg">
        <Activity className="w-5 h-5 text-indigo-500" /> Recent Activity
      </h3>
      
      <div className="space-y-4 sm:space-y-5">
        {activity.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium italic">No recent activity detected.</p>
          </div>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="flex gap-3.5 sm:gap-4 items-start group">
              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors shrink-0">
                {getIcon(item.resource_type)}
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 sm:mt-1.5">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">
                    Added to <span className="font-bold text-slate-700 dark:text-slate-300">{item.node_name || 'Root'}</span>
                  </span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-400 dark:text-slate-500 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" /> {getTimeAgo(item.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}