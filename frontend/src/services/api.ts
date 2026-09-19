import axios, { AxiosError } from 'axios';

export const TOKEN_STORAGE_KEY = 'barbershop:token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface ApiErrorBody {
  message?: string;
  errors?: { properties?: Record<string, { errors?: string[] }> };
}

/** Turns an axios error into a message that can be shown to the user. */
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;

    const fieldError = Object.values(data?.errors?.properties ?? {})
      .flatMap((field) => field.errors ?? [])
      .at(0);

    return fieldError ?? data?.message ?? error.message ?? fallback;
  }

  return fallback;
}
