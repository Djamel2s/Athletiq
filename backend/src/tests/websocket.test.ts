import { describe, it, expect } from 'vitest';

describe('WebSocket Validation', () => {
  const isValidSessionCode = (code: any): boolean =>
    typeof code === 'string' && /^[A-Z0-9]{6}$/.test(code);

  const isValidNumber = (val: any, min: number, max: number): boolean =>
    typeof val === 'number' && !isNaN(val) && val >= min && val <= max;

  describe('Session Code', () => {
    it('should validate correct codes', () => {
      expect(isValidSessionCode('ABC123')).toBe(true);
      expect(isValidSessionCode('X7KM2P')).toBe(true);
    });

    it('should reject non-strings', () => {
      expect(isValidSessionCode(123)).toBe(false);
      expect(isValidSessionCode(null)).toBe(false);
      expect(isValidSessionCode(undefined)).toBe(false);
    });

    it('should reject invalid string formats', () => {
      expect(isValidSessionCode('abc123')).toBe(false); // lowercase
      expect(isValidSessionCode('AB12')).toBe(false); // too short
      expect(isValidSessionCode('ABCDEF1')).toBe(false); // too long
      expect(isValidSessionCode('')).toBe(false);
    });
  });

  describe('Numeric Ranges', () => {
    it('should validate reps (0-10000)', () => {
      expect(isValidNumber(10, 0, 10000)).toBe(true);
      expect(isValidNumber(0, 0, 10000)).toBe(true);
      expect(isValidNumber(10000, 0, 10000)).toBe(true);
      expect(isValidNumber(-1, 0, 10000)).toBe(false);
      expect(isValidNumber(10001, 0, 10000)).toBe(false);
    });

    it('should validate rest time (0-600)', () => {
      expect(isValidNumber(90, 0, 600)).toBe(true);
      expect(isValidNumber(0, 0, 600)).toBe(true);
      expect(isValidNumber(600, 0, 600)).toBe(true);
      expect(isValidNumber(601, 0, 600)).toBe(false);
    });

    it('should reject NaN and Infinity', () => {
      expect(isValidNumber(NaN, 0, 100)).toBe(false);
      expect(isValidNumber(Infinity, 0, 100)).toBe(false);
      expect(isValidNumber(-Infinity, 0, 100)).toBe(false);
    });

    it('should reject non-number types', () => {
      expect(isValidNumber('10' as any, 0, 100)).toBe(false);
      expect(isValidNumber(null, 0, 100)).toBe(false);
      expect(isValidNumber(undefined, 0, 100)).toBe(false);
    });
  });
});
