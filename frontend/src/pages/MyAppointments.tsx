import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus, CalendarRange } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert } from '../components/Alert';
import { AppointmentCard } from '../components/AppointmentCard';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonList } from '../components/Skeleton';
import { useMyAppointments } from '../hooks/useMyAppointments';
import { staggerContainer, staggerItem } from '../lib/motion';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { Appointment } from '../types';

export default function MyAppointments() {
  const { appointments, isLoading, error, loadedAt, refresh } = useMyAppointments();
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
      toast.success('Appointment cancelled', {
        description: `${toCancel.service.name} — the slot is free again.`,
      });
      setToCancel(null);
      refresh();
    } catch (cancelError) {
      toast.error(getErrorMessage(cancelError, 'Could not cancel this appointment'));
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
          <Button size="lg">
            <CalendarPlus className="size-4" aria-hidden />
            New appointment
          </Button>
        </Link>
      </header>

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
                  <CalendarRange className="size-5" aria-hidden />
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
              <motion.ul
                className="flex flex-col gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence initial={false}>
                  {upcoming.map((appointment) => (
                    <motion.li
                      key={appointment.id}
                      layout
                      variants={staggerItem}
                      exit={{ opacity: 0, y: -8 }}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        actions={
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setToCancel(appointment)}
                          >
                            Cancel
                          </Button>
                        }
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
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

              <motion.ul
                className="flex flex-col gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {past.map((appointment) => (
                  <motion.li key={appointment.id} variants={staggerItem}>
                    <AppointmentCard appointment={appointment} />
                  </motion.li>
                ))}
              </motion.ul>
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
