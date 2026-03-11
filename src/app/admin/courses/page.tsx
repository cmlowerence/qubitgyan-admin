// src/app/admin/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getManagerCourses, updateCourse, deleteCourse, Course } from '@/services/courses';
import { BookOpen, Edit, Trash2, Globe, EyeOff, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import CourseModal from '@/app/admin/courses/_components/CreateCourseModal';
import DebugConsole from '@/components/debug/DebugConsole';

export default function CourseManagerPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getManagerCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, []);

  const togglePublish = async (course: Course) => {
    try {
      await updateCourse(course.id, { is_published: !course.is_published });
      loadCourses();
    } catch (err: any) {
      setError(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this course wrapper? Linked content will not be deleted.")) return;
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err: any) {
      setError(err);
    }
  };

  const openEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-indigo-500" />
        <p className="font-bold tracking-widest uppercase text-xs sm:text-sm animate-pulse">Syncing Course Catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Catalog Exception
          </h1>
          <button 
            onClick={loadCourses}
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
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Course Builder</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Map Knowledge Nodes to student-facing courses.</p>
          </div>
        </div>

        <button 
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-600/30"
        >
          <Plus className="w-5 h-5" /> Construct Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-full mb-4">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">Empty Catalog</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base max-w-md">Click the construct button above to start assembling your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {courses.map((course) => (
            <div key={course.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 overflow-hidden flex flex-col focus-within:ring-4 focus-within:ring-indigo-500/20">
              
              <div className="aspect-[16/9] relative overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                {course.thumbnail_url ? (
                  <>
                    <img src={course.thumbnail_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:scale-105 transition-transform duration-700 ease-out">
                    <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
                
                <div className="absolute top-4 right-4 z-10">
                  {course.is_published ? (
                    <span className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-emerald-400/50">
                      <Globe className="w-3.5 h-3.5" /> Online
                    </span>
                  ) : (
                    <span className="bg-slate-900/90 dark:bg-black/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-slate-700/50">
                      <EyeOff className="w-3.5 h-3.5" /> Draft
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="mb-3 text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 self-start px-2.5 py-1 rounded-md truncate max-w-full">
                  Root: {course.root_node_name}
                </div>
                
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-3 mb-6 leading-relaxed flex-1">
                  {course.description}
                </p>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <button 
                    onClick={() => togglePublish(course)}
                    className={`flex-1 py-3 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all focus:outline-none focus:ring-2 active:scale-95 ${
                      course.is_published 
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 focus:ring-amber-500' 
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 focus:ring-emerald-500'
                    }`}
                  >
                    {course.is_published ? 'Move to Drafts' : 'Make it Online'}
                  </button>
                  
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    <button 
                      onClick={() => openEdit(course)} 
                      className="flex-1 sm:flex-none flex items-center justify-center p-3 sm:p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95"
                      title="Edit Course"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)} 
                      className="flex-1 sm:flex-none flex items-center justify-center p-3 sm:p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-95"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadCourses}
        initialData={selectedCourse}
      />
    </div>
  );
}