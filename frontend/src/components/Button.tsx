import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-gold-400 to-gold-500 text-ink-950 shadow-gold hover:from-gold-300 hover:to-gold-400 active:translate-y-px',
  secondary:
    'border border-ink-600 bg-ink-800/80 text-mist-100 hover:border-ink-500 hover:bg-ink-700/80 active:translate-y-px',
  ghost: 'text-mist-300 hover:bg-ink-800/70 hover:text-mist-100',
  danger:
    'border border-red-500/30 bg-red-500/10 text-red-200 hover:border-red-500/50 hover:bg-red-500/20',
  link: 'text-gold-400 hover:text-gold-300 underline-offset-4 hover:underline px-0 py-0',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`ease-smooth inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-tight whitespace-nowrap transition duration-200 disabled:pointer-events-none disabled:opacity-50 ${
        variant === 'link' ? '' : sizes[size]
      } ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading && (
        <span
          aria-hidden
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
        />
      )}
      {children}
    </button>
  );
}
