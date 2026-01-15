import { CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { ProgressRecord } from '@/services/progress';

interface ProgressListProps {
  records: ProgressRecord[];
}

export default function ProgressList({ records }: ProgressListProps) {
  if (records.length === 0) {
    return (
      <div className="col-span-full py-20 text-center text-slate-400">
        No activity records found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map((record) => (
        <div key={record.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                {record.user_details.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-bold text-slate-700">{record.user_details.username}</span>
            </div>
            
            {record.is_completed ? (
              <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <CheckCircle2 className="w-3 h-3" /> COMPLETED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                <Clock className="w-3 h-3" /> IN PROGRESS
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-slate-300 mt-0.5" />
              <span className="text-sm font-medium text-slate-600 line-clamp-2 leading-snug">
                {record.resource_details.title}
              </span>
            </div>
            
            <div className="pt-3 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Last activity: {new Date(record.last_accessed).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
