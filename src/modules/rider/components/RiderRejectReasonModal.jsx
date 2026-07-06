import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormSelect from '@/design-system/patterns/FormSelect';
import { REJECT_REASONS } from '../constants';

export default function RiderRejectReasonModal({ open, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState(REJECT_REASONS[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm rounded-3xl border border-border/40 bg-card p-5 shadow-2xl">
        <p className="font-display text-lg font-bold text-foreground">Motivo del rechazo</p>
        <p className="mt-1 text-sm text-muted-foreground">Nos ayuda a mejorar las ofertas para ti.</p>
        <FormSelect
          label="Razón"
          className="mt-4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {REJECT_REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </FormSelect>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button onClick={() => onConfirm(reason)} disabled={loading}>
            {loading ? '...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
