interface StepIndicatorProps {
  steps: string[];
  current: number;
  onSelect?: (step: number) => void;
}

export function StepIndicator({ steps, current, onSelect }: StepIndicatorProps) {
  return (
    <ol className="flex flex-wrap items-center gap-3 text-sm">
      {steps.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;

        return (
          <li key={step} className="flex items-center gap-3">
            <button
              type="button"
              disabled={!isDone || !onSelect}
              onClick={() => onSelect?.(index)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
                isCurrent
                  ? 'bg-amber-500 font-semibold text-stone-950'
                  : isDone
                    ? 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                    : 'bg-stone-900 text-stone-500'
              } disabled:cursor-default`}
            >
              <span className="text-xs">{index + 1}</span>
              {step}
            </button>
            {index < steps.length - 1 && <span className="text-stone-700">›</span>}
          </li>
        );
      })}
    </ol>
  );
}
