import { CalendarClock, CheckCircle2, XCircle } from 'lucide-react';
import type { AppointmentStatus } from '../types';
import { Badge } from './ui/badge';

const config = {
  SCHEDULED: { variant: 'default', label: 'Scheduled', Icon: CalendarClock },
  COMPLETED: { variant: 'success', label: 'Completed', Icon: CheckCircle2 },
  CANCELLED: { variant: 'muted', label: 'Cancelled', Icon: XCircle },
} as const;

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { variant, label, Icon } = config[status];

  return (
    <Badge variant={variant}>
      <Icon aria-hidden />
      {label}
    </Badge>
  );
}
