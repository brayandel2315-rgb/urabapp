import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import LiveCameraCapture from '@/components/media/LiveCameraCapture';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import AppIcon from '@/design-system/icons/AppIcon';
import RiderLeaderboard from '@/components/RiderLeaderboard';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import { renderRiderProfileGate } from '../components/RiderProfileGate';
import { getRiderLeaderboard } from '@/services/rider.service';
import {
  getCourierDocuments,
  getCourierRegions,
  getCourierReputation,
  getCourierEvents,
  logSecurityEvent,
  saveCourierLiveSelfie,
  upsertCourierDocument,
} from '@/services/courier-panel.service';
import { uploadCourierDocument } from '@/services/storage.service';
import { signOut } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/utils/toast';
import { PRODUCTION_APP_URL } from '@/utils/constants';
import { COURIER_VERIFICATION_STATUS, DOCUMENT_TYPES, getCourierLevel } from '../constants';

const EMERGENCY_NUMBER = '123';

export default function RiderAccount() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sharing, setSharing] = useState(false);
  const [uploading, setUploading] = useState(null);

  const driverQuery = useMyDriverProfile();
  const { data: driver, refetch: refetchDriver } = driverQuery;

  const { data: documents = [], isError: docsError, refetch: refetchDocs } = useQuery({
    queryKey: ['courier-documents', driver?.id],
    queryFn: () => getCourierDocuments(driver.id),
    enabled: !!driver?.id,
    retry: 1,
  });

  const { data: regions = [], isError: regionsError } = useQuery({
    queryKey: ['courier-regions', driver?.id],
    queryFn: () => getCourierRegions(driver.id),
    enabled: !!driver?.id && driver?.intermunicipal_enabled,
    retry: 1,
  });

  const { data: rep, isError: repError } = useQuery({
    queryKey: ['courier-reputation', driver?.id],
    queryFn: getCourierReputation,
    enabled: !!driver?.id,
    retry: 1,
  });

  const { data: leaderboard = [], isError: leaderboardError } = useQuery({
    queryKey: ['rider-leaderboard', driver?.municipio],
    queryFn: () => getRiderLeaderboard({ municipio: driver?.municipio, limit: 5 }),
    enabled: !!driver?.municipio,
    retry: 1,
  });

  const { data: events = [], refetch: refetchEvents, isError: eventsError } = useQuery({
    queryKey: ['courier-events', driver?.id],
    queryFn: () => getCourierEvents(driver.id),
    enabled: !!driver?.id,
  });

  const status = driver?.verification_status || 'pending';
  const statusMeta = COURIER_VERIFICATION_STATUS[status];
  const level = getCourierLevel(rep?.total_deliveries ?? driver?.total_deliveries ?? 0);
  const needsRegistration = !driver || status === 'pending';

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate('/login');
  };

  const handleEmergency = async () => {
    await logSecurityEvent('emergency', { timestamp: new Date().toISOString() });
    toast('Alerta registrada. UrabApp fue notificado.', 'error');
    window.open(`tel:${EMERGENCY_NUMBER}`, '_self');
    refetchEvents();
  };

  const handleShareRoute = async () => {
    setSharing(true);
    try {
      const url = `${PRODUCTION_APP_URL}/domiciliario`;
      const text = `Estoy en ruta como mensajero UrabApp. Mi ubicación: ${url}`;
      if (navigator.share) {
        await navigator.share({ title: 'Mi ruta UrabApp', text, url });
      } else {
        await navigator.clipboard.writeText(text);
        toast('Enlace copiado al portapapeles');
      }
      await logSecurityEvent('share_route', {});
      refetchEvents();
    } catch {
      toast('No se pudo compartir', 'error');
    } finally {
      setSharing(false);
    }
  };

  const handleDocUpload = async (docType, file) => {
    if (!driver?.id || !file) return null;
    setUploading(docType);
    try {
      const url = await uploadCourierDocument(driver.id, docType, file);
      await upsertCourierDocument(driver.id, docType, url);
      refetchDocs();
      toast('Documento subido');
      return url;
    } catch (e) {
      toast(e.message, 'error');
      throw e;
    } finally {
      setUploading(null);
    }
  };

  const blocked = renderRiderProfileGate(driverQuery, {
    loadingTitle: 'Cargando tu cuenta de repartidor…',
    requireDriver: false,
  });
  if (blocked) return blocked;

  return (
    <div className="space-y-4">
      <SurfaceCard className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {driver?.profile_photo_url ? (
            <img src={driver.profile_photo_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <AppIcon name="mensajeria" size="2xl" className="text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-foreground">{driver?.name || 'Mensajero'}</p>
          <p className="text-sm text-muted-foreground">{driver?.municipio || 'Urabá'} · Nivel {level.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">⭐ {Number(rep?.rating ?? driver?.rating ?? 5).toFixed(1)}</p>
          <p className="text-[10px] font-semibold text-muted-foreground">{statusMeta?.label}</p>
        </div>
      </SurfaceCard>

      {needsRegistration && (
        <SurfaceCard className="border-l-4 border-l-primary bg-primary/5">
          <p className="font-bold text-foreground">Completa tu registro</p>
          <p className="mt-1 text-sm text-muted-foreground">Activa tu cuenta en 2 pasos para recibir pedidos.</p>
          <Link to="/domiciliario/registro" className="mt-3 inline-block">
            <Button size="sm">Continuar registro</Button>
          </Link>
        </SurfaceCard>
      )}

      <MetricGrid className="grid-cols-2">
        <MetricCard label="Entregas" value={rep?.total_deliveries ?? driver?.total_deliveries ?? 0} icon="package" trend="Completadas en UrabApp" />
        <MetricCard label="Aceptación" value={`${Number(rep?.acceptance_rate ?? 100).toFixed(0)}%`} icon="check" accent trend="Ofertas que aceptaste" />
        <MetricCard label="Finalización" value={`${Number(rep?.completion_rate ?? 100).toFixed(0)}%`} icon="star" trend="Pedidos que terminaste" />
        <MetricCard label="Puntualidad" value={`${Number(rep?.punctuality_score ?? 100).toFixed(0)}%`} icon="clock" trend="A tiempo al cliente" />
      </MetricGrid>

      <SurfaceCard>
        <SectionTitle>Vehículo</SectionTitle>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Tipo</dt><dd className="font-medium">{driver?.vehicle || '—'}</dd></div>
          {driver?.plate && <div className="flex justify-between"><dt className="text-muted-foreground">Placa</dt><dd>{driver.plate}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted-foreground">Intermunicipal</dt><dd>{driver?.intermunicipal_enabled ? 'Sí' : 'No'}</dd></div>
        </dl>
        {regions.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {regions.map((r) => (
              <li key={r.id}>{r.origin_municipio} → {r.dest_municipio}</li>
            ))}
          </ul>
        )}
        {regionsError && driver?.intermunicipal_enabled && (
          <p className="mt-2 text-xs text-muted-foreground">Rutas intermunicipales no disponibles temporalmente.</p>
        )}
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Ranking {driver?.municipio}</SectionTitle>
        <div className="mt-2">
          {leaderboardError ? (
            <p className="text-xs text-muted-foreground">No pudimos cargar el ranking. Intenta más tarde.</p>
          ) : (
            <RiderLeaderboard riders={leaderboard} highlightId={driver?.id} compact />
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Foto de verificación</SectionTitle>
        <p className="text-xs text-muted-foreground">
          Obligatoria en el registro. Debe tomarse en vivo con la cámara — no se acepta galería.
        </p>
        {driver?.profile_photo_url && (
          <img src={driver.profile_photo_url} alt="" className="mx-auto h-24 w-24 rounded-2xl object-cover ring-2 ring-primary/20" />
        )}
        {driver?.id && (
          <LiveCameraCapture
            label={driver.profile_photo_url ? 'Actualizar foto en vivo' : 'Tomar foto en vivo'}
            onCapture={async (file) => {
              setUploading('profile_photo');
              try {
                await saveCourierLiveSelfie(driver.id, file);
                refetchDriver();
                refetchDocs();
                toast('Foto actualizada');
              } catch (e) {
                toast(e.message, 'error');
                throw e;
              } finally {
                setUploading(null);
              }
            }}
          />
        )}
        {uploading === 'profile_photo' && (
          <p className="text-xs text-muted-foreground">Guardando foto…</p>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Documentos</SectionTitle>
        <p className="text-xs text-muted-foreground">Cédula y licencia cuando puedas — refuerzan tu verificación.</p>
        {docsError && (
          <p className="text-xs text-destructive">No pudimos cargar tus documentos. Toca para reintentar.</p>
        )}
        {docsError && (
          <Button size="sm" variant="outline" onClick={() => refetchDocs()}>Reintentar</Button>
        )}
        {DOCUMENT_TYPES.slice(0, 3).map((doc) => {
          const uploaded = documents.find((d) => d.doc_type === doc.key);
          return (
            <div key={doc.key} className="rounded-xl border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                {uploaded && <span className="text-xs font-bold text-primary">✓</span>}
              </div>
              {!uploaded && driver?.id && (
                <ImageUpload onUpload={(file) => handleDocUpload(doc.key, file)} />
              )}
              {uploading === doc.key && (
                <p className="mt-1 text-xs text-muted-foreground">Subiendo...</p>
              )}
            </div>
          );
        })}
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Seguridad</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="destructive" onClick={handleEmergency}>Emergencia</Button>
          <Button variant="outline" disabled={sharing} onClick={handleShareRoute}>Compartir ruta</Button>
          <Link to="/soporte" className="sm:col-span-2">
            <Button variant="secondary" className="w-full">Ayuda y soporte</Button>
          </Link>
        </div>
        {events.length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {events.slice(0, 3).map((ev) => (
              <li key={ev.id}>{ev.event_type} · {new Date(ev.created_at).toLocaleString('es-CO')}</li>
            ))}
          </ul>
        )}
        {eventsError && (
          <p className="text-xs text-muted-foreground">Historial de seguridad no disponible.</p>
        )}
      </SurfaceCard>

      <Button variant="outline" className="w-full text-destructive" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}
