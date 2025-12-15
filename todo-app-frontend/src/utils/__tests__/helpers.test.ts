import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, isOverdue, getPriorityColor } from '../helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('janvier');
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDateTime(date);
      expect(formatted).toContain('2024');
    });
  });

  describe('isOverdue', () => {
    it('returns true for past dates', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('returns false when no date provided', () => {
      expect(isOverdue()).toBe(false);
    });
  });

  describe('getPriorityColor', () => {
    it('returns correct color for high priority', () => {
      expect(getPriorityColor('high')).toContain('red');
    });

    it('returns correct color for medium priority', () => {
      expect(getPriorityColor('medium')).toContain('yellow');
    });

    it('returns correct color for low priority', () => {
      expect(getPriorityColor('low')).toContain('green');
    });
  });
});

