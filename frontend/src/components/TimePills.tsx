import { motion } from 'framer-motion';
import { formatTime } from '../utils/format';

interface TimePillsProps {
  slots: { startsAt: string }[];
  selected?: string;
  onSelect: (startsAt: string) => void;
  /** Wrap instead of scrolling — used where there is room for every slot. */
  wrap?: boolean;
}

export function TimePills({ slots, selected, onSelect, wrap = false }: TimePillsProps) {
  return (
    <div
      className={wrap ? 'flex flex-wrap gap-2.5' : 'scroll-row'}
      role="group"
      aria-label="Escolha o horário"
    >
      {slots.map((slot) => {
        const isSelected = slot.startsAt === selected;

        return (
          <motion.button
            key={slot.startsAt}
            type="button"
            whileTap={{ scale: 0.96 }}
            aria-pressed={isSelected}
            onClick={() => onSelect(slot.startsAt)}
            className={`ease-smooth h-11 shrink-0 snap-start rounded-full border px-5 text-sm font-medium tabular-nums transition-colors duration-200 ${
              isSelected
                ? 'border-gold-500 bg-gold-500 text-ink-950'
                : 'border-ink-700 bg-ink-850 text-mist-200 hover:border-ink-500 hover:bg-ink-800'
            }`}
          >
            {formatTime(slot.startsAt)}
          </motion.button>
        );
      })}
    </div>
  );
}
