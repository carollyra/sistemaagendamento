import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(3, 'Name must have at least 3 characters').max(120),
  description: z.string().trim().max(500).optional(),
  durationMinutes: z
    .number()
    .int()
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration must be at most 480 minutes'),
  price: z.number().nonnegative('Price cannot be negative').max(100000),
  active: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const listServicesQuerySchema = z.object({
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

export const idParamSchema = z.object({
  id: z.uuid('Invalid id'),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
