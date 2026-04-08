import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
};
