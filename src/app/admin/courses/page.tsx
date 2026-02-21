'use client';

import { useEffect, useState } from 'react';
import { getManagerCourses, updateCourse, deleteCourse, Course } from '@/services/courses';
import { BookOpen, Edit, Trash2, Globe, EyeOff, Plus, MoreVertical } from 'lucide-react';
import CourseModal from '@/app/admin/courses/_components/CreateCourseModal';

export default function CourseManagerPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getManagerCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, []);

  const togglePublish = async (course: Course) => {
    try {
      await updateCourse(course.id, { is_published: !course.is_published });
      loadCourses();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course wrapper? Linked content will not be deleted.")) return;
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
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

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-400">Syncing Course Catalog...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Course Builder</h1>
          <p className="text-gray-500 font-medium">Map Knowledge Nodes to student-facing courses.</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" /> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Empty Catalog</h3>
            <p className="text-gray-400">Click the button above to start your first course.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all overflow-hidden flex flex-col border-b-4 border-b-gray-50">
              {/* Thumbnail Area */}
              <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-12 h-12 text-gray-300" /></div>
                )}
                <div className="absolute top-4 right-4">
                  {course.is_published ? (
                    <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-emerald-200/50 ring-2 ring-white/20"><Globe className="w-3 h-3"/> Online</span>
                  ) : (
                    <span className="bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-black/20 ring-2 ring-white/10"><EyeOff className="w-3 h-3"/> Draft</span>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 self-start px-2 py-1 rounded-md">
                   Root: {course.root_node_name}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 leading-relaxed flex-1">{course.description}</p>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                   <button 
                    onClick={() => togglePublish(course)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${course.is_published ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    {course.is_published ? 'Move to Drafts' : 'Make it Online'}
                  </button>
                  <button onClick={() => openEdit(course)} className="p-3 bg-gray-50 text-gray-500 hover:text-blue-600 rounded-xl transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(course.id)} className="p-3 bg-gray-50 text-gray-500 hover:text-rose-600 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadCourses}
        initialData={selectedCourse}
      />
    </div>
  );
}