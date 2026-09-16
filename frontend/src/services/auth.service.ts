import { api } from './api';
import type { LoginPayload, RegisterPayload, Session, User } from '../types';

export async function register(payload: RegisterPayload): Promise<Session> {
  const { data } = await api.post<Session>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<Session> {
  const { data } = await api.post<Session>('/auth/login', payload);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}
