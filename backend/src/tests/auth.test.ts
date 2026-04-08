import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

describe('Auth Logic', () => {
  const JWT_SECRET = 'test-secret-key-for-testing';

  describe('Password Hashing', () => {
    it('should hash and verify password correctly', async () => {
      const password = 'TestPassword123!';
      const hash = await bcrypt.hash(password, 12);
      expect(await bcrypt.compare(password, hash)).toBe(true);
      expect(await bcrypt.compare('wrong', hash)).toBe(false);
    });

    it('should reject empty password', async () => {
      const hash = await bcrypt.hash('real', 12);
      expect(await bcrypt.compare('', hash)).toBe(false);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'SamePassword123';
      const hash1 = await bcrypt.hash(password, 12);
      const hash2 = await bcrypt.hash(password, 12);
      expect(hash1).not.toBe(hash2);
      expect(await bcrypt.compare(password, hash1)).toBe(true);
      expect(await bcrypt.compare(password, hash2)).toBe(true);
    });
  });

  describe('JWT Tokens', () => {
    it('should generate valid token', () => {
      const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '15m' });
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.userId).toBe(1);
    });

    it('should reject expired token', async () => {
      const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '0s' });
      await new Promise((r) => setTimeout(r, 100));
      expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
    });

    it('should reject token with wrong secret', () => {
      const token = jwt.sign({ userId: 1 }, JWT_SECRET);
      expect(() => jwt.verify(token, 'wrong-secret')).toThrow();
    });

    it('should reject malformed token', () => {
      expect(() => jwt.verify('not.a.token', JWT_SECRET)).toThrow();
    });

    it('should include custom claims in token', () => {
      const token = jwt.sign({ userId: 5, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.userId).toBe(5);
      expect(decoded.role).toBe('admin');
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('user@example.com')).toBe(true);
      expect(emailRegex.test('invalid')).toBe(false);
      expect(emailRegex.test('')).toBe(false);
      expect(emailRegex.test('user@')).toBe(false);
      expect(emailRegex.test('@domain.com')).toBe(false);
    });

    it('should enforce minimum password length', () => {
      expect('short'.length >= 8).toBe(false);
      expect('longpassword123'.length >= 8).toBe(true);
    });
  });
});
