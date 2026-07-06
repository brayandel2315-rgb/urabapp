import ConfirmModal from '../ui/ConfirmModal';

export default function CartStoreSwitchModal({
  open,
  conflict,
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!conflict) return null;

  const current = conflict.currentBusinessName || 'otra tienda';
  const next = conflict.nextBusinessName || 'esta tienda';

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title="¿Cambiar de tienda?"
      message={`Tu carrito tiene productos de ${current}. Para pedir de ${next}, vaciaremos el carrito actual.`}
      confirmLabel="Vaciar y continuar"
      cancelLabel="Mantener carrito"
      variant="danger"
    />
  );
}
