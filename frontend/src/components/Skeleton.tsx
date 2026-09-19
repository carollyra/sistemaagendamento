export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-shimmer rounded-lg bg-[length:200%_100%] bg-gradient-to-r from-[var(--color-ink-800)] via-[var(--color-ink-700)] to-[var(--color-ink-800)] ${className}`}
    />
  );
}

/** Placeholder rows shaped like the cards used across the app. */
export function SkeletonList({ rows = 3, label = 'Loading' }: { rows?: number; label?: string }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="surface flex items-center justify-between gap-4 p-5">
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-9 w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ items = 4 }: { items?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2" role="status" aria-busy="true" aria-label="Loading">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="surface flex flex-col gap-3 p-5">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonSlots({ items = 12 }: { items?: number }) {
  return (
    <div
      className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6"
      role="status"
      aria-busy="true"
      aria-label="Loading times"
    >
      {Array.from({ length: items }).map((_, index) => (
        <Skeleton key={index} className="h-11" />
      ))}
    </div>
  );
}
