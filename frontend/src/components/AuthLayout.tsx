import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="text-2xl">💈</span>
          <span className="text-lg font-semibold tracking-tight text-stone-100">Barbershop</span>
        </Link>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 shadow-xl sm:p-8">
          <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          <p className="mt-1 text-sm text-stone-400">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-stone-400">{footer}</p>
      </div>
    </div>
  );
}
