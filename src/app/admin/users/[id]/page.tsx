// src/app/admin/users/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDetailedStudentProfile, DetailedStudentProfile } from '@/services/profile';
import { 
  ArrowLeft, Mail, Calendar, Clock, Flame, Trophy, 
  BookOpen, Activity, CheckCircle, PlayCircle, 
  FileText, Link as LinkIcon, Award, AlertTriangle
} from 'lucide-react';

export default function StudentDetailedProfile() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<DetailedStudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getDetailedStudentProfile(userId);
        setProfile(data);
      } catch (err) {
        setError('Failed to load student profile.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const getResourceIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO': return <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 dark:text-red-400" />;
      case 'PDF': return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />;
      case 'DOCUMENT': return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400" />;
      default: return <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 dark:text-slate-400" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <Activity className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-500" />
        <p className="animate-pulse font-bold tracking-widest uppercase text-xs sm:text-sm">Loading Dossier...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 p-4">
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/50 p-8 sm:p-10 rounded-3xl max-w-md w-full text-center shadow-2xl shadow-rose-900/5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-rose-900 dark:text-rose-100 mb-2">Profile Unavailable</h3>
          <p className="text-sm sm:text-base font-medium text-rose-600 dark:text-rose-400 mb-8">{error || 'Student not found.'}</p>
          <button 
            onClick={() => router.back()}
            className="w-full px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold rounded-xl shadow-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-95"
          >
            Return to Directory
          </button>
        </div>
      </div>
    );
  }

  const { student_info, gamification, enrollments, recent_activity, quiz_performances } = profile;

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-xs sm:text-sm uppercase tracking-wider focus:outline-none w-max"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Directory
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] -z-0 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] border-4 border-white dark:border-slate-950 shadow-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl sm:text-6xl shrink-0 z-10 rotate-3 transition-transform hover:rotate-0 duration-300">
          {gamification.avatar_url ? (
            <img src={gamification.avatar_url} alt={student_info.name} className="w-full h-full object-cover" />
          ) : (
            student_info.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10 flex flex-col justify-center min-h-[8rem]">
          <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{student_info.name}</h1>
            <span className={`inline-flex items-center self-center md:self-auto px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest ${student_info.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
              {student_info.is_active ? 'Active Account' : 'Suspended'}
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Mail className="w-4 h-4 text-slate-400" /> {student_info.email}
            </span>
            <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-400" /> Joined {formatDate(student_info.date_joined)}
            </span>
            <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Last active {formatDate(gamification.last_active_date)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1 duration-300 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center sm:text-left pt-1">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1.5">Learning Time</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
              {gamification.total_learning_minutes} <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">m</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 transition-all hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50 hover:-translate-y-1 duration-300 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 dark:text-orange-400" />
          </div>
          <div className="text-center sm:text-left pt-1">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1.5">Current Streak</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
              {gamification.current_streak} <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">d</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900/50 hover:-translate-y-1 duration-300 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-center sm:text-left pt-1">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1.5">Best Streak</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
              {gamification.longest_streak} <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">d</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900/50 hover:-translate-y-1 duration-300 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-center sm:text-left pt-1">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1.5">Enrollments</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
              {enrollments.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8 h-full">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-6 tracking-tight">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Active Courses
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {enrollments.length === 0 ? (
                <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No active enrollments.</p>
                </div>
              ) : (
                enrollments.map(course => (
                  <div key={course.id} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors group">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Enrolled {formatDate(course.enrolled_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-6 tracking-tight">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              Recent Quiz Scores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {quiz_performances.length === 0 ? (
                <div className="col-span-full py-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Award className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No quizzes completed yet.</p>
                </div>
              ) : (
                quiz_performances.map(quiz => {
                  const score = quiz.score ?? 0;
                  const max = quiz.max_score ?? 100;
                  const percentage = max > 0 ? (score / max) * 100 : 0;
                  const isPassing = percentage >= 50;

                  return (
                    <div key={quiz.id} className="p-5 sm:p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{quiz.quiz_title}</p>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(quiz.date_taken)}
                        </div>
                      </div>
                      <div className="mt-6 flex items-end justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div>
                          <p className={`text-2xl sm:text-3xl font-black ${isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {score} <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">/ {max}</span>
                          </p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black ${isPassing ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-6 tracking-tight">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Resource Engagement
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {recent_activity.length === 0 ? (
                <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No recent learning activity.</p>
                </div>
              ) : (
                recent_activity.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group">
                    <div className="p-3 sm:p-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm group-hover:scale-110 transition-transform shrink-0">
                      {getResourceIcon(activity.resource_type)}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{activity.resource_title}</p>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5 sm:mt-2">
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{activity.resource_type}</span>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                          <Clock className="w-3 h-3" /> {formatDate(activity.last_accessed)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2" title={activity.is_completed ? "Completed" : "In Progress"}>
                      {activity.is_completed ? (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-800/50 text-amber-500 dark:text-amber-400">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}