export const ITEMS_PER_PAGE = 10;
export const PRIORITIES = ['low', 'medium', 'high'] as const;
export const FILTERS = ['all', 'active', 'completed'] as const;

// Default to the backend port used by Docker Compose (4000). Override with VITE_API_BASE_URL when needed.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TODOS: '/todos',
  PROFILE: '/profile',
} as const;
