import { useState, type FormEvent } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import type { Service } from '../../types';

export interface ServiceFormValues {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

interface ServiceFormProps {
  service?: Service | null;
  isSubmitting?: boolean;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel?: () => void;
}

const emptyForm = { name: '', description: '', durationMinutes: '30', price: '' };

export function ServiceForm({ service, isSubmitting, onSubmit, onCancel }: ServiceFormProps) {
  // The parent remounts this form (via `key`) when the edited service changes.
  const [form, setForm] = useState(() =>
    service
      ? {
          name: service.name,
          description: service.description ?? '',
          durationMinutes: String(service.durationMinutes),
          price: String(service.price),
        }
      : emptyForm,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      durationMinutes: Number(form.durationMinutes),
      price: Number(form.price),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="surface animate-fade-up flex flex-col gap-5 p-6">
      <h3 className="font-display text-base font-medium">
        {service ? `Edit “${service.name}”` : 'New service'}
      </h3>

      <Input
        label="Name"
        required
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        placeholder="Haircut"
      />

      <Input
        label="Description"
        value={form.description}
        onChange={(event) =>
          setForm((current) => ({ ...current, description: event.target.value }))
        }
        placeholder="Classic scissor and clipper haircut"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Duration (minutes)"
          type="number"
          min={5}
          max={480}
          step={5}
          required
          value={form.durationMinutes}
          onChange={(event) =>
            setForm((current) => ({ ...current, durationMinutes: event.target.value }))
          }
        />

        <Input
          label="Price"
          type="number"
          min={0}
          step="0.01"
          required
          value={form.price}
          onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
          placeholder="45.00"
        />
      </div>

      <div className="border-ink-700/70 flex gap-3 border-t pt-5">
        <Button type="submit" isLoading={isSubmitting}>
          {service ? 'Save changes' : 'Create service'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
