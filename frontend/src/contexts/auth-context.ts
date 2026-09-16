import { createContext } from 'react';
import type { LoginPayload, RegisterPayload, User } from '../types';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (payload: LoginPayload) => Promise<User>;
  signUp: (payload: RegisterPayload) => Promise<User>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
