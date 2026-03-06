// src/services/emails.ts
import { api, handleApiError } from '@/lib/api';

export interface QueueStatus {
  pending_emails: number;
  total_sent: number;
  failed_count?: number;
  total_in_queue?: number;
  raw_data: any; 
}

export interface QueuedEmail {
  id: number;
  recipient: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  sent_at?: string;
  error_message?: string;
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

const tryPost = async (urls: string[], payload?: any) => {
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
    const response = await tryGet(['/manager/emails/queue_status/']);
    const d = response.data || {};
    console.log('Email Queue Status Response:', d);

    return {
      pending_emails: d.pending_emails?.count ?? d.pending_count ?? 0,
      total_sent: d.sent_emails?.count ?? d.sent_count ?? 0,
      failed_count: d.failed_emails?.count ?? d.failed_count ?? 0,
      total_in_queue: d.total_in_queue,
      raw_data: d,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const dispatchEmailBatch = async (limit: number = 20, maxSeconds: number = 20): Promise<DispatchResponse> => {
  try {
    const response = await tryPost(['/manager/emails/flush/', '/emails/dispatch_batch/', '/dispatch_batch/'], {
      limit,
      max_seconds: maxSeconds,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getEmailList = async (): Promise<QueuedEmail[]> => {
  try {
    const response = await tryGet(['/manager/emails/?limit=50']);
    const emails = response.data || [];

    return emails.map((email: any) => {
      let currentStatus: 'pending' | 'sent' | 'failed' = 'pending';
      
      if (email.is_sent) {
        currentStatus = 'sent';
      } else if (email.error_message) {
        currentStatus = 'failed';
      }

      return {
        id: email.id,
        recipient: email.recipient,
        subject: email.subject,
        status: currentStatus,
        created_at: email.created_at,
        sent_at: email.sent_at,
        error_message: email.error_message,
      };
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const sendIndividualEmail = async (id: number): Promise<void> => {
  try {
    await tryPost([`/manager/emails/${id}/retry/`]);
  } catch (error) {
    throw handleApiError(error);
  }
};