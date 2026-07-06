import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import { reportOrderIncident } from '@/services/order-tracking.service';
import { toast } from '@/utils/toast';

const REASONS = [
  'Cliente no responde',
  'Dirección incorrecta',
  'Retraso en comercio',
  'Accidente o avería',
  'Paquete dañado',
  'Otro',
];

export default function OrderIncidentReport({ orderId, compact = false }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => reportOrderIncident(orderId, reason, notes),
    onSuccess: (result) => {
      if (!result?.success) {
        toast('No se pudo registrar la incidencia', 'error');
        return;
      }
      toast('Incidencia registrada');
      queryClient.invalidateQueries({ queryKey: ['order-events', orderId] });
      setOpen(false);
      setNotes('');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  if (!open) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        Reportar incidencia
      </Button>
    );
  }

  return (
    <div className={`space-y-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 ${compact ? '' : ''}`}>
      <p className="text-sm font-semibold text-destructive">Reportar incidencia</p>
      <select
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        {REASONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <textarea
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        rows={2}
        placeholder="Detalles opcionales"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Enviar
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
