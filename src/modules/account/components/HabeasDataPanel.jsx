import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import {
  getMyPrivacyRequests,
  submitPrivacyRequest,
} from '@/services/legal.service';
import { toast } from '@/utils/toast';

const REQUEST_TYPES = [
  { id: 'access', label: 'Conocer / acceder a mis datos' },
  { id: 'rectify', label: 'Actualizar o rectificar datos' },
  { id: 'delete', label: 'Suprimir / eliminar mi cuenta' },
  { id: 'revoke', label: 'Revocar autorización (no esencial)' },
  { id: 'oppose', label: 'Oponerme a un tratamiento específico' },
];

export default function HabeasDataPanel({ userId }) {
  const queryClient = useQueryClient();
  const [requestType, setRequestType] = useState('access');
  const [notes, setNotes] = useState('');

  const { data: requests = [] } = useQuery({
    queryKey: ['privacy-requests', userId],
    queryFn: () => getMyPrivacyRequests(userId),
    enabled: Boolean(userId),
  });

  const mutation = useMutation({
    mutationFn: () => submitPrivacyRequest({
      userId,
      requestType,
      notes,
    }),
    onSuccess: (row) => {
      toast(
        requestType === 'delete'
          ? 'Solicitud de eliminación registrada. Te contactaremos en máximo 15 días hábiles.'
          : 'Solicitud de habeas data registrada',
      );
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['privacy-requests', userId] });
      if (row?.account_marked_deleted) {
        toast('Tu cuenta quedó marcada para baja. Cierra sesión cuando termines.', 'info');
      }
    },
    onError: (err) => toast(err.message || 'No se pudo registrar la solicitud', 'error'),
  });

  if (!userId) return null;

  return (
    <SurfaceCard className="space-y-4 p-5">
      <SectionTitle>Derechos sobre tus datos (Habeas Data)</SectionTitle>
      <p className="text-sm text-muted-foreground">
        Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 puedes conocer, actualizar, rectificar,
        suprimir y revocar la autorización del tratamiento. Urabapp actúa como{' '}
        <strong className="text-foreground">Responsable</strong>; proveedores como Supabase, Vercel,
        Wompi, Google y herramientas de mapas son{' '}
        <strong className="text-foreground">encargados / terceros</strong> necesarios para el servicio.
        Detalle en{' '}
        <Link to="/legal/datos" className="font-semibold text-primary hover:underline">
          Aviso de tratamiento
        </Link>
        {' '}y{' '}
        <Link to="/legal/privacidad" className="font-semibold text-primary hover:underline">
          Privacidad
        </Link>
        .
      </p>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground" htmlFor="privacy-request-type">
          Tipo de solicitud
        </label>
        <select
          id="privacy-request-type"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        >
          {REQUEST_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground" htmlFor="privacy-notes">
          Detalle (opcional)
        </label>
        <textarea
          id="privacy-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Describe qué datos o tratamiento quieres revisar…"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {requestType === 'delete' && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
          La eliminación puede conservar datos mínimos exigidos por ley (facturación, fraude) por el
          tiempo legal. Pedidos en curso deben cerrarse antes.
        </p>
      )}

      <Button
        type="button"
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        variant={requestType === 'delete' ? 'outline' : 'primary'}
      >
        Enviar solicitud
      </Button>

      {requests.length > 0 && (
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-foreground">Solicitudes recientes</p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {requests.slice(0, 5).map((r) => (
              <li key={r.id}>
                {r.request_type} · {r.status} ·{' '}
                {new Date(r.created_at).toLocaleDateString('es-CO')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SurfaceCard>
  );
}
