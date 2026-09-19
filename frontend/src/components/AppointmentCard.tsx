import type { ReactNode } from 'react';
import { CalendarDays, Clock3, Phone } from 'lucide-react';
import type { Appointment } from '../types';
import { serviceImage } from '../lib/images';
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
      className={`rounded-media bg-ink-900 ease-smooth flex flex-col gap-4 border border-white/[0.06] p-3 transition-colors duration-300 hover:border-white/[0.14] sm:flex-row sm:items-center sm:gap-5 ${
        isCancelled ? 'opacity-60' : ''
      }`}
    >
      <div className="relative h-24 shrink-0 overflow-hidden rounded-xl sm:size-24">
        <img
          src={serviceImage(appointment.service.name, { width: 300, height: 300 })}
          alt=""
          loading="lazy"
          className="photo size-full object-cover"
        />
        <span className="bg-ink-950/75 font-display absolute inset-x-0 bottom-0 py-1 text-center text-sm font-bold tabular-nums text-white backdrop-blur-sm">
          {formatTime(appointment.startsAt)}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:py-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-display text-base font-bold tracking-tight">
            {appointment.service.name}
          </h3>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="text-mist-400 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {showClient ? (
            <>
              <span className="text-mist-200 text-sm">{appointment.user.name}</span>
              {appointment.user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" aria-hidden />
                  {appointment.user.phone}
                </span>
              )}
            </>
          ) : (
            <span className="text-mist-200 flex items-center gap-1.5 text-sm">
              <CalendarDays className="size-3.5" aria-hidden />
              {formatDateTime(appointment.startsAt)}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden />
            {formatDuration(appointment.service.durationMinutes)}
          </span>

          <span className="text-gold-400 font-medium tabular-nums">
            {formatPrice(appointment.service.price)}
          </span>
        </div>

        {appointment.notes && (
          <p className="text-mist-400 border-ink-600 border-l-2 pl-3 text-xs italic">
            {appointment.notes}
          </p>
        )}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap gap-2 sm:pr-2">{actions}</div>}
    </article>
  );
}
