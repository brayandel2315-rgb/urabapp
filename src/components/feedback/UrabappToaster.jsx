import { Toaster } from 'sonner';

/** Contenedor Sonner — el contenido visual vive en UrabappToast */
export default function UrabappToaster() {
  return (
    <Toaster
      position="top-center"
      offset={16}
      gap={10}
      visibleToasts={4}
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
