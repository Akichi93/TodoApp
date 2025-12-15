import type { Todo, PaginatedResponse } from '../utils/types';
import { apiClient } from './apiClient';

export interface GetTodosParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

export const todoService = {
  getTodos: async (params: GetTodosParams = {}): Promise<PaginatedResponse<Todo>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.completed !== undefined) queryParams.append('completed', params.completed.toString());
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.dueDateFrom) queryParams.append('dueDateFrom', params.dueDateFrom);
    if (params.dueDateTo) queryParams.append('dueDateTo', params.dueDateTo);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PaginatedResponse<Todo>>(endpoint);
    return response.data;
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/tasks/${id}`);
    return response.data;
  },

  createTodo: async (todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completed'>): Promise<Todo> => {
    const response = await apiClient.post<Todo>('/tasks', todo);
    return response.data;
  },

  updateTodo: async (id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
