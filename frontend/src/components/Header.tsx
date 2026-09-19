import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';
import { Logo } from './Logo';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 text-sm transition duration-200 ${
    isActive
      ? 'text-mist-100 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-gold-500'
      : 'text-mist-400 hover:text-mist-100'
  }`;

export function Header() {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const links = isAuthenticated
    ? [
        { to: '/book', label: 'Book' },
        { to: '/appointments', label: 'My appointments' },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
      ]
    : [];

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="border-ink-800/80 bg-ink-950/70 fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div className="border-ink-700 bg-ink-800/60 flex items-center gap-2.5 rounded-full border py-1 pr-3.5 pl-1.5">
                <span className="bg-gold-500/15 text-gold-300 flex size-7 items-center justify-center rounded-full text-xs font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-mist-300 max-w-32 truncate text-xs">
                  {user?.name.split(' ')[0]}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Sign in
              </NavLink>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          className="border-ink-700 bg-ink-800/60 text-mist-200 hover:border-ink-500 flex size-9 items-center justify-center rounded-xl border transition md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4.5" aria-hidden>
            {isMenuOpen ? (
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-ink-800 bg-ink-950/95 animate-fade-in border-t px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-ink-800 text-mist-100'
                      : 'text-mist-400 hover:bg-ink-800/60 hover:text-mist-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <Button
                variant="secondary"
                className="mt-2"
                onClick={() => {
                  closeMenu();
                  signOut();
                }}
              >
                Sign out
              </Button>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  onClick={closeMenu}
                  className="text-mist-300 hover:text-mist-100 rounded-lg px-3 py-2.5 text-sm"
                >
                  Sign in
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button fullWidth>Get started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
