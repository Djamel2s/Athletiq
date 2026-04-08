import { describe, it, expect } from 'vitest';

describe('Security - Input Sanitization', () => {
  // Simule ce que Zod fait avec les entrées malveillantes
  const sanitizeEmail = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  it("rejette une injection SQL dans l'email", () => {
    expect(sanitizeEmail("admin'--")).toBe(false);
    expect(sanitizeEmail("' OR '1'='1")).toBe(false);
    expect(sanitizeEmail("admin@test.com'; DROP TABLE users;--")).toBe(false);
  });

  it("rejette un script XSS dans l'email", () => {
    expect(sanitizeEmail('<script>alert("xss")</script>')).toBe(false);
    expect(sanitizeEmail('"><img src=x onerror=alert(1)>')).toBe(false);
  });

  it('accepte des emails normaux', () => {
    expect(sanitizeEmail('user@example.com')).toBe(true);
    expect(sanitizeEmail('jean.dupont@athletiq.fr')).toBe(true);
  });
});

describe('Security - Password Requirements', () => {
  const isStrongEnough = (password: string) => password.length >= 8;

  it('rejette les mots de passe trop courts', () => {
    expect(isStrongEnough('')).toBe(false);
    expect(isStrongEnough('1234567')).toBe(false);
    expect(isStrongEnough('abc')).toBe(false);
  });

  it('accepte les mots de passe de 8+ caractères', () => {
    expect(isStrongEnough('12345678')).toBe(true);
    expect(isStrongEnough('monSuperMotDePasse!')).toBe(true);
  });
});

describe('Security - CORS Origin Validation', () => {
  const isAllowedOrigin = (origin: string | undefined, allowedOrigin: string) => {
    if (!origin) return true; // Pas d'origin = requête serveur/curl
    if (origin === allowedOrigin) return true;
    // En dev, autorise localhost et IPs LAN
    if (!process.env.CORS_ORIGIN) {
      return !!origin.match(
        /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/
      );
    }
    return false;
  };

  it('accepte les requêtes sans origin (curl, mobile)', () => {
    expect(isAllowedOrigin(undefined, 'http://localhost:3000')).toBe(true);
  });

  it("accepte l'origin configurée", () => {
    expect(isAllowedOrigin('http://localhost:3000', 'http://localhost:3000')).toBe(true);
  });

  it('accepte localhost en dev', () => {
    expect(isAllowedOrigin('http://localhost:3000', 'http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://localhost:8080', 'http://localhost:3000')).toBe(true);
  });

  it('rejette une origin inconnue', () => {
    // En prod (CORS_ORIGIN est défini)
    const originalEnv = process.env.CORS_ORIGIN;
    process.env.CORS_ORIGIN = 'https://athletiq.fr';
    expect(isAllowedOrigin('https://evil.com', 'https://athletiq.fr')).toBe(false);
    process.env.CORS_ORIGIN = originalEnv;
  });
});
