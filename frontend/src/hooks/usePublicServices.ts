import { useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';
import * as serviceService from '../services/service.service';
import type { Service } from '../types';

/** Active services shown on the landing page. */
export function usePublicServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    serviceService
      .listServices()
      .then((data) => {
        if (active) {
          setServices(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(getErrorMessage(loadError, 'Não foi possível carregar os serviços'));
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
  }, []);

  return { services, isLoading, error };
}
