import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = '¿Confirmar?',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {message && <p className="mb-6 text-sm text-muted-foreground">{message}</p>}
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          className="flex-1"
          variant={variant === 'danger' ? 'destructive' : 'primary'}
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? 'Procesando…' : confirmLabel}
        </Button>
        <Button className="flex-1" variant="outline" disabled={loading} onClick={onClose}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}
