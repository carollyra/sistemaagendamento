import { useState } from 'react';
import { Alert } from '../../components/Alert';
import { AppointmentCard } from '../../components/AppointmentCard';
import { Button } from '../../components/Button';
import { SkeletonList } from '../../components/Skeleton';
import { useDayAgenda } from '../../hooks/useDayAgenda';
import { getErrorMessage } from '../../services/api';
import * as appointmentService from '../../services/appointment.service';
import type { Appointment } from '../../types';
import { formatLongDate, formatPrice, todayISO } from '../../utils/format';

function shiftDate(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(year, month - 1, day + days);

  return [
    shifted.getFullYear(),
    String(shifted.getMonth() + 1).padStart(2, '0'),
    String(shifted.getDate()).padStart(2, '0'),
  ].join('-');
}

export function AdminAgenda() {
  const [date, setDate] = useState(() => todayISO());
  const { appointments, isLoading, error, setError, refresh } = useDayAgenda(date);
  const [busyId, setBusyId] = useState<string | null>(null);

  const scheduled = appointments.filter((appointment) => appointment.status === 'SCHEDULED');
  const revenue = scheduled.reduce((total, appointment) => total + appointment.service.price, 0);

  async function updateStatus(appointment: Appointment, status: 'COMPLETED' | 'CANCELLED') {
    setBusyId(appointment.id);
    setError('');

    try {
      if (status === 'CANCELLED') {
        await appointmentService.cancelAppointment(appointment.id);
      } else {
        await appointmentService.updateAppointmentStatus(appointment.id, status);
      }

      refresh();
    } catch (updateError) {
      setError(getErrorMessage(updateError, 'Could not update the appointment'));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">{formatLongDate(date)}</h2>
          <p className="text-mist-500 mt-1 text-sm">
            {date === todayISO() ? 'Today at the shop' : 'Scheduled day'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            aria-label="Previous day"
            onClick={() => setDate((current) => shiftDate(current, -1))}
          >
            ‹
          </Button>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value || todayISO())}
            className="field w-auto py-2 [color-scheme:dark]"
            aria-label="Agenda date"
          />
          <Button
            variant="secondary"
            size="sm"
            aria-label="Next day"
            onClick={() => setDate((current) => shiftDate(current, 1))}
          >
            ›
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDate(todayISO())}>
            Today
          </Button>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Scheduled', value: String(scheduled.length), accent: false },
          { label: 'Total bookings', value: String(appointments.length), accent: false },
          { label: 'Expected revenue', value: formatPrice(revenue), accent: true },
        ].map((stat) => (
          <div key={stat.label} className="surface p-5">
            <dt className="text-mist-500 text-[11px] tracking-[0.15em] uppercase">{stat.label}</dt>
            <dd
              className={`font-display mt-2 text-2xl font-semibold tabular-nums ${
                stat.accent ? 'text-gold-400' : 'text-mist-100'
              }`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <SkeletonList rows={3} label="Loading agenda" />
      ) : appointments.length === 0 ? (
        <div className="surface flex flex-col items-center gap-2 px-6 py-14 text-center">
          <p className="font-display text-mist-100 text-base font-medium">A quiet day</p>
          <p className="text-mist-400 text-sm">No appointments booked for this date.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <AppointmentCard
                appointment={appointment}
                showClient
                actions={
                  appointment.status === 'SCHEDULED' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={busyId === appointment.id}
                        onClick={() => updateStatus(appointment, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={busyId === appointment.id}
                        onClick={() => updateStatus(appointment, 'CANCELLED')}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
