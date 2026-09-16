import type { Request, Response } from 'express';
import type { AppointmentStatus } from '../generated/prisma/enums.js';
import * as appointmentService from '../services/appointment.service.js';

export async function create(req: Request, res: Response) {
  const appointment = await appointmentService.createAppointment(req.user!.sub, req.body);
  res.status(201).json({ appointment });
}

export async function listMine(req: Request, res: Response) {
  res.json({ appointments: await appointmentService.listUserAppointments(req.user!.sub) });
}

export async function availability(req: Request, res: Response) {
  const { serviceId, date } = req.query as unknown as { serviceId: string; date: string };
  res.json(await appointmentService.getAvailability(serviceId, date));
}

export async function agenda(req: Request, res: Response) {
  const { date } = req.query as unknown as { date?: string };
  res.json(await appointmentService.listDayAgenda(date));
}

export async function cancel(req: Request, res: Response) {
  const appointment = await appointmentService.cancelAppointment(
    String(req.params.id),
    req.user!.sub,
    req.user!.role,
  );

  res.json({ appointment });
}

export async function updateStatus(req: Request, res: Response) {
  const { status } = req.body as { status: AppointmentStatus };
  res.json({ appointment: await appointmentService.updateStatus(String(req.params.id), status) });
}
