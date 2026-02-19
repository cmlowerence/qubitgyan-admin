import { api, handleApiError } from '@/lib/api';

export interface QueueStatus {
  pending_emails: number;
  total_sent: number;
  failed_count?: number;
  total_in_queue?: number;
}

export interface DispatchResponse {
  status: string;
  dispatched_count: number;
  message?: string;
}

const tryGet = async (urls: string[]) => {
  for (const url of urls) {
    try {
      return await api.get(url);
    } catch (error: any) {
      if (error?.response?.status !== 404) throw error;
    }
  }
  throw new Error('Email queue endpoint not found.');
};

const tryPost = async (urls: string[], payload: any) => {
  for (const url of urls) {
    try {
      return await api.post(url, payload);
    } catch (error: any) {
      if (error?.response?.status !== 404) throw error;
    }
  }
  throw new Error('Email dispatch endpoint not found.');
};

export const getQueueStatus = async (): Promise<QueueStatus> => {
  try {
    const response = await tryGet(['/manager/emails/queue_status/', '/emails/queue_status/']);
    const d = response.data || {};
    return {
      pending_emails: d.pending_emails ?? d.pending_count ?? 0,
      total_sent: d.total_sent ?? d.sent_count ?? 0,
      failed_count: d.failed_count,
      total_in_queue: d.total_in_queue,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const dispatchEmailBatch = async (limit: number = 20, maxSeconds: number = 20): Promise<DispatchResponse> => {
  try {
    const response = await tryPost(['/manager/emails/dispatch_batch/', '/emails/dispatch_batch/', '/dispatch_batch/'], {
      limit,
      max_seconds: maxSeconds,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
