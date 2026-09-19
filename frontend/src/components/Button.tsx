import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light' | 'link';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-gold-500 text-ink-950 hover:bg-gold-400 active:bg-gold-600',
  secondary:
    'border border-white/[0.08] bg-white/[0.04] text-mist-100 hover:border-white/[0.16] hover:bg-white/[0.07]',
  ghost: 'text-mist-400 hover:bg-white/[0.05] hover:text-mist-100',
  danger:
    'border border-red-500/25 bg-red-500/[0.08] text-red-200 hover:border-red-500/45 hover:bg-red-500/15',
  light: 'bg-mist-100 text-ink-950 hover:bg-white',
  link: 'text-gold-400 hover:text-gold-300 underline-offset-4 hover:underline px-0 py-0',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
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
      className={`ease-smooth inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition duration-200 hover:scale-[1.02] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 ${
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
