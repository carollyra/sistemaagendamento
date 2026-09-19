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
import { usePublicServices } from '../hooks/usePublicServices';
import { images, serviceImage } from '../lib/images';
import { formatDuration, formatPrice } from '../utils/format';
import { staggerContainer, staggerItem } from '../lib/motion';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { Appointment } from '../types';

export default function MyAppointments() {
  const { appointments, isLoading, error, loadedAt, refresh } = useMyAppointments();
  const { services } = usePublicServices();
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
      toast.success('Agendamento cancelado', {
        description: `${toCancel.service.name} — o horário voltou a ficar livre.`,
      });
      setToCancel(null);
      refresh();
    } catch (cancelError) {
      toast.error(getErrorMessage(cancelError, 'Não foi possível cancelar este agendamento'));
      setToCancel(null);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <section className="flex flex-col gap-10">
      <header className="rounded-panel relative overflow-hidden">
        <img
          src={images.band({ width: 1600, height: 460 })}
          alt=""
          className="photo absolute inset-0 size-full object-cover"
        />
        <div className="photo-scrim absolute inset-0" aria-hidden />

        <div className="relative flex flex-col gap-5 p-6 pt-24 sm:flex-row sm:items-end sm:justify-between sm:p-8 sm:pt-32">
          <div className="flex flex-col gap-2">
            <p className="text-gold-400 text-eyebrow font-medium uppercase">Sua cadeira</p>
            <h1 className="text-heading sm:text-display font-semibold text-white">
              Meus <span className="text-light text-mist-300">agendamentos</span>
            </h1>
            <p className="text-mist-300 text-body max-w-md">
              Seus próximos horários e tudo o que você já agendou.
            </p>
          </div>

          <Link to="/book">
            <Button size="lg">
              <CalendarPlus className="size-4" aria-hidden />
              Novo agendamento
            </Button>
          </Link>
        </div>
      </header>

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <SkeletonList rows={3} label="Carregando agendamentos" />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-mist-400 text-eyebrow font-medium uppercase">Próximos</h2>
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
                    Nenhum horário agendado
                  </p>
                  <p className="text-mist-400 mt-1.5 text-sm">
                    Seu próximo corte está a dois toques daqui.
                  </p>
                </div>
                <Link to="/book">
                  <Button>Agendar horário</Button>
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
                      whileHover={{ scale: 1.01 }}
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
                            Cancelar
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
                <h2 className="text-mist-400 text-eyebrow font-medium uppercase">Histórico</h2>
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

      {/* Quick way back into the booking flow */}
      {services.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-mist-400 text-eyebrow font-medium uppercase">Agende de novo</h2>
            <span className="bg-ink-700 h-px flex-1" aria-hidden />
          </div>

          <motion.ul
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.li key={service.id} variants={staggerItem} whileHover={{ scale: 1.02 }}>
                <Link
                  to="/book"
                  className="group rounded-media border-ink-700/70 bg-ink-850 hover:border-ink-500 ease-smooth flex h-full flex-col overflow-hidden border transition-colors duration-300"
                >
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={serviceImage(service.name, { width: 400, height: 260 })}
                      alt=""
                      loading="lazy"
                      className="photo ease-smooth size-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="photo-scrim absolute inset-0 opacity-80" aria-hidden />
                    <p className="font-display absolute right-3 bottom-2 left-3 truncate text-sm font-bold tracking-tight text-white">
                      {service.name}
                    </p>
                  </div>
                  <div className="text-mist-500 flex items-center justify-between px-3 py-2.5 text-xs">
                    {formatDuration(service.durationMinutes)}
                    <span className="text-gold-400 font-display text-sm font-bold tabular-nums">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      )}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Cancelar agendamento?"
        description={
          toCancel ? `${toCancel.service.name} — o horário fica livre para outra pessoa.` : ''
        }
        confirmLabel="Sim, cancelar"
        isLoading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setToCancel(null)}
      />
    </section>
  );
}
