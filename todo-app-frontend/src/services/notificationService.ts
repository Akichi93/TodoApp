// Les notifications ne sont pas dans l'API fournie, on garde une structure vide
// qui pourra être implémentée plus tard si l'API est ajoutée

import type { Notification } from '../utils/types';
import { apiClient } from './apiClient';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>(`/notifications`);
    return res.data;
  },

  createNotification: async (
    notification: Omit<Notification, 'id' | 'createdAt'>,
  ): Promise<Notification> => {
    const res = await apiClient.post<Notification>(`/notifications`, notification);
    return res.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch(`/notifications/mark-all-read`);
  },

  sendEmailNotification: async (email: string, subject: string, message: string): Promise<void> => {
    await apiClient.post(`/notifications/send-email`, { email, subject, message });
  },
};
