import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AppointmentCard } from '../components/AppointmentCard';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonList } from '../components/Skeleton';
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
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">Your chair</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">My appointments</h1>
          <p className="text-mist-400 max-w-lg text-sm leading-relaxed">
            Upcoming bookings and everything you have booked before.
          </p>
        </div>

        <Link to="/book">
          <Button size="lg">New appointment</Button>
        </Link>
      </header>

      {justBooked && <Alert tone="success">Appointment booked. See you soon!</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <SkeletonList rows={3} label="Loading appointments" />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-mist-300 text-xs font-medium tracking-[0.2em] uppercase">
                Upcoming
              </h2>
              <span className="bg-ink-700 h-px flex-1" aria-hidden />
              <span className="text-mist-500 text-xs tabular-nums">{upcoming.length}</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="surface flex flex-col items-center gap-4 px-6 py-14 text-center">
                <span className="border-ink-700 bg-ink-900 text-mist-500 flex size-12 items-center justify-center rounded-2xl border">
                  <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="16"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 10h18M8 3v4M16 3v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-display text-mist-100 text-base font-medium">
                    Nothing booked yet
                  </p>
                  <p className="text-mist-400 mt-1.5 text-sm">
                    Your next cut is a couple of taps away.
                  </p>
                </div>
                <Link to="/book">
                  <Button>Book an appointment</Button>
                </Link>
              </div>
            ) : (
              upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actions={
                    <Button variant="danger" size="sm" onClick={() => setToCancel(appointment)}>
                      Cancel
                    </Button>
                  }
                />
              ))
            )}
          </div>

          {past.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-mist-300 text-xs font-medium tracking-[0.2em] uppercase">
                  History
                </h2>
                <span className="bg-ink-700 h-px flex-1" aria-hidden />
                <span className="text-mist-500 text-xs tabular-nums">{past.length}</span>
              </div>

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
