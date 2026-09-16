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
      className={`flex w-full flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-amber-500 bg-amber-500/10'
          : 'border-stone-800 bg-stone-900/60 hover:border-stone-600'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span className="font-medium text-stone-100">{service.name}</span>
        <span className="text-sm font-semibold text-amber-400">{formatPrice(service.price)}</span>
      </div>
      {service.description && <p className="text-sm text-stone-400">{service.description}</p>}
      <span className="text-xs text-stone-500">{formatDuration(service.durationMinutes)}</span>
    </button>
  );
}
