import { useId, type TextareaHTMLAttributes } from 'react';
import { Textarea as UiTextarea } from './ui/input';
import { Label } from './ui/label';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <UiTextarea {...props} id={id} className={className} />
    </div>
  );
}
