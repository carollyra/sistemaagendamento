import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { ServiceCard } from '../components/ServiceCard';
import { SkeletonGrid, SkeletonSlots } from '../components/Skeleton';
import { StepIndicator } from '../components/StepIndicator';
import { Textarea } from '../components/Textarea';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { AvailabilitySlot } from '../services/appointment.service';
import * as serviceService from '../services/service.service';
import type { Service } from '../types';
import { buildDayOptions, formatDuration, formatPrice, formatTime } from '../utils/format';

const STEPS = ['Service', 'Date', 'Time'];
const DAYS_AHEAD = 21;

export default function Book() {
  const navigate = useNavigate();
  const dayOptions = useMemo(() => buildDayOptions(DAYS_AHEAD), []);

  const [step, setStep] = useState(0);
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
      .catch((loadError) => setError(getErrorMessage(loadError, 'Could not load services')))
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
      setError(getErrorMessage(loadError, 'Could not load available times'));
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  function handleSelectService(service: Service) {
    setSelectedService(service);
    setSelectedSlot(null);
    setSlots([]);
    setStep(1);
  }

  function handleSelectDate(date: string) {
    if (!selectedService) {
      return;
    }

    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(2);
    void loadSlots(selectedService.id, date);
  }

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

      navigate('/appointments', { state: { justBooked: true } });
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Could not book this time'));
      void loadSlots(selectedService.id, selectedDate);
      setSelectedSlot(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedDayLabel = dayOptions.find((day) => day.value === selectedDate)?.label;

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">
          New appointment
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Book your visit</h1>
        <p className="text-mist-400 max-w-lg text-sm leading-relaxed">
          Choose a service, then a day, then one of the free times. Confirmation is instant.
        </p>
      </header>

      <div className="surface p-5 sm:p-6">
        <StepIndicator steps={STEPS} current={step} onSelect={setStep} />
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {step === 0 && (
        <div className="animate-fade-up flex flex-col gap-4">
          {isLoadingServices ? (
            <SkeletonGrid />
          ) : services.length === 0 ? (
            <Alert>No services available right now.</Alert>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onSelect={handleSelectService}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {step === 1 && selectedService && (
        <div className="animate-fade-up flex flex-col gap-6">
          <div className="border-ink-700/70 bg-ink-850/50 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm">
            <span className="text-mist-100 font-medium">{selectedService.name}</span>
            <span className="text-mist-600" aria-hidden>
              ·
            </span>
            <span className="text-mist-400">{formatDuration(selectedService.durationMinutes)}</span>
            <span className="text-mist-600" aria-hidden>
              ·
            </span>
            <span className="text-gold-400 font-medium">{formatPrice(selectedService.price)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7">
            {dayOptions.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleSelectDate(day.value)}
                className={`ease-smooth rounded-xl border px-2 py-3.5 text-sm transition duration-200 ${
                  selectedDate === day.value
                    ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 shadow-gold'
                    : 'border-ink-700/70 bg-ink-850/70 text-mist-300 hover:border-ink-500 hover:bg-ink-800/80'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="self-start" onClick={() => setStep(0)}>
            ‹ Back to services
          </Button>
        </div>
      )}

      {step === 2 && selectedService && selectedDate && (
        <div className="animate-fade-up flex flex-col gap-6">
          <div className="border-ink-700/70 bg-ink-850/50 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm">
            <span className="text-mist-100 font-medium">{selectedService.name}</span>
            <span className="text-mist-600" aria-hidden>
              ·
            </span>
            <span className="text-mist-400">{selectedDayLabel ?? selectedDate}</span>
          </div>

          {isLoadingSlots ? (
            <SkeletonSlots />
          ) : slots.length === 0 ? (
            <Alert>No free times for this day. Pick another date.</Alert>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
              {slots.map((slot) => (
                <button
                  key={slot.startsAt}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  aria-pressed={selectedSlot?.startsAt === slot.startsAt}
                  className={`ease-smooth rounded-xl border py-3 text-sm tabular-nums transition duration-200 ${
                    selectedSlot?.startsAt === slot.startsAt
                      ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 shadow-gold'
                      : 'border-ink-700/70 bg-ink-850/70 text-mist-300 hover:border-ink-500 hover:bg-ink-800/80'
                  }`}
                >
                  {formatTime(slot.startsAt)}
                </button>
              ))}
            </div>
          )}

          <Textarea
            label="Notes (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Anything the barber should know?"
          />

          <div className="border-ink-700/70 bg-ink-850/50 flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="text-mist-400">
                {selectedSlot ? 'You are booking' : 'Select a time to continue'}
              </p>
              {selectedSlot && (
                <p className="font-display text-mist-100 mt-1 text-lg font-medium">
                  {selectedDayLabel ?? selectedDate} at {formatTime(selectedSlot.startsAt)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Change date
              </Button>
              <Button onClick={handleConfirm} isLoading={isSubmitting} disabled={!selectedSlot}>
                Confirm booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
