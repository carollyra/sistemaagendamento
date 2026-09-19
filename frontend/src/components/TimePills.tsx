import { motion } from 'framer-motion';
import { springSnappy } from '../lib/motion';
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
      className={wrap ? 'flex flex-wrap gap-2' : 'scroll-row'}
      role="group"
      aria-label="Escolha o horário"
    >
      {slots.map((slot) => {
        const isSelected = slot.startsAt === selected;

        return (
          <motion.button
            key={slot.startsAt}
            type="button"
            whileHover={{ scale: isSelected ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            aria-pressed={isSelected}
            onClick={() => onSelect(slot.startsAt)}
            className={`relative h-10 shrink-0 snap-start rounded-full border px-4 text-[13px] font-medium tabular-nums transition-colors duration-200 ${
              isSelected
                ? 'border-transparent'
                : 'text-mist-200 border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId="time-pill"
                transition={springSnappy}
                className="bg-gold-500 absolute inset-0 rounded-full"
              />
            )}
            <span className={`relative ${isSelected ? 'text-ink-950' : ''}`}>
              {formatTime(slot.startsAt)}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
