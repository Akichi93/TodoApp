export const JWT_CONSTANTS = {
  ACCESS_TOKEN_SECRET: 'JWT_ACCESS_SECRET',
  REFRESH_TOKEN_SECRET: 'JWT_REFRESH_SECRET',
  // express expiresIn in seconds to satisfy JwtModuleOptions types
  ACCESS_TOKEN_EXPIRES_IN: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRES_IN: 7 * 24 * 60 * 60, // 7 days
};

export const CACHE_KEYS = {
  TASK_PREFIX: 'task:',
  USER_PREFIX: 'user:',
  TASKS_LIST_PREFIX: 'tasks:list:',
};

export const CACHE_TTL = {
  TASK: 3600, // 1 hour
  TASKS_LIST: 300, // 5 minutes
  USER: 1800, // 30 minutes
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
};
