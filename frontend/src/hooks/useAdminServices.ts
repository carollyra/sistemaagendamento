import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';
import * as serviceService from '../services/service.service';
import type { Service } from '../types';

export function useAdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    serviceService
      .listServices(true)
      .then((data) => {
        if (active) {
          setServices(data);
          setError('');
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(getErrorMessage(loadError, 'Could not load services'));
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

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  return { services, isLoading, error, setError, refresh };
}
