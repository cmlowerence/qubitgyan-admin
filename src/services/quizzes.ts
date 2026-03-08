// src/services/quizzes.ts
import { api, handleApiError } from '@/lib/api';

export interface QuizOption {
  id?: number;
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id?: number;
  text: string;
  image_url?: string | null;
  marks_positive: number;
  marks_negative: number;
  order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  resource: number;        
  resource_title?: string;    
  passing_score_percentage: number;
  time_limit_minutes: number;
  questions: QuizQuestion[];
}

export interface QuizPayload {
  resource: number;
  passing_score_percentage: number;
  time_limit_minutes: number;
  questions: QuizQuestion[]; 
}

export const getManagerQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await api.get('/manager/quizzes/');
    // Handle both direct arrays and paginated results
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch a single quiz for editing
 */
export const getQuiz = async (id: number): Promise<Quiz> => {
  try {
    const response = await api.get(`/manager/quizzes/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new Quiz with nested questions and options
 */
export const createQuiz = async (payload: QuizPayload): Promise<Quiz> => {
  try {
    const response = await api.post('/manager/quizzes/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an existing Quiz
 */
export const updateQuiz = async (id: number, payload: Partial<QuizPayload>): Promise<Quiz> => {
  try {
    const response = await api.patch(`/manager/quizzes/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a quiz
 */
export const deleteQuiz = async (id: number): Promise<void> => {
  try {
    await api.delete(`/manager/quizzes/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};