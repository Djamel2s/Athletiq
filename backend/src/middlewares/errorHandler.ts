import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { isHttpError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (isHttpError(err)) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Erreur de validation', details: err.errors });
  }

  const message = err instanceof Error ? err.message : 'Unknown error';
  logger.error(
    { err, method: req.method, path: req.path, userId: (req as any).user?.id },
    'Unhandled error'
  );
  return res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'production' ? {} : { message }),
  });
};
