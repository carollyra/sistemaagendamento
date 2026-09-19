import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Logo } from './Logo';
import { images } from '../lib/images';

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
      {/* Brand panel over a real photo of the shop */}
      <aside className="relative hidden flex-col justify-between p-12 lg:flex">
        <img
          src={images.auth()}
          alt="Barbeiro atendendo um cliente"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="photo-scrim absolute inset-0" aria-hidden />
        <div className="bg-ink-950/45 absolute inset-0" aria-hidden />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative max-w-md">
          <p className="text-gold-400 text-xs font-medium tracking-[0.2em] uppercase">Desde 2014</p>
          <h2 className="font-display mt-4 text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] text-balance text-white">
            Corte impecável, <span className="text-gold-400">agendado em segundos</span>
          </h2>
          <p className="text-mist-200 mt-4 leading-relaxed">
            Um jeito mais tranquilo de cuidar da cadeira. Escolha o serviço, pegue um horário e
            deixe a agenda se organizar sozinha.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {highlights.map((item) => (
              <li key={item} className="text-mist-100 flex items-center gap-3 text-sm">
                <span className="bg-gold-500 text-ink-950 flex size-5 items-center justify-center rounded-full">
                  <Check className="size-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-mist-300 relative text-xs">Segunda a sábado · 09h – 19h</p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="animate-fade-up w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em]">{title}</h1>
          <p className="text-mist-400 mt-2 text-sm leading-relaxed">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="text-mist-400 mt-8 text-center text-sm">{footer}</p>
        </div>
      </main>
    </div>
  );
}
