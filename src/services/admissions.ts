// src/services/admissions.ts
import { api, handleApiError } from '@/lib/api';

export type AdmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdmissionRequest {
  id: number;
  student_name: string;
  email: string;
  phone: string;
  class_grade?: string;
  learning_goal?: string;
  status: AdmissionStatus;
  created_at: string;
}

export interface ProcessAdmissionPayload {
  status: 'APPROVED' | 'REJECTED';
  review_remarks?: string;
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
 * Approve or Reject a student application
 */
export const processAdmission = async (id: number, payload: ProcessAdmissionPayload): Promise<AdmissionRequest> => {
  try {
    const response = await api.patch(`/manager/admissions/${id}/process_application/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};