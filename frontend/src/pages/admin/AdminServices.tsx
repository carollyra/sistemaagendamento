import { useState } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Spinner } from '../../components/Spinner';
import { ServiceForm, type ServiceFormValues } from '../../components/admin/ServiceForm';
import { useAdminServices } from '../../hooks/useAdminServices';
import { getErrorMessage } from '../../services/api';
import * as serviceService from '../../services/service.service';
import type { Service } from '../../types';
import { formatDuration, formatPrice } from '../../utils/format';

export function AdminServices() {
  const { services, isLoading, error, setError, refresh } = useAdminServices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  function openCreateForm() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEditForm(service: Service) {
    setEditing(service);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditing(null);
  }

  async function handleSubmit(values: ServiceFormValues) {
    setIsSubmitting(true);
    setError('');

    try {
      if (editing) {
        await serviceService.updateService(editing.id, {
          name: values.name,
          description: values.description,
          durationMinutes: values.durationMinutes,
          price: values.price,
        });
        setFeedback('Service updated.');
      } else {
        await serviceService.createService({
          name: values.name,
          description: values.description || undefined,
          durationMinutes: values.durationMinutes,
          price: values.price,
        });
        setFeedback('Service created.');
      }

      closeForm();
      refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Could not save the service'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(service: Service) {
    setError('');

    try {
      await serviceService.updateService(service.id, { active: !service.active });
      setFeedback(service.active ? 'Service deactivated.' : 'Service activated.');
      refresh();
    } catch (toggleError) {
      setError(getErrorMessage(toggleError, 'Could not update the service'));
    }
  }

  async function handleDelete() {
    if (!toDelete) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await serviceService.deleteService(toDelete.id);
      setFeedback(`“${toDelete.name}” removed (or deactivated if it already has appointments).`);
      setToDelete(null);
      refresh();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, 'Could not delete the service'));
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-100">Services</h2>
        {!isFormOpen && <Button onClick={openCreateForm}>New service</Button>}
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {feedback && !error && <Alert tone="success">{feedback}</Alert>}

      {isFormOpen && (
        <ServiceForm
          key={editing?.id ?? 'new'}
          service={editing}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {isLoading ? (
        <Spinner label="Loading services…" />
      ) : services.length === 0 ? (
        <Alert>No services yet. Create the first one.</Alert>
      ) : (
        <ul className="flex flex-col gap-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-col gap-3 rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-stone-100">{service.name}</span>
                  {!service.active && (
                    <span className="rounded-full border border-stone-600 bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
                      Inactive
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-stone-400">{service.description}</p>
                )}
                <p className="text-xs text-stone-500">
                  {formatDuration(service.durationMinutes)} · {formatPrice(service.price)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => openEditForm(service)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => toggleActive(service)}>
                  {service.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="danger" onClick={() => setToDelete(service)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete service?"
        description={
          toDelete
            ? `“${toDelete.name}” will be removed. If it already has appointments it is deactivated instead.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
