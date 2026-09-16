import type { NextFunction, Request, Response } from 'express';
import { Role } from '../generated/prisma/enums.js';
import { verifyToken } from '../utils/jwt.js';
import { AppError } from './error-handler.js';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication token is missing');
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== Role.ADMIN) {
    throw new AppError(403, 'Admin access required');
  }

  next();
}

/** Attaches `req.user` when a valid token is present, but never blocks the request. */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(authHeader.slice('Bearer '.length).trim());
    } catch {
      // ignore invalid tokens on public routes
    }
  }

  next();
}
