// src/app/admin/progress/_components/ProgressList.tsx
import { CheckCircle2, Clock, BookOpen, User } from 'lucide-react';
import { ProgressRecord } from '@/services/progress';

interface ProgressListProps {
  records: ProgressRecord[];
}

export default function ProgressList({ records }: ProgressListProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-full mb-4">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Activity Found</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base max-w-md">
          There are no progress records matching your current criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {records.map((record) => (
        <div key={record.id} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 flex flex-col group">
          
          <div className="flex justify-between items-start mb-5 gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-sm border-2 border-white dark:border-slate-800 group-hover:scale-105 transition-transform">
                {record.user_details.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                  {record.user_details.username}
                </span>
                <span className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <User className="w-3 h-3" /> Learner
                </span>
              </div>
            </div>
            
            <div className="shrink-0">
              {record.is_completed ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Completed</span><span className="sm:hidden">Done</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800/50">
                  <Clock className="w-3.5 h-3.5" /> <span className="hidden sm:inline">In Progress</span><span className="sm:hidden">Pending</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mt-auto">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {record.resource_details.title}
              </span>
            </div>
            
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Last Activity
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {new Date(record.last_accessed).toLocaleDateString()}
              </span>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}