import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '../services/auth.service';
import { TOKEN_STORAGE_KEY } from '../services/api';
import type { LoginPayload, RegisterPayload, Session, User } from '../types';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  );

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      return;
    }

    authService
      .getProfile()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistSession = useCallback((session: Session) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
    setUser(session.user);
    return session.user;
  }, []);

  const signIn = useCallback(
    async (payload: LoginPayload) => persistSession(await authService.login(payload)),
    [persistSession],
  );

  const signUp = useCallback(
    async (payload: RegisterPayload) => persistSession(await authService.register(payload)),
    [persistSession],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
