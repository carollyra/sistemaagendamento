import { z } from 'zod';
import { isValidDateString } from '../utils/datetime.js';

const dateString = z
  .string()
  .refine(isValidDateString, { message: 'A data deve estar no formato AAAA-MM-DD' });

export const createAppointmentSchema = z.object({
  serviceId: z.uuid('Serviço inválido'),
  startsAt: z.iso.datetime({ offset: true, message: 'A data e hora devem estar no formato ISO' }),
  notes: z.string().trim().max(500).optional(),
});

export const availabilityQuerySchema = z.object({
  serviceId: z.uuid('Serviço inválido'),
  date: dateString,
});

export const agendaQuerySchema = z.object({
  date: dateString.optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
});

export const idParamSchema = z.object({
  id: z.uuid('Identificador inválido'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
