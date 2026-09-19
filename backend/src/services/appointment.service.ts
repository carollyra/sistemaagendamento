import { businessHours, closingMinutes, openingMinutes } from '../config/business.js';
import { prisma } from '../config/prisma.js';
import { AppointmentStatus, Role } from '../generated/prisma/enums.js';
import { AppError } from '../middlewares/error-handler.js';
import type { CreateAppointmentInput } from '../schemas/appointment.schema.js';
import { addMinutes, minutesToTime, toZonedParts, zonedTimeToUtc } from '../utils/datetime.js';
import { getServiceById, toPublicService } from './service.service.js';

const appointmentInclude = {
  service: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
} as const;

type AppointmentWithRelations = Awaited<
  ReturnType<typeof prisma.appointment.findFirstOrThrow<{ include: typeof appointmentInclude }>>
>;

export function toPublicAppointment(appointment: AppointmentWithRelations) {
  return {
    id: appointment.id,
    startsAt: appointment.startsAt,
    endsAt: appointment.endsAt,
    status: appointment.status,
    notes: appointment.notes,
    createdAt: appointment.createdAt,
    service: toPublicService(appointment.service),
    user: appointment.user,
  };
}

function assertWithinBusinessHours(startsAt: Date, durationMinutes: number) {
  const { minutes, weekDay } = toZonedParts(startsAt);

  if (!businessHours.workingWeekDays.includes(weekDay)) {
    throw new AppError(422, 'A barbearia está fechada no dia selecionado');
  }

  if (minutes < openingMinutes || minutes + durationMinutes > closingMinutes) {
    throw new AppError(
      422,
      `Os agendamentos devem estar entre ${minutesToTime(openingMinutes)} e ${minutesToTime(closingMinutes)}`,
    );
  }
}

export async function createAppointment(userId: string, input: CreateAppointmentInput) {
  const service = await getServiceById(input.serviceId);

  if (!service.active) {
    throw new AppError(422, 'Este serviço não está disponível');
  }

  const startsAt = new Date(input.startsAt);

  if (startsAt.getTime() <= Date.now()) {
    throw new AppError(422, 'O agendamento deve ser feito para uma data futura');
  }

  assertWithinBusinessHours(startsAt, service.durationMinutes);

  const endsAt = addMinutes(startsAt, service.durationMinutes);

  const appointment = await prisma.$transaction(
    async (tx) => {
      // Two appointments conflict when their [startsAt, endsAt) ranges overlap.
      const conflict = await tx.appointment.findFirst({
        where: {
          status: AppointmentStatus.SCHEDULED,
          startsAt: { lt: endsAt },
          endsAt: { gt: startsAt },
        },
      });

      if (conflict) {
        throw new AppError(409, 'Este horário já está reservado');
      }

      return tx.appointment.create({
        data: {
          userId,
          serviceId: service.id,
          startsAt,
          endsAt,
          notes: input.notes ?? null,
        },
        include: appointmentInclude,
      });
    },
    { isolationLevel: 'Serializable' },
  );

  return toPublicAppointment(appointment);
}

export async function listUserAppointments(userId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
    include: appointmentInclude,
    orderBy: { startsAt: 'desc' },
  });

  return appointments.map(toPublicAppointment);
}

export async function listDayAgenda(date?: string) {
  const targetDate = date ?? toZonedParts(new Date()).date;
  const dayStart = zonedTimeToUtc(targetDate, 0);
  const dayEnd = zonedTimeToUtc(targetDate, 24 * 60);

  const appointments = await prisma.appointment.findMany({
    where: { startsAt: { gte: dayStart, lt: dayEnd } },
    include: appointmentInclude,
    orderBy: { startsAt: 'asc' },
  });

  return { date: targetDate, appointments: appointments.map(toPublicAppointment) };
}

export async function getAvailability(serviceId: string, date: string) {
  const service = await getServiceById(serviceId);

  if (!service.active) {
    throw new AppError(422, 'Este serviço não está disponível');
  }

  const dayStart = zonedTimeToUtc(date, 0);
  const dayEnd = zonedTimeToUtc(date, 24 * 60);
  const weekDay = toZonedParts(dayStart).weekDay;

  if (!businessHours.workingWeekDays.includes(weekDay)) {
    return { date, serviceId, slots: [] };
  }

  const booked = await prisma.appointment.findMany({
    where: {
      status: AppointmentStatus.SCHEDULED,
      startsAt: { lt: dayEnd },
      endsAt: { gt: dayStart },
    },
    select: { startsAt: true, endsAt: true },
  });

  const slots: { time: string; startsAt: string }[] = [];
  const now = Date.now();

  for (
    let minutes = openingMinutes;
    minutes + service.durationMinutes <= closingMinutes;
    minutes += businessHours.slotIntervalMinutes
  ) {
    const slotStart = zonedTimeToUtc(date, minutes);
    const slotEnd = addMinutes(slotStart, service.durationMinutes);

    if (slotStart.getTime() <= now) {
      continue;
    }

    const overlaps = booked.some(
      (appointment) => appointment.startsAt < slotEnd && appointment.endsAt > slotStart,
    );

    if (!overlaps) {
      slots.push({ time: minutesToTime(minutes), startsAt: slotStart.toISOString() });
    }
  }

  return { date, serviceId, service: toPublicService(service), slots };
}

async function findAppointmentOr404(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: appointmentInclude,
  });

  if (!appointment) {
    throw new AppError(404, 'Agendamento não encontrado');
  }

  return appointment;
}

export async function cancelAppointment(id: string, userId: string, role: Role) {
  const appointment = await findAppointmentOr404(id);

  if (role !== Role.ADMIN && appointment.userId !== userId) {
    throw new AppError(403, 'Você só pode cancelar os seus próprios agendamentos');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError(409, 'Este agendamento já foi cancelado');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError(409, 'Agendamentos concluídos não podem ser cancelados');
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: AppointmentStatus.CANCELLED },
    include: appointmentInclude,
  });

  return toPublicAppointment(updated);
}

export async function updateStatus(id: string, status: AppointmentStatus) {
  await findAppointmentOr404(id);

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: appointmentInclude,
  });

  return toPublicAppointment(updated);
}
