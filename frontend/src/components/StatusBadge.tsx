import type { AppointmentStatus } from '../types';

const styles: Record<AppointmentStatus, string> = {
  SCHEDULED: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  COMPLETED: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  CANCELLED: 'border-stone-600 bg-stone-800 text-stone-400',
};

const labels: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
