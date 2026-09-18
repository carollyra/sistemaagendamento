import { api } from './api';
import type { Appointment, Service } from '../types';

export interface AvailabilitySlot {
  time: string;
  startsAt: string;
}

export interface Availability {
  date: string;
  serviceId: string;
  service?: Service;
  slots: AvailabilitySlot[];
}

export async function getAvailability(serviceId: string, date: string): Promise<Availability> {
  const { data } = await api.get<Availability>('/appointments/availability', {
    params: { serviceId, date },
  });

  return data;
}

export async function createAppointment(payload: {
  serviceId: string;
  startsAt: string;
  notes?: string;
}): Promise<Appointment> {
  const { data } = await api.post<{ appointment: Appointment }>('/appointments', payload);
  return data.appointment;
}

export async function listMyAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<{ appointments: Appointment[] }>('/appointments/me');
  return data.appointments;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await api.patch<{ appointment: Appointment }>(`/appointments/${id}/cancel`);
  return data.appointment;
}

export async function getDayAgenda(date?: string): Promise<{
  date: string;
  appointments: Appointment[];
}> {
  const { data } = await api.get<{ date: string; appointments: Appointment[] }>(
    '/appointments/agenda',
    { params: date ? { date } : undefined },
  );

  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
): Promise<Appointment> {
  const { data } = await api.patch<{ appointment: Appointment }>(`/appointments/${id}/status`, {
    status,
  });

  return data.appointment;
}
