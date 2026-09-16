import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AppointmentCard } from '../components/AppointmentCard';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Spinner } from '../components/Spinner';
import { useMyAppointments } from '../hooks/useMyAppointments';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { Appointment } from '../types';

export default function MyAppointments() {
  const location = useLocation();
  const justBooked = Boolean((location.state as { justBooked?: boolean } | null)?.justBooked);

  const { appointments, isLoading, error, loadedAt, setError, refresh } = useMyAppointments();
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { upcoming, past } = useMemo(() => {
    const isUpcoming = (appointment: Appointment) =>
      appointment.status === 'SCHEDULED' && new Date(appointment.startsAt).getTime() > loadedAt;

    return {
      upcoming: appointments
        .filter(isUpcoming)
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
      past: appointments.filter((appointment) => !isUpcoming(appointment)),
    };
  }, [appointments, loadedAt]);

  async function handleCancel() {
    if (!toCancel) {
      return;
    }

    setIsCancelling(true);

    try {
      await appointmentService.cancelAppointment(toCancel.id);
      setToCancel(null);
      refresh();
    } catch (cancelError) {
      setError(getErrorMessage(cancelError, 'Could not cancel this appointment'));
      setToCancel(null);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My appointments</h1>
          <p className="mt-1 text-sm text-stone-400">
            Upcoming bookings and everything you have booked before.
          </p>
        </div>

        <Link to="/book">
          <Button>New appointment</Button>
        </Link>
      </header>

      {justBooked && <Alert tone="success">Appointment booked. See you soon!</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <Spinner label="Loading appointments…" />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-stone-400 uppercase">
              Upcoming
            </h2>

            {upcoming.length === 0 ? (
              <Alert>
                You have no upcoming appointments.{' '}
                <Link to="/book" className="font-medium text-amber-400 hover:text-amber-300">
                  Book one now
                </Link>
                .
              </Alert>
            ) : (
              upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actions={
                    <Button variant="danger" onClick={() => setToCancel(appointment)}>
                      Cancel
                    </Button>
                  }
                />
              ))
            )}
          </div>

          {past.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-stone-400 uppercase">
                History
              </h2>

              {past.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Cancel appointment?"
        description={
          toCancel ? `${toCancel.service.name} — this frees the slot for someone else.` : ''
        }
        confirmLabel="Cancel appointment"
        isLoading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setToCancel(null)}
      />
    </section>
  );
}
