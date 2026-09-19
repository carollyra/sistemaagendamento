import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { Appointment } from '../types';

interface AgendaState {
  date: string;
  appointments: Appointment[];
}

export function useDayAgenda(date: string) {
  const [agenda, setAgenda] = useState<AgendaState>({ date: '', appointments: [] });
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    appointmentService
      .getDayAgenda(date)
      .then((data) => {
        if (active) {
          setAgenda({ date, appointments: data.appointments });
          setError('');
        }
      })
      .catch((loadError) => {
        if (active) {
          setAgenda({ date, appointments: [] });
          setError(getErrorMessage(loadError, 'Não foi possível carregar a agenda'));
        }
      });

    return () => {
      active = false;
    };
  }, [date, reloadKey]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    appointments: agenda.appointments,
    isLoading: agenda.date !== date,
    error,
    setError,
    refresh,
  };
}
