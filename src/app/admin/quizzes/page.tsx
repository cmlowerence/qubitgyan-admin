'use client';

import { useEffect, useState } from 'react';
import { getManagerQuizzes, deleteQuiz, Quiz } from '@/services/quizzes';
import { HelpCircle, Clock, CheckCircle, Edit, Trash2, Plus, AlertTriangle, RefreshCw, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import DebugConsole from '@/components/debug/DebugConsole';

export default function QuizManagerPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getManagerQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This will also delete all associated questions and options.")) return;
    try {
      await deleteQuiz(id);
      loadQuizzes();
    } catch (err: any) {
      setError(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <FileQuestion className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-indigo-500" />
        <p className="font-bold tracking-widest uppercase text-xs sm:text-sm animate-pulse">Loading Quiz Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Engine Exception
          </h1>
          <button 
            onClick={loadQuizzes}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Connection
          </button>
        </div>
        <DebugConsole error={error} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <FileQuestion className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Quiz Engine</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Manage assessments, questions, and scoring criteria.</p>
          </div>
        </div>

        <Link 
          href="/admin/quizzes/builder"
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-600/30"
        >
          <Plus className="w-5 h-5" /> Create Assessment
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-full mb-4">
            <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">No Assessments Found</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base max-w-md">Create a new quiz and attach it to a knowledge resource to begin evaluating students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col relative overflow-hidden group hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -z-0 transition-transform duration-500 group-hover:scale-125" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl shrink-0">
                    <FileQuestion className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white line-clamp-2 leading-tight pt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {quiz.resource_title || `Resource #${quiz.resource}`}
                  </h3>
                </div>
                
                <div className="space-y-3 mt-auto mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <HelpCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>{quiz.questions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>{quiz.time_limit_minutes} Minutes</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>{quiz.passing_score_percentage}% to Pass</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link 
                    href={`/admin/quizzes/builder?id=${quiz.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <Edit className="w-4 h-4" /> <span className="sm:hidden">Edit</span>
                  </Link>
                  <button 
                    onClick={() => handleDelete(quiz.id)} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="sm:hidden">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}