import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { ServiceCard } from '../components/ServiceCard';
import { SkeletonGrid, SkeletonSlots } from '../components/Skeleton';
import { StepIndicator } from '../components/StepIndicator';
import { Textarea } from '../components/Textarea';
import { staggerContainer, staggerItem, stepVariants } from '../lib/motion';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { AvailabilitySlot } from '../services/appointment.service';
import * as serviceService from '../services/service.service';
import type { Service } from '../types';
import { buildDayOptions, formatDuration, formatPrice, formatTime } from '../utils/format';

const STEPS = ['Serviço', 'Data', 'Horário'];
const DAYS_AHEAD = 21;

export default function Book() {
  const navigate = useNavigate();
  const dayOptions = useMemo(() => buildDayOptions(DAYS_AHEAD), []);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    serviceService
      .listServices()
      .then(setServices)
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Não foi possível carregar os serviços')),
      )
      .finally(() => setIsLoadingServices(false));
  }, []);

  const loadSlots = useCallback(async (serviceId: string, date: string) => {
    setIsLoadingSlots(true);
    setError('');

    try {
      const availability = await appointmentService.getAvailability(serviceId, date);
      setSlots(availability.slots);
    } catch (loadError) {
      setSlots([]);
      setError(getErrorMessage(loadError, 'Não foi possível carregar os horários'));
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  /** Keeps the slide direction in sync with the step being opened. */
  function goToStep(nextStep: number) {
    setDirection(nextStep >= step ? 1 : -1);
    setStep(nextStep);
  }

  function handleSelectService(service: Service) {
    setSelectedService(service);
    setSelectedSlot(null);
    setSlots([]);
    goToStep(1);
  }

  function handleSelectDate(date: string) {
    if (!selectedService) {
      return;
    }

    setSelectedDate(date);
    setSelectedSlot(null);
    goToStep(2);
    void loadSlots(selectedService.id, date);
  }

  const selectedDayLabel = dayOptions.find((day) => day.value === selectedDate)?.label;

  async function handleConfirm() {
    if (!selectedService || !selectedSlot) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await appointmentService.createAppointment({
        serviceId: selectedService.id,
        startsAt: selectedSlot.startsAt,
        notes: notes.trim() || undefined,
      });

      toast.success('Agendamento confirmado', {
        description: `${selectedService.name} · ${selectedDayLabel ?? selectedDate} às ${formatTime(
          selectedSlot.startsAt,
        )}`,
      });
      navigate('/appointments');
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, 'Não foi possível reservar este horário'), {
        description: 'A lista de horários abaixo acabou de ser atualizada.',
      });
      void loadSlots(selectedService.id, selectedDate);
      setSelectedSlot(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">
          Novo agendamento
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Agende sua visita</h1>
        <p className="text-mist-400 max-w-lg text-sm leading-relaxed">
          Escolha o serviço, depois o dia e um dos horários livres. A confirmação é na hora.
        </p>
      </header>

      <div className="surface p-5 sm:p-6">
        <StepIndicator steps={STEPS} current={step} onSelect={goToStep} />
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="relative">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {step === 0 && (
            <motion.div
              key="step-service"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-4"
            >
              {isLoadingServices ? (
                <SkeletonGrid />
              ) : services.length === 0 ? (
                <Alert>Nenhum serviço disponível no momento.</Alert>
              ) : (
                <motion.div
                  className="grid gap-4 sm:grid-cols-2"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      variants={staggerItem}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ServiceCard
                        service={service}
                        selected={selectedService?.id === service.id}
                        onSelect={handleSelectService}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 1 && selectedService && (
            <motion.div
              key="step-date"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="border-ink-700/70 bg-ink-850/50 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm">
                <span className="text-mist-100 font-medium">{selectedService.name}</span>
                <span className="text-mist-500" aria-hidden>
                  ·
                </span>
                <span className="text-mist-400">
                  {formatDuration(selectedService.durationMinutes)}
                </span>
                <span className="text-mist-500" aria-hidden>
                  ·
                </span>
                <span className="text-gold-400 font-medium">
                  {formatPrice(selectedService.price)}
                </span>
              </div>

              <motion.div
                className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {dayOptions.map((day) => (
                  <motion.button
                    key={day.value}
                    type="button"
                    variants={staggerItem}
                    whileHover={{ y: -2 }}
                    onClick={() => handleSelectDate(day.value)}
                    className={`ease-smooth rounded-xl border px-2 py-3.5 text-sm transition-colors duration-200 ${
                      selectedDate === day.value
                        ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 shadow-gold'
                        : 'border-ink-700/70 bg-ink-850/70 text-mist-300 hover:border-ink-500 hover:bg-ink-800/80'
                    }`}
                  >
                    {day.label}
                  </motion.button>
                ))}
              </motion.div>

              <Button variant="ghost" size="sm" className="self-start" onClick={() => goToStep(0)}>
                <ArrowLeft className="size-4" aria-hidden />
                Voltar aos serviços
              </Button>
            </motion.div>
          )}

          {step === 2 && selectedService && selectedDate && (
            <motion.div
              key="step-time"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="border-ink-700/70 bg-ink-850/50 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm">
                <span className="text-mist-100 font-medium">{selectedService.name}</span>
                <span className="text-mist-500" aria-hidden>
                  ·
                </span>
                <span className="text-mist-400">{selectedDayLabel ?? selectedDate}</span>
              </div>

              {isLoadingSlots ? (
                <SkeletonSlots />
              ) : slots.length === 0 ? (
                <Alert>Nenhum horário livre neste dia. Escolha outra data.</Alert>
              ) : (
                <motion.div
                  className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {slots.map((slot) => (
                    <motion.button
                      key={slot.startsAt}
                      type="button"
                      variants={staggerItem}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedSlot(slot)}
                      aria-pressed={selectedSlot?.startsAt === slot.startsAt}
                      className={`ease-smooth rounded-xl border py-3 text-sm tabular-nums transition-colors duration-200 ${
                        selectedSlot?.startsAt === slot.startsAt
                          ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 shadow-gold'
                          : 'border-ink-700/70 bg-ink-850/70 text-mist-300 hover:border-ink-500 hover:bg-ink-800/80'
                      }`}
                    >
                      {formatTime(slot.startsAt)}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <Textarea
                label="Observações (opcional)"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Algo que o barbeiro precisa saber?"
              />

              <div className="border-ink-700/70 bg-ink-850/50 flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <p className="text-mist-400">
                    {selectedSlot ? 'Você vai agendar' : 'Selecione um horário para continuar'}
                  </p>
                  {selectedSlot && (
                    <p className="font-display text-mist-100 mt-1 text-lg font-medium">
                      {selectedDayLabel ?? selectedDate} às {formatTime(selectedSlot.startsAt)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Button variant="secondary" onClick={() => goToStep(1)}>
                    Trocar a data
                  </Button>
                  <Button onClick={handleConfirm} isLoading={isSubmitting} disabled={!selectedSlot}>
                    Confirmar agendamento
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
