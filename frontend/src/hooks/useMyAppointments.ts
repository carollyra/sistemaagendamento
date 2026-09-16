import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';
import * as appointmentService from '../services/appointment.service';
import type { Appointment } from '../types';

export function useMyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  /** Reference instant used to split upcoming from past appointments. */
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    appointmentService
      .listMyAppointments()
      .then((data) => {
        if (!active) {
          return;
        }

        setAppointments(data);
        setLoadedAt(Date.now());
        setError('');
      })
      .catch((loadError) => {
        if (active) {
          setError(getErrorMessage(loadError, 'Could not load your appointments'));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return { appointments, isLoading, error, loadedAt, setError, refresh };
}
