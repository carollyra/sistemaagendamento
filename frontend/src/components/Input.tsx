import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export function Input({ label, error, hint, icon, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-mist-300 text-xs font-medium tracking-wide uppercase">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="text-mist-500 pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            {icon}
          </span>
        )}
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-description` : undefined}
          className={`field ${icon ? 'pl-11' : ''} aria-[invalid=true]:border-red-500/60 aria-[invalid=true]:focus:ring-red-500/15 ${className}`}
        />
      </div>

      {(error || hint) && (
        <span
          id={`${id}-description`}
          className={`text-xs ${error ? 'text-red-300' : 'text-mist-500'}`}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  );
}
