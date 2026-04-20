import { describe, it, expect } from 'vitest';
import { calculateTrend, formatDuration } from '../utils/helpers';

describe('VenueQ Utility Helpers', () => {
  describe('calculateTrend', () => {
    it('should return stable for empty or single item history', () => {
      expect(calculateTrend([])).toBe('stable');
      expect(calculateTrend([10])).toBe('stable');
    });

    it('should detect rising trends', () => {
      expect(calculateTrend([10, 20])).toBe('rising');
    });

    it('should detect falling trends', () => {
      expect(calculateTrend([20, 10])).toBe('falling');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(formatDuration(0)).toBe('Immediate');
      expect(formatDuration(45)).toBe('45m');
    });

    it('should format hours correctly', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(90)).toBe('1h 30m');
    });
  });
});
