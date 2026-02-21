'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDetailedStudentProfile, DetailedStudentProfile } from '@/services/profile';
import { 
  ArrowLeft, Mail, Calendar, Clock, Flame, Trophy, 
  BookOpen, Activity, CheckCircle, PlayCircle, 
  FileText, Link as LinkIcon, Award 
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const getResourceIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO': return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'DOCUMENT': return <FileText className="w-5 h-5 text-gray-500" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 text-indigo-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-4">
        <Activity className="w-10 h-10 animate-spin text-indigo-400" />
        <p className="animate-pulse font-medium">Loading student dossier...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl max-w-2xl mx-auto mt-10 border border-red-100">
        <p className="font-semibold">{error || 'Student not found.'}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm border hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { student_info, gamification, enrollments, recent_activity, quiz_performances } = profile;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Header & Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium text-sm mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

        {/* Avatar */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl shrink-0 z-10">
          {gamification.avatar_url ? (
            <img src={gamification.avatar_url} alt={student_info.name} className="w-full h-full object-cover" />
          ) : (
            student_info.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{student_info.name}</h1>
            <span className={`inline-flex items-center self-center md:self-auto px-2.5 py-1 rounded-full text-xs font-semibold ${student_info.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {student_info.is_active ? 'Active Account' : 'Suspended'}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-gray-500 text-sm mt-3">
            <span className="flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-4 h-4" /> {student_info.email}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-1.5">
              <Calendar className="w-4 h-4" /> Joined {formatDate(student_info.date_joined)}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-1.5">
              <Activity className="w-4 h-4" /> Last seen {formatDate(gamification.last_active_date)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Gamification Top-level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Learning Time</p>
            <p className="text-xl font-bold text-gray-800">{gamification.total_learning_minutes} <span className="text-sm font-normal text-gray-500">mins</span></p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Current Streak</p>
            <p className="text-xl font-bold text-gray-800">{gamification.current_streak} <span className="text-sm font-normal text-gray-500">days</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Best Streak</p>
            <p className="text-xl font-bold text-gray-800">{gamification.longest_streak} <span className="text-sm font-normal text-gray-500">days</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Enrolled Courses</p>
            <p className="text-xl font-bold text-gray-800">{enrollments.length}</p>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Enrollments */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Active Enrollments
            </h2>
            <div className="space-y-3">
              {enrollments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No active courses.</p>
              ) : (
                enrollments.map(course => (
                  <div key={course.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{course.title}</p>
                      <p className="text-xs text-gray-400 mt-1">Since {formatDate(course.enrolled_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Activity & Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quiz Performances (Card List) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-emerald-500" /> Recent Quiz Scores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quiz_performances.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full py-4 text-center">No quizzes taken yet.</p>
              ) : (
                quiz_performances.map(quiz => {
                  const score = quiz.score ?? 0;
                  const max = quiz.max_score ?? 100;
                  const percentage = max > 0 ? (score / max) * 100 : 0;
                  const isPassing = percentage >= 50;

                  return (
                    <div key={quiz.id} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{quiz.quiz_title}</p>
                        <p className="text-xs text-gray-400">{formatDate(quiz.date_taken)}</p>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className={`text-xl font-bold ${isPassing ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {score} <span className="text-sm text-gray-400 font-medium">/ {max}</span>
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${isPassing ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Resource Activity (List) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-500" /> Resource Engagement
            </h2>
            <div className="space-y-3">
              {recent_activity.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
              ) : (
                recent_activity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="mt-1 bg-gray-50 p-2 rounded-lg">
                      {getResourceIcon(activity.resource_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{activity.resource_title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{activity.resource_type}</span>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs text-gray-400">{formatDate(activity.last_accessed)}</span>
                      </div>
                    </div>
                    <div 
                        className="shrink-0 pl-2" 
                        title={activity.is_completed ? "Completed" : "In Progress"}
                        >
                        {activity.is_completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <Clock className="w-5 h-5 text-amber-500" />
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