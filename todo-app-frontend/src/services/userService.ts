import type { User } from '../utils/types';
import { apiClient } from './apiClient';

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  updateProfile: async (updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me', updates);
    return response.data;
  },
};
