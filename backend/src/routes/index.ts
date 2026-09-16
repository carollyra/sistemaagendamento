import { Router } from 'express';
import { appointmentRoutes } from './appointment.routes.js';
import { authRoutes } from './auth.routes.js';
import { serviceRoutes } from './service.routes.js';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

routes.use('/auth', authRoutes);
routes.use('/services', serviceRoutes);
routes.use('/appointments', appointmentRoutes);
