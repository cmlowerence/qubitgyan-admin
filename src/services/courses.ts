import { api, handleApiError } from '@/lib/api';

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  is_published: boolean;
  root_node?: number;      // ID of the top-level KnowledgeNode
  root_node_name?: string; // Read-only from the backend
  created_at: string;
}

export interface CoursePayload {
  title: string;
  description: string;
  thumbnail_url?: string;
  is_published?: boolean;
  root_node: number;       // The node you are wrapping into a course
}

/**
 * Fetch all courses (Manager/Admin view)
 */
export const getManagerCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get('/manager/courses/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
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
 * Update an existing course (e.g., toggling publish status)
 */
export const updateCourse = async (id: number, payload: Partial<CoursePayload>): Promise<Course> => {
  try {
    const response = await api.patch(`/manager/courses/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a course (Does not delete the underlying KnowledgeNodes)
 */
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await api.delete(`/manager/courses/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};