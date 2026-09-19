import type { ReactNode } from 'react';
import { Logo } from './Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const highlights = [
  'Real-time availability, no phone calls',
  'Cancel or reschedule in two taps',
  'Your history always at hand',
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="bg-ink-950 min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — decorative, hidden on small screens */}
      <aside className="aurora border-ink-800/80 relative hidden flex-col justify-between border-r p-12 lg:flex">
        <Logo />

        <div className="max-w-md">
          <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">Since 2014</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.1] font-semibold text-balance">
            Precision cuts, <span className="text-gradient">booked in seconds</span>
          </h2>
          <p className="text-mist-400 mt-5 leading-relaxed">
            A calmer way to run the chair. Pick a service, grab a slot and let the schedule take
            care of itself.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {highlights.map((item) => (
              <li key={item} className="text-mist-300 flex items-center gap-3 text-sm">
                <span className="border-gold-500/30 bg-gold-500/10 text-gold-400 flex size-6 items-center justify-center rounded-full border">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden>
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-mist-500 text-xs">Monday to Saturday · 09:00 – 19:00</p>
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
