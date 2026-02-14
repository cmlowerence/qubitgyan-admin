import { api, handleApiError } from '@/lib/api';

export interface QueueStatus {
  pending_count: number;
  sent_count: number;
  failed_count: number;
  total_in_queue: number;
}

export interface DispatchResponse {
  status: string;
  dispatched_count: number;
  message?: string;
}

export const getQueueStatus = async (): Promise<QueueStatus> => {
  try {
    const response = await api.get('/manager/emails/queue_status/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const dispatchEmailBatch = async (limit: number = 20): Promise<DispatchResponse> => {
  try {
    const response = await api.post('/manager/emails/dispatch_batch/', { limit });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};