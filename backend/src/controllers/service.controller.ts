import type { Request, Response } from 'express';
import * as serviceService from '../services/service.service.js';

export async function list(req: Request, res: Response) {
  const includeInactive =
    (req.query as { includeInactive?: boolean }).includeInactive === true &&
    req.user?.role === 'ADMIN';

  res.json({ services: await serviceService.listServices(includeInactive) });
}

export async function show(req: Request, res: Response) {
  res.json({ service: await serviceService.findService(String(req.params.id)) });
}

export async function create(req: Request, res: Response) {
  res.status(201).json({ service: await serviceService.createService(req.body) });
}

export async function update(req: Request, res: Response) {
  res.json({ service: await serviceService.updateService(String(req.params.id), req.body) });
}

export async function remove(req: Request, res: Response) {
  const result = await serviceService.deleteService(String(req.params.id));

  if (result.deleted) {
    res.status(204).send();
    return;
  }

  res.json({
    message: 'Service has appointments and was deactivated instead of deleted',
    service: result.service,
  });
}
