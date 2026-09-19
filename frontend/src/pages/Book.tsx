import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CalendarCheck, Clock3, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { DateStrip } from '../components/DateStrip';
import { ServiceCard } from '../components/ServiceCard';
import { SkeletonGrid, SkeletonSlots } from '../components/Skeleton';
import { StepIndicator } from '../components/StepIndicator';
import { Textarea } from '../components/Textarea';
import { TimePills } from '../components/TimePills';
import { serviceImage } from '../lib/images';
import { staggerContainer, staggerItem, stepVariants } from '../lib/motion';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { AvailabilitySlot } from '../services/appointment.service';
import * as serviceService from '../services/service.service';
import type { Service } from '../types';
import {
  buildDayOptions,
  formatDuration,
  formatMonthTitle,
  formatPrice,
  formatTime,
} from '../utils/format';

const STEPS = ['Serviço', 'Data', 'Horário'];

const BOOKING_NOTES = [
  {
    icon: Clock3,
    title: 'Duração real',
    text: 'Cada serviço reserva o tempo que realmente leva na cadeira.',
  },
  {
    icon: CalendarCheck,
    title: 'Confirmação na hora',
    text: 'Sem espera por retorno: o horário é seu assim que você confirma.',
  },
  {
    icon: RotateCcw,
    title: 'Cancelou, liberou',
    text: 'Cancelar é livre e devolve o horário para a agenda na hora.',
  },
];
const DAYS_AHEAD = 21;

/** Compact reminder of the service picked in step one. */
function SelectionSummary({ service }: { service: Service }) {
  return (
    <div className="border-ink-700/70 bg-ink-850 flex items-center gap-3 rounded-2xl border p-3">
      <img
        src={serviceImage(service.name, { width: 200, height: 200 })}
        alt=""
        loading="lazy"
        className="size-12 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="font-display truncate text-sm font-bold tracking-tight">{service.name}</p>
        <p className="text-mist-500 text-xs">
          {formatDuration(service.durationMinutes)} · {formatPrice(service.price)}
        </p>
      </div>
    </div>
  );
}

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
                  className="grid gap-3 sm:grid-cols-2"
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

              <ul className="grid gap-3 sm:grid-cols-3">
                {BOOKING_NOTES.map((note) => (
                  <li key={note.title} className="surface flex items-start gap-3 p-4">
                    <span className="border-gold-500/30 bg-gold-500/10 text-gold-400 flex size-9 shrink-0 items-center justify-center rounded-xl border">
                      <note.icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold tracking-tight">{note.title}</p>
                      <p className="text-mist-400 mt-1 text-xs leading-relaxed">{note.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
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
              <SelectionSummary service={selectedService} />

              <div className="surface flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold tracking-tight">
                    {formatMonthTitle(dayOptions[0].value)}
                  </h2>
                  <span className="text-mist-500 text-xs">Próximos {DAYS_AHEAD} dias</span>
                </div>

                <DateStrip days={dayOptions} selected={selectedDate} onSelect={handleSelectDate} />
              </div>

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
              <SelectionSummary service={selectedService} />

              <div className="surface flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold tracking-tight">
                    {formatMonthTitle(selectedDate)}
                  </h2>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-mist-400 hover:text-gold-300 text-xs transition"
                  >
                    Ver todos os dias
                  </button>
                </div>

                <DateStrip
                  days={dayOptions}
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                    void loadSlots(selectedService.id, date);
                  }}
                />
              </div>

              <div className="surface flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold tracking-tight">Horários</h2>
                  {!isLoadingSlots && slots.length > 0 && (
                    <span className="text-mist-500 text-xs">{slots.length} livres</span>
                  )}
                </div>

                {isLoadingSlots ? (
                  <SkeletonSlots />
                ) : slots.length === 0 ? (
                  <Alert>Nenhum horário livre neste dia. Escolha outra data.</Alert>
                ) : (
                  <TimePills
                    slots={slots}
                    selected={selectedSlot?.startsAt}
                    onSelect={(startsAt) =>
                      setSelectedSlot(slots.find((slot) => slot.startsAt === startsAt) ?? null)
                    }
                    wrap
                  />
                )}
              </div>

              <div className="surface p-5">
                <Textarea
                  label="Observações (opcional)"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Algo que o barbeiro precisa saber?"
                />
              </div>

              <div className="border-ink-700/70 bg-ink-850 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <p className="text-mist-400">
                    {selectedSlot ? 'Você vai agendar' : 'Selecione um horário para continuar'}
                  </p>
                  {selectedSlot && (
                    <p className="font-display text-mist-100 mt-1 text-lg font-bold tracking-tight">
                      {selectedDayLabel ?? selectedDate} às {formatTime(selectedSlot.startsAt)} ·{' '}
                      {formatPrice(selectedService.price)}
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5">
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
