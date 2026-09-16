import type { ReactNode } from 'react';
import type { Appointment } from '../types';
import { formatDateTime, formatDuration, formatPrice, formatTime } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface AppointmentCardProps {
  appointment: Appointment;
  /** Shows the client name instead of the booking date — used by the admin agenda. */
  showClient?: boolean;
  actions?: ReactNode;
}

export function AppointmentCard({
  appointment,
  showClient = false,
  actions,
}: AppointmentCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-stone-100">{appointment.service.name}</h3>
          <StatusBadge status={appointment.status} />
        </div>

        <p className="text-sm text-stone-300">
          {showClient
            ? `${formatTime(appointment.startsAt)} – ${formatTime(appointment.endsAt)}`
            : formatDateTime(appointment.startsAt)}
        </p>

        <p className="text-xs text-stone-500">
          {showClient
            ? `${appointment.user.name}${appointment.user.phone ? ` · ${appointment.user.phone}` : ''}`
            : `${formatDuration(appointment.service.durationMinutes)} · ${formatPrice(appointment.service.price)}`}
        </p>

        {appointment.notes && (
          <p className="mt-1 text-xs text-stone-400 italic">“{appointment.notes}”</p>
        )}
      </div>

      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </article>
  );
}
