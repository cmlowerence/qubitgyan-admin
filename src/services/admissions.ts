// src/services/admissions.ts
import { api, handleApiError } from '@/lib/api';

export type AdmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdmissionRequest {
  id: number;
  student_first_name: string;
  student_last_name: string;
  student_name: string;
  email: string;
  phone: string;
  class_grade?: string;
  learning_goal?: string;
  status: AdmissionStatus;
  created_at: string;
  review_remarks?: string;
}


export interface AdmissionActionResponse {
  status: string;
  username?: string;
  error?: string;
}

/**
 * Fetch all admission requests (Manager/Admin only)
 */
export const getAdmissions = async (): Promise<AdmissionRequest[]> => {
  try {
    const response = await api.get('/manager/admissions/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Approves a student's admission request.
 * Backend creates the user, generates a password, and queues the welcome email.
 * * @param id - The ID of the admission request.
 * @param remarks - Optional notes from the admin processing the request.
 */
export const approveAdmission = async (id: number | string, remarks?: string): Promise<AdmissionActionResponse> => {
  try {
    const response = await api.post(`/manager/admissions/${id}/approve/`, { 
      remarks: remarks || '' 
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Rejects a student's admission request.
 * Backend marks the status as REJECTED and logs the action.
 * * @param id - The ID of the admission request.
 * @param remarks - Optional notes explaining why it was rejected.
 */
export const rejectAdmission = async (id: number | string, remarks?: string): Promise<AdmissionActionResponse> => {
  try {
    const response = await api.post(`/manager/admissions/${id}/reject/`, { 
      remarks: remarks || '' 
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};