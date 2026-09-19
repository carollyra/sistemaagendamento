import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/** App-wide toaster, pinned to the dark palette used across the UI. */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="text-gold-400 size-4" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="text-mist-400 size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            '!bg-[rgb(11_13_17/0.9)] !backdrop-blur-2xl !border-white/[0.08] !text-mist-100 !shadow-panel !rounded-2xl !font-sans !gap-3',
          title: '!text-sm !font-medium',
          description: '!text-mist-400 !text-xs',
          actionButton: '!bg-gold-500 !text-ink-950 !rounded-lg',
          cancelButton: '!bg-ink-800 !text-mist-200 !rounded-lg',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
