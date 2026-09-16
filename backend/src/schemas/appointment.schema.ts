import { z } from 'zod';
import { isValidDateString } from '../utils/datetime.js';

const dateString = z
  .string()
  .refine(isValidDateString, { message: 'Date must be in the YYYY-MM-DD format' });

export const createAppointmentSchema = z.object({
  serviceId: z.uuid('Invalid service id'),
  startsAt: z.iso.datetime({ offset: true, message: 'startsAt must be an ISO date-time' }),
  notes: z.string().trim().max(500).optional(),
});

export const availabilityQuerySchema = z.object({
  serviceId: z.uuid('Invalid service id'),
  date: dateString,
});

export const agendaQuerySchema = z.object({
  date: dateString.optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
});

export const idParamSchema = z.object({
  id: z.uuid('Invalid id'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
