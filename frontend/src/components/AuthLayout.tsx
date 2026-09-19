import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Logo } from './Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const highlights = [
  'Horários em tempo real, sem ligação',
  'Cancele ou remarque em dois toques',
  'Seu histórico sempre à mão',
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="bg-ink-950 min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — decorative, hidden on small screens */}
      <aside className="aurora border-ink-800/80 relative hidden flex-col justify-between border-r p-12 lg:flex">
        <Logo />

        <div className="max-w-md">
          <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">Desde 2014</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.1] font-semibold text-balance">
            Corte impecável, <span className="text-gradient">agendado em segundos</span>
          </h2>
          <p className="text-mist-400 mt-5 leading-relaxed">
            Um jeito mais tranquilo de cuidar da cadeira. Escolha o serviço, pegue um horário e
            deixe a agenda se organizar sozinha.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {highlights.map((item) => (
              <li key={item} className="text-mist-300 flex items-center gap-3 text-sm">
                <span className="border-gold-500/30 bg-gold-500/10 text-gold-400 flex size-6 items-center justify-center rounded-full border">
                  <Check className="size-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-mist-500 text-xs">Segunda a sábado · 09h – 19h</p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="animate-fade-up w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-mist-400 mt-2 text-sm leading-relaxed">{subtitle}</p>

          <div className="mt-9">{children}</div>

          <p className="text-mist-400 mt-8 text-center text-sm">{footer}</p>
        </div>
      </main>
    </div>
  );
}
