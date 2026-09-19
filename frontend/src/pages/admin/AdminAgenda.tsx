import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Alert } from '../../components/Alert';
import { AppointmentCard } from '../../components/AppointmentCard';
import { Button } from '../../components/Button';
import { SkeletonList } from '../../components/Skeleton';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useDayAgenda } from '../../hooks/useDayAgenda';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { getErrorMessage } from '../../services/api';
import * as appointmentService from '../../services/appointment.service';
import type { Appointment } from '../../types';
import { addDays, formatLongDate, formatPrice, todayISO } from '../../utils/format';

const QUICK_JUMPS = [
  { value: '0', label: 'Today' },
  { value: '1', label: 'Tomorrow' },
  { value: '7', label: 'In a week' },
  { value: '30', label: 'In a month' },
];

export function AdminAgenda() {
  const [date, setDate] = useState(() => todayISO());
  const { appointments, isLoading, error, refresh } = useDayAgenda(date);
  const [busyId, setBusyId] = useState<string | null>(null);

  const scheduled = appointments.filter((appointment) => appointment.status === 'SCHEDULED');
  const revenue = scheduled.reduce((total, appointment) => total + appointment.service.price, 0);

  async function updateStatus(appointment: Appointment, status: 'COMPLETED' | 'CANCELLED') {
    setBusyId(appointment.id);

    try {
      if (status === 'CANCELLED') {
        await appointmentService.cancelAppointment(appointment.id);
        toast.success('Appointment cancelled', { description: appointment.user.name });
      } else {
        await appointmentService.updateAppointmentStatus(appointment.id, status);
        toast.success('Appointment completed', { description: appointment.user.name });
      }

      refresh();
    } catch (updateError) {
      toast.error(getErrorMessage(updateError, 'Could not update the appointment'));
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
            onClick={() => setDate((current) => addDays(current, -1))}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>

          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value || todayISO())}
            className="w-auto py-2 [color-scheme:dark]"
            aria-label="Agenda date"
          />

          <Button
            variant="secondary"
            size="sm"
            aria-label="Next day"
            onClick={() => setDate((current) => addDays(current, 1))}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>

          <Select value="" onValueChange={(value) => setDate(addDays(todayISO(), Number(value)))}>
            <SelectTrigger size="sm" aria-label="Jump to a date">
              <CalendarDays className="text-mist-500 size-4" aria-hidden />
              <SelectValue placeholder="Jump to" />
            </SelectTrigger>
            <SelectContent>
              {QUICK_JUMPS.map((jump) => (
                <SelectItem key={jump.value} value={jump.value}>
                  {jump.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <motion.ul
          key={date}
          className="flex flex-col gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence initial={false}>
            {appointments.map((appointment) => (
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
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
