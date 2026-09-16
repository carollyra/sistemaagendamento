import { Router } from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import {
  createServiceSchema,
  idParamSchema,
  listServicesQuerySchema,
  updateServiceSchema,
} from '../schemas/service.schema.js';

export const serviceRoutes = Router();

serviceRoutes.get(
  '/',
  optionalAuthenticate,
  validate(listServicesQuerySchema, 'query'),
  serviceController.list,
);
serviceRoutes.get('/:id', validate(idParamSchema, 'params'), serviceController.show);

serviceRoutes.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createServiceSchema),
  serviceController.create,
);
serviceRoutes.patch(
  '/:id',
  authenticate,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(updateServiceSchema),
  serviceController.update,
);
serviceRoutes.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate(idParamSchema, 'params'),
  serviceController.remove,
);
