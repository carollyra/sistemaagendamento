import type { Service } from '../../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { ServiceForm, type ServiceFormValues } from './ServiceForm';

interface ServiceFormDialogProps {
  open: boolean;
  service?: Service | null;
  isSubmitting?: boolean;
  onSubmit: (values: ServiceFormValues) => void;
  onClose: () => void;
}

export function ServiceFormDialog({
  open,
  service,
  isSubmitting,
  onSubmit,
  onClose,
}: ServiceFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{service ? `Editar “${service.name}”` : 'Novo serviço'}</DialogTitle>
          <DialogDescription>
            {service
              ? 'As alterações valem para os próximos agendamentos.'
              : 'A duração define os horários que os clientes podem reservar.'}
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          key={service?.id ?? 'new'}
          service={service}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
