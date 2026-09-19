import { useEffect, useState } from 'react';
import * as appointmentService from '../services/appointment.service';
import { addDays } from '../utils/format';

export interface DaySummary {
  date: string;
  scheduled: number;
  total: number;
  revenue: number;
}

/** Seven day rolling view of the agenda, used by the admin side panel. */
export function useWeekOverview(from: string, days = 7) {
  const [summary, setSummary] = useState<DaySummary[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all(
      Array.from({ length: days }, (_, offset) => addDays(from, offset)).map(async (date) => {
        const agenda = await appointmentService.getDayAgenda(date);
        const scheduled = agenda.appointments.filter(
          (appointment) => appointment.status === 'SCHEDULED',
        );

        return {
          date,
          scheduled: scheduled.length,
          total: agenda.appointments.length,
          revenue: scheduled.reduce((sum, appointment) => sum + appointment.service.price, 0),
        };
      }),
    )
      .then((result) => {
        if (active) {
          setSummary(result);
        }
      })
      .catch(() => {
        if (active) {
          setSummary([]);
        }
      });

    return () => {
      active = false;
    };
  }, [from, days]);

  return summary;
}
