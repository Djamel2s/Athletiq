import { describe, it, expect } from 'vitest';

describe('Input Validation', () => {
  describe('Username Validation', () => {
    const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

    it('should accept valid usernames', () => {
      expect(USERNAME_REGEX.test('john_doe')).toBe(true);
      expect(USERNAME_REGEX.test('user123')).toBe(true);
      expect(USERNAME_REGEX.test('abc')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(USERNAME_REGEX.test('ab')).toBe(false); // too short
      expect(USERNAME_REGEX.test('a'.repeat(21))).toBe(false); // too long
      expect(USERNAME_REGEX.test('User')).toBe(false); // uppercase
      expect(USERNAME_REGEX.test('user name')).toBe(false); // space
      expect(USERNAME_REGEX.test('user@name')).toBe(false); // special char
      expect(USERNAME_REGEX.test('')).toBe(false); // empty
    });
  });

  describe('Share Token Validation', () => {
    const TOKEN_REGEX = /^[A-Za-z0-9_-]{6,20}$/;

    it('should accept valid tokens', () => {
      expect(TOKEN_REGEX.test('abc123XY')).toBe(true);
      expect(TOKEN_REGEX.test('a-b_c-d')).toBe(true);
    });

    it('should reject invalid tokens', () => {
      expect(TOKEN_REGEX.test('short')).toBe(false); // too short
      expect(TOKEN_REGEX.test('a'.repeat(21))).toBe(false); // too long
      expect(TOKEN_REGEX.test('has space')).toBe(false);
      expect(TOKEN_REGEX.test('')).toBe(false);
    });
  });

  describe('Session Code Validation', () => {
    const isValidSessionCode = (code: string) => /^[A-Z0-9]{6}$/.test(code);

    it('should accept valid session codes', () => {
      expect(isValidSessionCode('ABC123')).toBe(true);
      expect(isValidSessionCode('X7KM2P')).toBe(true);
    });

    it('should reject invalid session codes', () => {
      expect(isValidSessionCode('abc123')).toBe(false); // lowercase
      expect(isValidSessionCode('AB123')).toBe(false); // too short
      expect(isValidSessionCode('ABC1234')).toBe(false); // too long
      expect(isValidSessionCode('')).toBe(false);
    });
  });

  describe('Numeric Input Sanitization', () => {
    const sanitizeNumber = (val: any, min: number, max: number, fallback: number): number => {
      const num = Number(val);
      if (isNaN(num)) return fallback;
      return Math.max(min, Math.min(max, num));
    };

    it('should clamp values to range', () => {
      expect(sanitizeNumber(50, 0, 100, 0)).toBe(50);
      expect(sanitizeNumber(-5, 0, 100, 0)).toBe(0);
      expect(sanitizeNumber(200, 0, 100, 0)).toBe(100);
    });

    it('should handle NaN', () => {
      expect(sanitizeNumber('abc', 0, 100, 10)).toBe(10);
      expect(sanitizeNumber(undefined, 0, 100, 10)).toBe(10);
    });

    it('should treat null as 0 via Number coercion', () => {
      // Number(null) === 0, so it clamps to range rather than falling back
      expect(sanitizeNumber(null, 0, 100, 10)).toBe(0);
    });
  });
});
