// src/app/admin/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getManagerCourses, updateCourse, deleteCourse, Course } from '@/services/courses';
import { BookOpen, Edit, Trash2, Globe, EyeOff, Plus } from 'lucide-react';
import Link from 'next/link';
import CreateCourseModal from './_components/CreateCourseModal';

export default function CourseManagerPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getManagerCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      await updateCourse(course.id, { is_published: !course.is_published });
      loadCourses(); // Refresh the list
    } catch (error: any) {
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course wrapper? The underlying nodes will remain intact.")) return;
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (error: any) {
      alert(`Failed to delete course: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Course Catalog...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Course Builder</h1>
          <p className="text-gray-500 text-sm">Package your knowledge nodes into publishable courses.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
        <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
            <p className="text-gray-500 mt-1">Start by wrapping a Root Node into a new course.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {/* Thumbnail Placeholder */}
              <div className="h-40 bg-gray-100 relative">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <BookOpen className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {course.is_published ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm"><Globe className="w-3 h-3"/> Published</span>
                  ) : (
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm"><EyeOff className="w-3 h-3"/> Draft</span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{course.description}</p>
                
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded-md mb-4 border border-gray-100">
                  <span className="font-semibold text-gray-600">Root Node:</span> {course.root_node_name || 'Attached Node ID: ' + course.root_node}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={() => togglePublish(course)}
                    className={`text-sm font-medium transition-colors ${course.is_published ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <CreateCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadCourses} 
      />
    </div>
  );
}