import { motion } from 'framer-motion';
import { springSnappy } from '../lib/motion';
import type { DayOption } from '../utils/format';

interface DateStripProps {
  days: DayOption[];
  selected: string;
  onSelect: (value: string) => void;
  /** Distinguishes the shared layout animation when two strips are mounted. */
  layoutGroup?: string;
}

/** Horizontal day picker — weekday on top, day number below, filled when active. */
export function DateStrip({ days, selected, onSelect, layoutGroup = 'date' }: DateStripProps) {
  return (
    <div className="scroll-row" role="group" aria-label="Escolha o dia">
      {days.map((day) => {
        const isSelected = day.value === selected;

        return (
          <motion.button
            key={day.value}
            type="button"
            whileHover={{ scale: isSelected ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            aria-pressed={isSelected}
            onClick={() => onSelect(day.value)}
            className={`relative flex w-15 shrink-0 snap-start flex-col items-center gap-1 rounded-2xl border py-3 transition-colors duration-200 ${
              isSelected
                ? 'border-transparent'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId={`${layoutGroup}-pill`}
                transition={springSnappy}
                className="bg-gold-500 absolute inset-0 rounded-2xl"
              />
            )}

            <span
              className={`relative text-[10px] font-medium tracking-[0.12em] uppercase ${
                isSelected ? 'text-ink-950/60' : 'text-mist-500'
              }`}
            >
              {day.isToday ? 'Hoje' : day.weekday}
            </span>
            <span
              className={`font-display relative text-[17px] leading-none font-semibold tracking-[-0.02em] tabular-nums ${
                isSelected ? 'text-ink-950' : 'text-mist-100'
              }`}
            >
              {day.day}
            </span>
            <span
              className={`relative text-[10px] ${isSelected ? 'text-ink-950/60' : 'text-mist-500'}`}
            >
              {day.month}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
