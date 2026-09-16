import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';
import { authenticate, requireAdmin } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import {
  agendaQuerySchema,
  availabilityQuerySchema,
  createAppointmentSchema,
  idParamSchema,
  updateStatusSchema,
} from '../schemas/appointment.schema.js';

export const appointmentRoutes = Router();

appointmentRoutes.get(
  '/availability',
  validate(availabilityQuerySchema, 'query'),
  appointmentController.availability,
);

appointmentRoutes.use(authenticate);

appointmentRoutes.post('/', validate(createAppointmentSchema), appointmentController.create);
appointmentRoutes.get('/me', appointmentController.listMine);
appointmentRoutes.patch(
  '/:id/cancel',
  validate(idParamSchema, 'params'),
  appointmentController.cancel,
);

appointmentRoutes.get(
  '/agenda',
  requireAdmin,
  validate(agendaQuerySchema, 'query'),
  appointmentController.agenda,
);
appointmentRoutes.patch(
  '/:id/status',
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(updateStatusSchema),
  appointmentController.updateStatus,
);
