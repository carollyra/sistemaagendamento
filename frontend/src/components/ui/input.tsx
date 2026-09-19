import * as React from 'react';
import { cn } from 'cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'text-mist-100 placeholder:text-mist-500 focus:border-gold-500/50 focus:ring-gold-500/10 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3 text-sm transition duration-200 outline-none focus:ring-4',
        'file:text-mist-200 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-red-500/60 aria-[invalid=true]:focus:ring-red-500/15',
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'text-mist-100 placeholder:text-mist-500 focus:border-gold-500/50 focus:ring-gold-500/10 w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3 text-sm transition duration-200 outline-none focus:ring-4',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea };
