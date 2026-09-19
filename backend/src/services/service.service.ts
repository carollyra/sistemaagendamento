import { prisma } from '../config/prisma.js';
import type { ServiceModel } from '../generated/prisma/models.js';
import { AppError } from '../middlewares/error-handler.js';
import type { CreateServiceInput, UpdateServiceInput } from '../schemas/service.schema.js';

export interface PublicService {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  active: boolean;
}

export function toPublicService(service: ServiceModel): PublicService {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    price: Number(service.price),
    active: service.active,
  };
}

export async function listServices(includeInactive = false) {
  const services = await prisma.service.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { name: 'asc' },
  });

  return services.map(toPublicService);
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    throw new AppError(404, 'Serviço não encontrado');
  }

  return service;
}

export async function findService(id: string) {
  return toPublicService(await getServiceById(id));
}

export async function createService(input: CreateServiceInput) {
  const existing = await prisma.service.findUnique({ where: { name: input.name } });

  if (existing) {
    throw new AppError(409, 'Já existe um serviço com esse nome');
  }

  const service = await prisma.service.create({ data: input });

  return toPublicService(service);
}

export async function updateService(id: string, input: UpdateServiceInput) {
  await getServiceById(id);

  if (input.name) {
    const duplicated = await prisma.service.findFirst({
      where: { name: input.name, NOT: { id } },
    });

    if (duplicated) {
      throw new AppError(409, 'Já existe um serviço com esse nome');
    }
  }

  const service = await prisma.service.update({ where: { id }, data: input });

  return toPublicService(service);
}

/**
 * Services referenced by appointments are deactivated instead of removed,
 * so the appointment history stays intact.
 */
export async function deleteService(id: string) {
  await getServiceById(id);

  const appointments = await prisma.appointment.count({ where: { serviceId: id } });

  if (appointments > 0) {
    const service = await prisma.service.update({ where: { id }, data: { active: false } });

    return { deleted: false, service: toPublicService(service) };
  }

  await prisma.service.delete({ where: { id } });

  return { deleted: true, service: null };
}
