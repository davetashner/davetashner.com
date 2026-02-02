import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatRssDate,
  getRelativeTime,
  isFutureDate,
} from '../../src/utils/dates';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format a date in long form', () => {
      const date = new Date('2024-01-15T12:00:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should handle different months', () => {
      const date = new Date('2024-12-25T12:00:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('December');
    });
  });

  describe('formatRssDate', () => {
    it('should return a valid RFC 2822 date string', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const formatted = formatRssDate(date);
      // RFC 2822 format includes day name, date, month name, year, time, and GMT
      expect(formatted).toContain('GMT');
      expect(formatted).toContain('2024');
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      // Mock Date.now() to return a fixed time
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "today" for today\'s date', () => {
      const today = new Date('2024-06-15T10:00:00Z');
      expect(getRelativeTime(today)).toBe('today');
    });

    it('should return "yesterday" for yesterday\'s date', () => {
      const yesterday = new Date('2024-06-14T12:00:00Z');
      expect(getRelativeTime(yesterday)).toBe('yesterday');
    });

    it('should return "X days ago" for dates within a week', () => {
      const fiveDaysAgo = new Date('2024-06-10T12:00:00Z');
      expect(getRelativeTime(fiveDaysAgo)).toBe('5 days ago');
    });

    it('should return "1 week ago" for a date 7 days ago', () => {
      const oneWeekAgo = new Date('2024-06-08T12:00:00Z');
      expect(getRelativeTime(oneWeekAgo)).toBe('1 week ago');
    });

    it('should return "X weeks ago" for dates within a month', () => {
      const threeWeeksAgo = new Date('2024-05-25T12:00:00Z');
      expect(getRelativeTime(threeWeeksAgo)).toBe('3 weeks ago');
    });

    it('should return "1 month ago" for a date about 30 days ago', () => {
      const oneMonthAgo = new Date('2024-05-16T12:00:00Z');
      expect(getRelativeTime(oneMonthAgo)).toBe('1 month ago');
    });

    it('should return "X months ago" for dates within a year', () => {
      const sixMonthsAgo = new Date('2024-01-01T12:00:00Z');
      expect(getRelativeTime(sixMonthsAgo)).toMatch(/\d+ months ago/);
    });

    it('should return "1 year ago" for a date about 365 days ago', () => {
      const oneYearAgo = new Date('2023-06-15T12:00:00Z');
      expect(getRelativeTime(oneYearAgo)).toBe('1 year ago');
    });

    it('should return "X years ago" for older dates', () => {
      const twoYearsAgo = new Date('2022-06-15T12:00:00Z');
      expect(getRelativeTime(twoYearsAgo)).toBe('2 years ago');
    });
  });

  describe('isFutureDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for a future date', () => {
      const futureDate = new Date('2024-12-25T12:00:00Z');
      expect(isFutureDate(futureDate)).toBe(true);
    });

    it('should return false for a past date', () => {
      const pastDate = new Date('2024-01-01T12:00:00Z');
      expect(isFutureDate(pastDate)).toBe(false);
    });

    it('should return false for the current moment', () => {
      const now = new Date('2024-06-15T12:00:00Z');
      expect(isFutureDate(now)).toBe(false);
    });
  });
});
