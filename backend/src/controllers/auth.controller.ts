import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const session = await authService.register(req.body);
  res.status(201).json(session);
}

export async function login(req: Request, res: Response) {
  const session = await authService.login(req.body);
  res.json(session);
}

export async function me(req: Request, res: Response) {
  const user = await authService.getProfile(req.user!.sub);
  res.json({ user });
}
