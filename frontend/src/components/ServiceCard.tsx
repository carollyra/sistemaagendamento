import { Check, Clock3 } from 'lucide-react';
import type { Service } from '../types';
import { serviceImage } from '../lib/images';
import { formatDuration, formatPrice } from '../utils/format';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect: (service: Service) => void;
}

/** Photo card used in the booking flow — picture, name, duration and price. */
export function ServiceCard({ service, selected = false, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      aria-pressed={selected}
      className={`group ease-smooth rounded-media relative flex w-full overflow-hidden border text-left transition-colors duration-300 ${
        selected
          ? 'border-gold-500 bg-ink-800'
          : 'border-ink-700/70 bg-ink-850 hover:border-ink-500 hover:bg-ink-800'
      }`}
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-32 sm:w-32">
        <img
          src={serviceImage(service.name, { width: 400, height: 400 })}
          alt=""
          loading="lazy"
          className="ease-smooth size-full object-cover transition duration-500 group-hover:scale-105"
        />
        {selected && (
          <span className="bg-gold-500 text-ink-950 absolute top-2 left-2 flex size-6 items-center justify-center rounded-full">
            <Check className="size-3.5" aria-hidden />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-4">
        <h3 className="font-display truncate text-base font-bold tracking-tight">{service.name}</h3>

        {service.description && (
          <p className="text-mist-400 line-clamp-2 text-xs leading-relaxed">
            {service.description}
          </p>
        )}

        <div className="mt-1 flex items-center gap-3">
          <span className="text-mist-500 flex items-center gap-1.5 text-xs">
            <Clock3 className="size-3.5" aria-hidden />
            {formatDuration(service.durationMinutes)}
          </span>
          <span
            className={`font-display text-sm font-bold tabular-nums ${
              selected ? 'text-gold-300' : 'text-gold-400'
            }`}
          >
            {formatPrice(service.price)}
          </span>
        </div>
      </div>
    </button>
  );
}
