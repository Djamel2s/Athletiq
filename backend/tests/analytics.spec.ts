import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the AppDataSource used by analyticsService
vi.mock('../src/config/database.js', () => {
  return {
    AppDataSource: {
      query: vi.fn(),
      getRepository: vi.fn(),
    },
  };
});

import { AppDataSource } from '../src/config/database.js';
import { computeFatigueForUser } from '../src/services/analyticsService.ts';

describe('analyticsService.computeFatigueForUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('computes fatigue and persists a record', async () => {
    // weekly load
    (AppDataSource.query as any)
      .mockResolvedValueOnce([{ load: '2000' }]) // weekly
      .mockResolvedValueOnce([{ load28: '8000' }]); // 28d baseline

    const saved = { id: 1 };
    const repoMock = {
      create: vi.fn((obj) => obj),
      save: vi.fn(async (obj) => ({ ...obj, id: 1 })),
    };
    (AppDataSource.getRepository as any).mockReturnValue(repoMock);

    const res = await computeFatigueForUser(42);
    expect(res).toHaveProperty('score');
    expect(res.score).toBeGreaterThanOrEqual(0);
    expect(res.score).toBeLessThanOrEqual(1);
    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
  });
});
