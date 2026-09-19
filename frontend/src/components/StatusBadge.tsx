import { CalendarClock, CheckCircle2, XCircle } from 'lucide-react';
import type { AppointmentStatus } from '../types';
import { Badge } from './ui/badge';

const config = {
  SCHEDULED: { variant: 'default', label: 'Agendado', Icon: CalendarClock },
  COMPLETED: { variant: 'success', label: 'Concluído', Icon: CheckCircle2 },
  CANCELLED: { variant: 'muted', label: 'Cancelado', Icon: XCircle },
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
