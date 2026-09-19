import { useEffect, useState } from 'react';
import * as appointmentService from '../services/appointment.service';
import type { Service } from '../types';
import { addDays, todayISO } from '../utils/format';

export interface ServiceAvailability {
  /** Free slots on the day the label refers to. */
  count: number;
  /** "hoje" or "amanhã" — whichever day still has room. */
  when: 'hoje' | 'amanhã' | null;
}

/**
 * Free slots per service for today, falling back to tomorrow once the shop
 * has closed for the day.
 */
export function useServiceAvailability(services: Service[]) {
  const [availability, setAvailability] = useState<Record<string, ServiceAvailability>>({});
  const ids = services.map((service) => service.id).join(',');

  useEffect(() => {
    if (!ids) {
      return;
    }

    let active = true;
    const today = todayISO();
    const tomorrow = addDays(today, 1);

    Promise.all(
      ids.split(',').map(async (id) => {
        const forToday = await appointmentService.getAvailability(id, today);

        if (forToday.slots.length > 0) {
          return [id, { count: forToday.slots.length, when: 'hoje' }] as const;
        }

        const forTomorrow = await appointmentService.getAvailability(id, tomorrow);

        return [
          id,
          {
            count: forTomorrow.slots.length,
            when: forTomorrow.slots.length > 0 ? 'amanhã' : null,
          },
        ] as const;
      }),
    )
      .then((entries) => {
        if (active) {
          setAvailability(Object.fromEntries(entries) as Record<string, ServiceAvailability>);
        }
      })
      .catch(() => {
        if (active) {
          setAvailability({});
        }
      });

    return () => {
      active = false;
    };
  }, [ids]);

  return availability;
}
