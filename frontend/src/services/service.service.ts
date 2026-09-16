import { api } from './api';
import type { Service } from '../types';

export async function listServices(includeInactive = false): Promise<Service[]> {
  const { data } = await api.get<{ services: Service[] }>('/services', {
    params: includeInactive ? { includeInactive: 'true' } : undefined,
  });

  return data.services;
}

export async function createService(payload: {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}): Promise<Service> {
  const { data } = await api.post<{ service: Service }>('/services', payload);
  return data.service;
}

export async function updateService(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    active: boolean;
  }>,
): Promise<Service> {
  const { data } = await api.patch<{ service: Service }>(`/services/${id}`, payload);
  return data.service;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}
