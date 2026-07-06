import AppIcon from '@/design-system/icons/AppIcon';
import { LEGAL_ENTITY_TYPES, getRequiredLegalDocuments } from '@/utils/business-registration';
import { maskSensitiveId } from '@/utils/mask-sensitive';
import { StatusBadge } from '@/design-system/patterns/MetricCard';

function ReadonlyField({ label, value }) {
  return (
    <div className="rounded-xl bg-background/80 px-3 py-2.5 ring-1 ring-border/40">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value || '—'}</p>
    </div>
  );
}

export default function BusinessLegalReadonly({ business, variant = 'pending' }) {
  const docs = business.verification_documents || {};
  const entityLabel = LEGAL_ENTITY_TYPES[business.legal_entity_type]?.label || 'Persona natural';
  const requiredDocs = getRequiredLegalDocuments({
    legalEntityType: business.legal_entity_type || 'natural',
    categoryId: business.category,
  });

  const STATUS = {
    approved: { label: 'Verificado', status: 'success', hint: 'Tus datos legales están protegidos y no pueden modificarse desde la app.' },
    pending: { label: 'En revisión', status: 'warning', hint: 'Tus documentos están en revisión. No puedes modificarlos hasta recibir respuesta.' },
    rejected: { label: 'Rechazado', status: 'danger', hint: business.rejection_reason || 'Debes corregir y reenviar la documentación.' },
  };
  const statusMeta = STATUS[variant] || STATUS.pending;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-3">
        <AppIcon name="lock" size="sm" className="mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Información legal registrada</p>
            <StatusBadge status={statusMeta.status}>{statusMeta.label}</StatusBadge>
          </div>
          <p className="mt-1 text-xs text-muted">{statusMeta.hint}</p>
          {business.verification_submitted_at && (
            <p className="mt-1 text-[11px] text-muted">
              Enviado el {new Date(business.verification_submitted_at).toLocaleString('es-CO')}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <ReadonlyField label="Tipo de comerciante" value={entityLabel} />
        <ReadonlyField
          label={business.legal_entity_type === 'juridica' ? 'NIT empresa' : 'NIT / RUT'}
          value={maskSensitiveId(business.nit)}
        />
        <ReadonlyField label="Titular / representante" value={business.legal_representative_name} />
        <ReadonlyField label="Cédula titular" value={maskSensitiveId(business.representative_document_number)} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {requiredDocs.map((doc) => {
          const url = docs[doc.key];
          const isPdf = url?.toLowerCase().includes('.pdf');
          return (
            <div key={doc.key} className="flex items-center justify-between rounded-xl bg-background/80 px-3 py-2.5 ring-1 ring-border/40">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{doc.label}</p>
                <p className="text-[11px] text-muted">{url ? (isPdf ? 'PDF cargado' : 'Imagen cargada') : 'No registrado'}</p>
              </div>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-semibold text-primary">
                  Ver
                </a>
              ) : (
                <AppIcon name="alert" size="xs" className="shrink-0 text-amber-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
