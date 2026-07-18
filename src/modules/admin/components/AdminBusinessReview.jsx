import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Input from '@/components/ui/Input';
import AppIcon from '@/design-system/icons/AppIcon';
import { LEGAL_DOC_SPECS } from '@/utils/business-registration';
import { getAllBusinesses } from '@/services/admin.service';
import { approveBusiness, rejectBusiness } from '@/services/legal.service';
import { toast } from '@/utils/toast';
import { parseJsonRecord } from '@/utils/json-safe';
import { mapApiError } from '@/utils/errors';
import { STORE } from '@/utils/marketplace-copy';

const DOC_LINK_LABELS = {
  ...Object.fromEntries(Object.entries(LEGAL_DOC_SPECS).map(([k, v]) => [k, v.label])),
  cedula: 'Cédula',
  camara_comercio: 'Cámara / RUT',
};

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-primary/10 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
  suspended: 'bg-muted text-muted-foreground',
};

export default function AdminBusinessReview({ businesses: businessesProp }) {
  const queryClient = useQueryClient();
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');

  const { data: fetchedBusinesses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-businesses-review'],
    queryFn: getAllBusinesses,
    enabled: businessesProp == null,
  });

  const businesses = businessesProp ?? fetchedBusinesses;

  const approveMutation = useMutation({
    mutationFn: approveBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-businesses-review'] });
      toast(`${STORE.one} aprobada y publicada`);
    },
    onError: (err) => toast(mapApiError(err), 'error'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason: r }) => rejectBusiness(id, r),
    onSuccess: () => {
      setRejectId(null);
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-businesses-review'] });
      toast(`${STORE.one} rechazada`);
    },
    onError: (err) => toast(mapApiError(err), 'error'),
  });

  const pending = businesses.filter((b) => b.verification_status === 'pending' || !b.is_published);

  if (isError && businessesProp == null) {
    return (
      <SurfaceCard className="space-y-3 p-5 text-center">
        <p className="text-sm text-muted">No pudimos cargar las tiendas para revisión.</p>
        <Button size="sm" onClick={() => refetch()}>Reintentar</Button>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4 p-5">
      <SectionTitle>Revisión de {STORE.manyLower}</SectionTitle>
      <p className="text-sm text-muted-foreground">
        Solo las {STORE.manyLower} aprobadas aparecen en el catálogo público. Las nuevas quedan en revisión.
      </p>
      {isLoading ? (
        <Loader variant="section" message="Cargando tiendas…" className="min-h-[8rem]" />
      ) : pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay {STORE.manyLower} pendientes de revisión.</p>
      ) : (
        <ul className="space-y-3">
          {pending.map((b) => (
            <li key={b.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <AppIcon name={b.emoji || 'store'} size="xs" />
                    {b.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{b.municipio} · {b.category}</p>
                  {b.nit && (
                    <p className="text-xs text-muted-foreground">NIT: {b.nit} · {b.legal_representative_name}</p>
                  )}
                  {(() => {
                    const docs = parseJsonRecord(b.verification_documents);
                    return Object.keys(docs).length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {Object.entries(docs).map(([key, url]) => (
                        url ? (
                          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
                            {DOC_LINK_LABELS[key] || key}
                          </a>
                        ) : null
                      ))}
                    </div>
                    ) : null;
                  })()}
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[b.verification_status] || STATUS_BADGE.pending}`}>
                    {b.verification_status || 'pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveMutation.mutate(b.id)} loading={approveMutation.isPending}>
                    Aprobar y publicar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRejectId(b.id)}>Rechazar</Button>
                </div>
              </div>
              {rejectId === b.id && (
                <div className="mt-3 flex gap-2">
                  <Input placeholder="Motivo (opcional)" value={reason} onChange={(e) => setReason(e.target.value)} />
                  <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate({ id: b.id, reason })}>Confirmar</Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  );
}
