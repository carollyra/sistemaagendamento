import type { ReactNode } from 'react';
import type { Appointment } from '../types';
import { formatDateTime, formatDuration, formatPrice, formatTime } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface AppointmentCardProps {
  appointment: Appointment;
  /** Shows the client details instead of the booking date — used by the admin agenda. */
  showClient?: boolean;
  actions?: ReactNode;
}

export function AppointmentCard({
  appointment,
  showClient = false,
  actions,
}: AppointmentCardProps) {
  const isCancelled = appointment.status === 'CANCELLED';

  return (
    <article
      className={`surface surface-hover group flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
        isCancelled ? 'opacity-65' : ''
      }`}
    >
      <div className="flex items-start gap-4 sm:items-center">
        <div className="border-ink-700 bg-ink-900/80 flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border">
          <span className="font-display text-mist-100 text-sm font-semibold tabular-nums">
            {formatTime(appointment.startsAt)}
          </span>
          <span className="text-mist-500 text-[10px] tracking-wide uppercase">
            {formatDuration(appointment.service.durationMinutes)}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-base font-medium">{appointment.service.name}</h3>
            <StatusBadge status={appointment.status} />
          </div>

          <p className="text-mist-300 text-sm">
            {showClient ? appointment.user.name : formatDateTime(appointment.startsAt)}
          </p>

          <p className="text-mist-500 text-xs">
            {showClient
              ? [appointment.user.phone, appointment.user.email].filter(Boolean).join(' · ')
              : formatPrice(appointment.service.price)}
          </p>

          {appointment.notes && (
            <p className="text-mist-400 border-ink-600 mt-1 border-l-2 pl-3 text-xs italic">
              {appointment.notes}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </article>
  );
}
