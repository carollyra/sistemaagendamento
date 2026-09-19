import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light' | 'link';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-gold-500 text-ink-950 hover:bg-gold-400 active:bg-gold-600',
  secondary: 'border border-ink-600 bg-ink-800 text-mist-100 hover:bg-ink-700 active:bg-ink-600',
  ghost: 'text-mist-300 hover:bg-ink-800 hover:text-mist-100',
  danger: 'border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20',
  light: 'bg-mist-100 text-ink-950 hover:bg-white',
  link: 'text-gold-400 hover:text-gold-300 underline-offset-4 hover:underline px-0 py-0',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
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
      className={`ease-smooth inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 ${
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
