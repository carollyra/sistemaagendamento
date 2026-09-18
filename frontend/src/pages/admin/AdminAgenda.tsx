import { useState } from 'react';
import { Alert } from '../../components/Alert';
import { AppointmentCard } from '../../components/AppointmentCard';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-100">Agenda</h2>
          <p className="text-sm text-stone-400">{formatLongDate(date)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setDate((current) => shiftDate(current, -1))}>
            ‹ Previous
          </Button>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value || todayISO())}
            className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
          />
          <Button variant="secondary" onClick={() => setDate((current) => shiftDate(current, 1))}>
            Next ›
          </Button>
          <Button variant="ghost" onClick={() => setDate(todayISO())}>
            Today
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <p className="text-xs tracking-wide text-stone-500 uppercase">Scheduled</p>
          <p className="mt-1 text-2xl font-semibold text-stone-100">{scheduled.length}</p>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <p className="text-xs tracking-wide text-stone-500 uppercase">Total bookings</p>
          <p className="mt-1 text-2xl font-semibold text-stone-100">{appointments.length}</p>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <p className="text-xs tracking-wide text-stone-500 uppercase">Expected revenue</p>
          <p className="mt-1 text-2xl font-semibold text-amber-400">{formatPrice(revenue)}</p>
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <Spinner label="Loading agenda…" />
      ) : appointments.length === 0 ? (
        <Alert>No appointments for this day.</Alert>
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
                        isLoading={busyId === appointment.id}
                        onClick={() => updateStatus(appointment, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="danger"
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
