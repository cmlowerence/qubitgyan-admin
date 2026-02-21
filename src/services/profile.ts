// src/services/profile.ts
import { api, handleApiError } from '@/lib/api';

// --- Interfaces matching the Django detailed_profile response ---

export interface StudentInfo {
  id: number;
  name: string;
  username: string;
  email: string;
  date_joined: string;
  is_active: boolean;
}

export interface GamificationStats {
  avatar_url: string | null;
  current_streak: number;
  longest_streak: number;
  total_learning_minutes: number;
  last_active_date: string | null;
}

export interface EnrollmentRecord {
  id: number;
  title: string;
  enrolled_at: string;
}

export interface ActivityRecord {
  id: number;
  resource_title: string;
  resource_type: string;
  is_completed: boolean;
  last_accessed: string;
}

export interface QuizPerformance {
  id: number;
  quiz_title: string;
  score: number | null;
  max_score: number | null;
  is_completed: boolean;
  date_taken: string;
}

export interface DetailedStudentProfile {
  student_info: StudentInfo;
  gamification: GamificationStats;
  enrollments: EnrollmentRecord[];
  recent_activity: ActivityRecord[];
  quiz_performances: QuizPerformance[];
}

// --- API Service Function ---

/**
 * Fetches the comprehensive dashboard view of a specific student for Admins.
 * Aggregates gamification, progress, enrollments, and quiz scores in one call.
 * * @param userId - The ID of the user to fetch.
 * @returns A promise resolving to the DetailedStudentProfile object.
 */
export const getDetailedStudentProfile = async (userId: number | string): Promise<DetailedStudentProfile> => {
  try {
    const response = await api.get(`/users/${userId}/detailed_profile/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};