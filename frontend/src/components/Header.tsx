import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { greeting } from '../utils/format';
import { Avatar } from './Avatar';
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
        { to: '/book', label: 'Agendar' },
        { to: '/appointments', label: 'Meus agendamentos' },
        ...(isAdmin ? [{ to: '/admin', label: 'Administração' }] : []),
      ]
    : [];

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-[rgb(5_6_8/0.72)] [backdrop-filter:blur(40px)_saturate(180%)]">
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
              <div className="flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.03] py-1 pr-4 pl-1">
                <Avatar name={user?.name ?? ''} size="sm" />
                <span className="flex flex-col leading-tight">
                  <span className="text-mist-500 text-[10px]">{greeting()},</span>
                  <span className="text-mist-100 max-w-32 truncate text-xs font-medium">
                    {user?.name.split(' ')[0]}
                  </span>
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Entrar
              </NavLink>
              <Link to="/register">
                <Button size="sm">Criar conta</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label="Abrir menu"
          className="text-mist-200 flex size-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] transition hover:border-white/[0.16] md:hidden"
        >
          {isMenuOpen ? (
            <X className="size-4.5" aria-hidden />
          ) : (
            <Menu className="size-4.5" aria-hidden />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="animate-fade-in border-t border-white/[0.06] bg-[rgb(5_6_8/0.95)] px-5 py-4 [backdrop-filter:blur(40px)_saturate(180%)] md:hidden">
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
                Sair
              </Button>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  onClick={closeMenu}
                  className="text-mist-300 hover:text-mist-100 rounded-lg px-3 py-2.5 text-sm"
                >
                  Entrar
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button fullWidth>Criar conta</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
