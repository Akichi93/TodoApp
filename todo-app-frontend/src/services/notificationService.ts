// Les notifications ne sont pas dans l'API fournie, on garde une structure vide
// qui pourra être implémentée plus tard si l'API est ajoutée

import type { Notification } from '../utils/types';

export const notificationService = {
  getNotifications: async (_userId: string): Promise<Notification[]> => {
    // TODO: Implémenter quand l'API sera disponible
    return [];
  },

  createNotification: async (_notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
    // TODO: Implémenter quand l'API sera disponible
    throw new Error('Notifications API not implemented');
  },

  markAsRead: async (_id: string): Promise<void> => {
    // TODO: Implémenter quand l'API sera disponible
  },

  markAllAsRead: async (_userId: string): Promise<void> => {
    // TODO: Implémenter quand l'API sera disponible
  },

  sendEmailNotification: async (email: string, subject: string, message: string): Promise<void> => {
    // TODO: Implémenter quand l'API sera disponible
    console.log(`Email notification: ${email} - ${subject} - ${message}`);
  },
};
