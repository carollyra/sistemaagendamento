import { useEffect, useState } from 'react';
import * as appointmentService from '../services/appointment.service';
import type { AvailabilitySlot } from '../services/appointment.service';
import { addDays, todayISO } from '../utils/format';

interface NextSlots {
  date: string;
  slots: AvailabilitySlot[];
}

const DAYS_TO_SCAN = 7;

/**
 * Free times on the next day that still has availability for a service —
 * used by the landing page preview.
 */
export function useNextSlots(serviceId: string | undefined) {
  const [nextSlots, setNextSlots] = useState<NextSlots | null>(null);

  useEffect(() => {
    if (!serviceId) {
      return;
    }

    let active = true;

    async function findNextOpenDay(id: string) {
      for (let offset = 0; offset < DAYS_TO_SCAN; offset += 1) {
        const date = addDays(todayISO(), offset);
        const availability = await appointmentService.getAvailability(id, date);

        if (!active) {
          return null;
        }

        if (availability.slots.length > 0) {
          return { date, slots: availability.slots };
        }
      }

      return null;
    }

    findNextOpenDay(serviceId)
      .then((result) => {
        if (active) {
          setNextSlots(result);
        }
      })
      .catch(() => {
        if (active) {
          setNextSlots(null);
        }
      });

    return () => {
      active = false;
    };
  }, [serviceId]);

  return nextSlots;
}
