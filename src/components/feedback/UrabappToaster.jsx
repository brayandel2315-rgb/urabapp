import { Toaster } from 'sonner';

/** Contenedor Sonner — respeta safe-area (notch / status bar). */
export default function UrabappToaster() {
  return (
    <Toaster
      position="top-center"
      offset="calc(0.75rem + env(safe-area-inset-top, 0px))"
      gap={10}
      visibleToasts={3}
      expand
      closeButton={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'bg-transparent border-0 shadow-none p-0',
        },
      }}
    />
  );
}
