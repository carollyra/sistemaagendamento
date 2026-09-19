interface StepIndicatorProps {
  steps: string[];
  current: number;
  onSelect?: (step: number) => void;
}

export function StepIndicator({ steps, current, onSelect }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;

        return (
          <li key={step} className="flex flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              disabled={!isDone || !onSelect}
              onClick={() => onSelect?.(index)}
              className={`ease-smooth flex items-center gap-2.5 rounded-full py-1 pr-1 transition duration-300 disabled:cursor-default ${
                isDone && onSelect ? 'hover:opacity-80' : ''
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition duration-300 ${
                  isCurrent
                    ? 'border-gold-500 bg-gold-500 text-ink-950 shadow-gold'
                    : isDone
                      ? 'border-gold-500/40 bg-gold-500/10 text-gold-300'
                      : 'border-ink-600 bg-ink-850 text-mist-500'
                }`}
              >
                {isDone ? (
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5" aria-hidden>
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`hidden text-sm transition sm:inline ${
                  isCurrent ? 'text-mist-100 font-medium' : 'text-mist-500'
                }`}
              >
                {step}
              </span>
            </button>

            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={`h-px flex-1 transition duration-500 ${
                  isDone ? 'bg-gold-500/40' : 'bg-ink-700'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
