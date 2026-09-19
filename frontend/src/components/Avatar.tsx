interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'size-9 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-14 text-base',
};

/** Initials avatar — no upload flow, so the name drives the visual. */
export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <span
      aria-hidden
      className={`bg-gold-500/15 text-gold-300 ring-gold-500/25 font-display flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ${sizes[size]} ${className}`}
    >
      {initials || '?'}
    </span>
  );
}
