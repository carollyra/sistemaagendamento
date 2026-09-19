import { useId, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-mist-300 text-xs font-medium tracking-wide uppercase">
        {label}
      </label>
      <textarea {...props} id={id} className={`field resize-none ${className}`} />
    </div>
  );
}
