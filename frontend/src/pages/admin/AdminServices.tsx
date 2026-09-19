import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SkeletonList } from '../../components/Skeleton';
import type { ServiceFormValues } from '../../components/admin/ServiceForm';
import { ServiceFormDialog } from '../../components/admin/ServiceFormDialog';
import { Badge } from '../../components/ui/badge';
import { useAdminServices } from '../../hooks/useAdminServices';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { getErrorMessage } from '../../services/api';
import * as serviceService from '../../services/service.service';
import type { Service } from '../../types';
import { formatDuration, formatPrice } from '../../utils/format';

export function AdminServices() {
  const { services, isLoading, error, refresh } = useAdminServices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

    try {
      if (editing) {
        await serviceService.updateService(editing.id, {
          name: values.name,
          description: values.description,
          durationMinutes: values.durationMinutes,
          price: values.price,
        });
        toast.success('Service updated', { description: values.name });
      } else {
        await serviceService.createService({
          name: values.name,
          description: values.description || undefined,
          durationMinutes: values.durationMinutes,
          price: values.price,
        });
        toast.success('Service created', { description: values.name });
      }

      closeForm();
      refresh();
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, 'Could not save the service'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(service: Service) {
    try {
      await serviceService.updateService(service.id, { active: !service.active });
      toast.success(service.active ? 'Service deactivated' : 'Service activated', {
        description: service.name,
      });
      refresh();
    } catch (toggleError) {
      toast.error(getErrorMessage(toggleError, 'Could not update the service'));
    }
  }

  async function handleDelete() {
    if (!toDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await serviceService.deleteService(toDelete.id);
      toast.success(`“${toDelete.name}” removed`, {
        description: 'Services with appointments are deactivated instead of deleted.',
      });
      setToDelete(null);
      refresh();
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, 'Could not delete the service'));
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Service catalogue</h2>
          <p className="text-mist-500 mt-1 text-sm">
            {services.length} {services.length === 1 ? 'service' : 'services'} · inactive ones stay
            hidden from clients
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" aria-hidden />
          New service
        </Button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <SkeletonList rows={4} label="Loading services" />
      ) : services.length === 0 ? (
        <div className="surface flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="font-display text-mist-100 text-base font-medium">No services yet</p>
          <p className="text-mist-400 text-sm">Create the first one to open the agenda.</p>
          <Button onClick={openCreateForm}>New service</Button>
        </div>
      ) : (
        <motion.ul
          className="flex flex-col gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence initial={false}>
            {services.map((service) => (
              <motion.li
                key={service.id}
                layout
                variants={staggerItem}
                exit={{ opacity: 0, y: -8 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className={`surface surface-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
                  service.active ? '' : 'opacity-65'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="border-ink-700 bg-ink-900/80 text-gold-400 font-display flex h-14 min-w-24 shrink-0 items-center justify-center rounded-xl border px-3 text-sm font-semibold tabular-nums">
                    {formatPrice(service.price)}
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-base font-medium">{service.name}</h3>
                      {!service.active && <Badge variant="muted">Inactive</Badge>}
                    </div>
                    {service.description && (
                      <p className="text-mist-400 text-sm leading-relaxed">{service.description}</p>
                    )}
                    <p className="text-mist-500 text-xs">
                      {formatDuration(service.durationMinutes)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEditForm(service)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(service)}>
                    {service.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setToDelete(service)}>
                    Delete
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <ServiceFormDialog
        open={isFormOpen}
        service={editing}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

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
