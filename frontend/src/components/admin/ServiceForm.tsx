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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Nome"
        required
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        placeholder="Corte"
      />

      <Input
        label="Descrição"
        value={form.description}
        onChange={(event) =>
          setForm((current) => ({ ...current, description: event.target.value }))
        }
        placeholder="Corte clássico na tesoura e máquina"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Duração (minutos)"
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
          label="Preço"
          type="number"
          min={0}
          step="0.01"
          required
          value={form.price}
          onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
          placeholder="45,00"
        />
      </div>

      <div className="border-ink-700/70 flex flex-col-reverse gap-2.5 border-t pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {service ? 'Salvar alterações' : 'Criar serviço'}
        </Button>
      </div>
    </form>
  );
}
