// src/app/admin/quizzes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getManagerQuizzes, deleteQuiz, Quiz } from '@/services/quizzes';
import { HelpCircle, Clock, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function QuizManagerPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getManagerQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to load quizzes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quiz? This will also delete all associated questions and options.")) return;
    try {
      await deleteQuiz(id);
      loadQuizzes();
    } catch (error: any) {
      alert(`Failed to delete quiz: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Quiz Database...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quiz Engine</h1>
          <p className="text-gray-500 text-sm">Manage assessments, questions, and scoring.</p>
        </div>
        {/* Note: This will navigate to a dedicated builder page because the form is too big for a modal! */}
        <Link 
          href="/admin/quizzes/builder"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Quizzes Found</h3>
            <p className="text-gray-500 mt-1">Attach a quiz to a resource to get started.</p>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
              
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                {quiz.resource_title || `Resource #${quiz.resource}`}
              </h3>
              
              <div className="space-y-2 mt-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <span>{quiz.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{quiz.time_limit_minutes} Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{quiz.passing_score_percentage}% to Pass</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
                <Link 
                  href={`/admin/quizzes/builder?id=${quiz.id}`}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(quiz.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}