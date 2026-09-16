import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { ServiceCard } from '../components/ServiceCard';
import { Spinner } from '../components/Spinner';
import { StepIndicator } from '../components/StepIndicator';
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

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Book an appointment</h1>
        <p className="mt-1 text-sm text-stone-400">
          Choose a service, then a day, then one of the free times.
        </p>
      </header>

      <StepIndicator steps={STEPS} current={step} onSelect={setStep} />

      {error && <Alert tone="error">{error}</Alert>}

      {step === 0 && (
        <div className="flex flex-col gap-3">
          {isLoadingServices ? (
            <Spinner label="Loading services…" />
          ) : services.length === 0 ? (
            <Alert>No services available right now.</Alert>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-400">
            {selectedService.name} · {formatDuration(selectedService.durationMinutes)} ·{' '}
            {formatPrice(selectedService.price)}
          </p>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
            {dayOptions.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleSelectDate(day.value)}
                className={`rounded-lg border px-2 py-3 text-sm transition ${
                  selectedDate === day.value
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-600'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <Button variant="secondary" className="self-start" onClick={() => setStep(0)}>
            Back to services
          </Button>
        </div>
      )}

      {step === 2 && selectedService && selectedDate && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-400">
            {selectedService.name} ·{' '}
            {dayOptions.find((day) => day.value === selectedDate)?.label ?? selectedDate}
          </p>

          {isLoadingSlots ? (
            <Spinner label="Loading times…" />
          ) : slots.length === 0 ? (
            <Alert>No free times for this day. Pick another date.</Alert>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
              {slots.map((slot) => (
                <button
                  key={slot.startsAt}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-2 py-2.5 text-sm transition ${
                    selectedSlot?.startsAt === slot.startsAt
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  {formatTime(slot.startsAt)}
                </button>
              ))}
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-300">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Anything the barber should know?"
              className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleConfirm} isLoading={isSubmitting} disabled={!selectedSlot}>
              {selectedSlot ? `Confirm ${formatTime(selectedSlot.startsAt)}` : 'Select a time'}
            </Button>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Change date
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
