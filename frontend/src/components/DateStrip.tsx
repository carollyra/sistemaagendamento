import { motion } from 'framer-motion';
import type { DayOption } from '../utils/format';

interface DateStripProps {
  days: DayOption[];
  selected: string;
  onSelect: (value: string) => void;
}

/** Horizontal, scrollable day picker: weekday on top, day number below. */
export function DateStrip({ days, selected, onSelect }: DateStripProps) {
  return (
    <div className="scroll-row" role="group" aria-label="Escolha o dia">
      {days.map((day) => {
        const isSelected = day.value === selected;

        return (
          <motion.button
            key={day.value}
            type="button"
            whileTap={{ scale: 0.96 }}
            aria-pressed={isSelected}
            onClick={() => onSelect(day.value)}
            className={`ease-smooth flex w-16 shrink-0 snap-start flex-col items-center gap-1 rounded-2xl border py-3 transition-colors duration-200 ${
              isSelected
                ? 'border-gold-500 bg-gold-500 text-ink-950'
                : 'border-ink-700 bg-ink-850 text-mist-300 hover:border-ink-500 hover:bg-ink-800'
            }`}
          >
            <span
              className={`text-[11px] font-medium tracking-wide uppercase ${
                isSelected ? 'text-ink-950/70' : 'text-mist-500'
              }`}
            >
              {day.isToday ? 'Hoje' : day.weekday}
            </span>
            <span className="font-display text-lg leading-none font-bold tabular-nums">
              {day.day}
            </span>
            <span className={`text-[10px] ${isSelected ? 'text-ink-950/70' : 'text-mist-500'}`}>
              {day.month}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
