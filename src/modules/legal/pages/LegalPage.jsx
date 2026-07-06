import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import { getLegalDocument, recordConsent } from '@/services/legal.service';
import { emitCommEvent } from '@/communication';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/utils/toast';

const DOC_TITLES = {
  privacidad: 'Política de privacidad',
  terminos: 'Términos y condiciones',
  cookies: 'Política de cookies',
  datos: 'Tratamiento de datos',
  condiciones: 'Condiciones del marketplace',
  comercio: 'Acuerdo de comercio aliado',
};

export default function LegalPage() {
  const { docId } = useParams();
  const { user } = useAuthStore();
  const title = DOC_TITLES[docId] || 'Documento legal';

  const { data: doc, isLoading } = useQuery({
    queryKey: ['legal', docId],
    queryFn: () => getLegalDocument(docId),
  });

  const consentMutation = useMutation({
    mutationFn: () => recordConsent(user.id, doc.id, doc.version),
    onSuccess: () => {
      emitCommEvent('legal_consent_recorded', {
        recipientId: user.id,
        payload: { documentId: doc.id, version: doc.version, docSlug: docId },
      }).catch(() => {});
      toast('Aceptación registrada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <PageLayout title={title} backTo="/" maxWidth="md">
      <SurfaceCard className="space-y-4 p-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : !doc ? (
          <p className="text-sm">Documento no encontrado.</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Versión {doc.version} · {new Date(doc.published_at).toLocaleDateString('es-CO')}</p>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{doc.content}</div>
            {user && doc.is_required && (
              <Button onClick={() => consentMutation.mutate()} loading={consentMutation.isPending}>
                Acepto esta versión
              </Button>
            )}
          </>
        )}
        <Link to="/cuenta/seguridad" className="text-sm text-primary">← Volver a seguridad</Link>
      </SurfaceCard>
    </PageLayout>
  );
}
