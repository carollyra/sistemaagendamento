import { Clock3 } from 'lucide-react';
import type { Service } from '../types';
import { formatDuration, formatPrice } from '../utils/format';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect: (service: Service) => void;
}

export function ServiceCard({ service, selected = false, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      aria-pressed={selected}
      className={`group ease-smooth relative flex w-full flex-col gap-2 rounded-card border p-5 text-left transition duration-300 ${
        selected
          ? 'border-gold-500/60 bg-gold-500/8 shadow-gold'
          : 'border-ink-700/70 bg-ink-850/70 shadow-soft hover:border-ink-500 hover:bg-ink-800/80'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-base font-medium">{service.name}</h3>
        <span
          className={`shrink-0 text-sm font-semibold tabular-nums transition ${
            selected ? 'text-gold-300' : 'text-gold-400/90'
          }`}
        >
          {formatPrice(service.price)}
        </span>
      </div>

      {service.description && (
        <p className="text-mist-400 text-sm leading-relaxed">{service.description}</p>
      )}

      <div className="text-mist-500 mt-1 flex items-center gap-2 text-xs">
        <Clock3 className="size-3.5" aria-hidden />
        {formatDuration(service.durationMinutes)}
      </div>
    </button>
  );
}
