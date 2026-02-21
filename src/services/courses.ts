// src/services/courses.ts
import { api, handleApiError } from '@/lib/api';

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string | null;
  is_published: boolean;
  root_node: number;      // The ID of the KnowledgeNode (Domain/Subject)
  root_node_name?: string; // Read-only from backend
  created_at: string;
  is_enrolled?: boolean;   // Useful if using this service in student-facing views
}

export interface CoursePayload {
  title: string;
  description: string;
  thumbnail_url?: string | null;
  is_published?: boolean;
  root_node: number;
}

/**
 * Fetch all courses (Manager/Admin view)
 */
export const getManagerCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get('/manager/courses/');
    // Standardizing the response handling for paginated or direct array responses
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch a single course for editing
 */
export const getCourse = async (id: number | string): Promise<Course> => {
  try {
    const response = await api.get(`/manager/courses/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new publishable course
 */
export const createCourse = async (payload: CoursePayload): Promise<Course> => {
  try {
    const response = await api.post('/manager/courses/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an existing course
 */
export const updateCourse = async (id: number | string, payload: Partial<CoursePayload>): Promise<Course> => {
  try {
    const response = await api.patch(`/manager/courses/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a course (Admin/Manager only)
 */
export const deleteCourse = async (id: number | string): Promise<void> => {
  try {
    await api.delete(`/manager/courses/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};