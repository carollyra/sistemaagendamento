import type { AppointmentStatus } from '../types';

const styles: Record<AppointmentStatus, { chip: string; dot: string; label: string }> = {
  SCHEDULED: {
    chip: 'border-gold-500/30 bg-gold-500/10 text-gold-300',
    dot: 'bg-gold-400',
    label: 'Scheduled',
  },
  COMPLETED: {
    chip: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
    label: 'Completed',
  },
  CANCELLED: {
    chip: 'border-ink-600 bg-ink-800 text-mist-400',
    dot: 'bg-mist-500',
    label: 'Cancelled',
  },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { chip, dot, label } = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${chip}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
