type Tone = 'error' | 'success' | 'info';

const tones: Record<Tone, string> = {
  error: 'border-red-500/40 bg-red-500/10 text-red-200',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  info: 'border-stone-600 bg-stone-800/60 text-stone-200',
};

export function Alert({ tone = 'info', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <div role="alert" className={`rounded-lg border px-3 py-2.5 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}
