import type { ReactNode } from 'react';

type Tone = 'error' | 'success' | 'info';

const tones: Record<Tone, { wrapper: string; dot: string }> = {
  error: { wrapper: 'border-red-500/25 bg-red-500/8 text-red-200', dot: 'bg-red-400' },
  success: {
    wrapper: 'border-emerald-500/25 bg-emerald-500/8 text-emerald-200',
    dot: 'bg-emerald-400',
  },
  info: { wrapper: 'border-ink-600 bg-ink-800/60 text-mist-300', dot: 'bg-gold-500' },
};

export function Alert({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const { wrapper, dot } = tones[tone];

  return (
    <div
      role="alert"
      className={`animate-fade-in flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${wrapper}`}
    >
      <span aria-hidden className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
