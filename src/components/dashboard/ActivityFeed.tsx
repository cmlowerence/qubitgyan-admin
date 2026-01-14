import React from 'react';
import { FileText, Video, Link as LinkIcon, Clock } from 'lucide-react';
import { Resource } from '@/types/resource';

export function ActivityFeed({ activity }: { activity: any[] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'PDF': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-red-500" />;
      default: return <LinkIcon className="w-4 h-4 text-emerald-500" />;
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
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {activity.length === 0 ? (
          <p className="text-slate-400 text-sm italic">No recent activity.</p>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="flex gap-4 items-start group">
              <div className="mt-1 p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                {getIcon(item.resource_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    Added to <span className="font-bold text-slate-700">{item.node_name || 'Root'}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] flex items-center gap-1 text-slate-400">
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
