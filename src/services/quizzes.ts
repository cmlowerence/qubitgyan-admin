// src/services/quizzes.ts
import { api, handleApiError } from '@/lib/api';

export interface QuizOption {
  id?: number; // Optional for creation
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id?: number; // Optional for creation
  text: string;
  image_url?: string | null;
  marks_positive: number;
  marks_negative: number;
  order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  resource: number;          // The ID of the Resource (Type: QUIZ) this belongs to
  resource_title?: string;   // Read-only from backend
  passing_score_percentage: number;
  time_limit_minutes: number;
  questions: QuizQuestion[];
}

// Payload for creating/updating a Quiz (Deeply Nested JSON)
export interface QuizPayload {
  resource: number;
  passing_score_percentage: number;
  time_limit_minutes: number;
  questions: Omit<QuizQuestion, 'id'>[]; // ID is omitted for brand new questions
}

/**
 * Fetch all quizzes (Manager/Admin view with correct answers included)
 */
export const getManagerQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await api.get('/manager/quizzes/');
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
 * Create a new Quiz with all its nested questions and options
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
 * Update an existing Quiz (replaces nested data based on your DRF setup)
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