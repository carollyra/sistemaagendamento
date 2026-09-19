import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide whitespace-nowrap transition duration-200 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-gold-500/30 bg-gold-500/10 text-gold-300',
        success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
        muted: 'border-white/[0.07] bg-white/[0.03] text-mist-400',
        outline: 'border-white/[0.07] text-mist-300',
        destructive: 'border-red-500/30 bg-red-500/10 text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
