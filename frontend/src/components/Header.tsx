import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-amber-400' : 'text-stone-300 hover:text-stone-100'}`;

export function Header() {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();

  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-stone-100">
          <span className="text-xl">💈</span>
          <span className="font-semibold tracking-tight">Barbershop</span>
        </Link>

        <nav className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <NavLink to="/book" className={linkClass}>
                Book
              </NavLink>
              <NavLink to="/appointments" className={linkClass}>
                My appointments
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
              <span className="hidden text-sm text-stone-500 sm:inline">{user?.name}</span>
              <Button variant="ghost" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign in
              </NavLink>
              <Link to="/register">
                <Button>Create account</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
