import { useId, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-300">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        className={`rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none aria-[invalid=true]:border-red-500 ${className}`}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
