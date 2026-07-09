import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';
import RoleModeSwitcher from '@/components/roles/RoleModeSwitcher';
import ClientHubShortcuts from '@/modules/client/components/ClientHubShortcuts';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import ClientDeliveryHandoffPanel from '@/components/tracking/ClientDeliveryHandoffPanel';
import GuestOrderRecoveryCard from '@/modules/client/components/GuestOrderRecoveryCard';
import DetectedLocationChip from '@/components/geo/DetectedLocationChip';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore, selectHomeMunicipio } from '@/store/locationStore';
import { signOut, updateProfile } from '@/services/auth.service';
import { saveUserDocument } from '@/services/promo.service';
import { formatCOP } from '@/utils/currency';
import { WELCOME_BENEFIT } from '@/utils/constants';
import { isValidColombianDocument, sanitizeText } from '@/utils/validate';
import { getMyNotifications } from '@/services/notification.service';
import { getUserAddresses } from '@/services/address.service';
import { getUserCoupons } from '@/services/wallet.service';
import { useClientActivity } from '@/hooks/useClientActivity';
import { ROLES } from '@/utils/constants';
import { getRoleLabel } from '@/app/roleConfig';
import { CLIENT_NOTIFICATIONS, CLIENT_ORDERS } from '@/app/clientNav';
import { toast } from '@/utils/toast';
import AppIcon from '@/design-system/icons/AppIcon';

export default function AccountProfilePage() {
  const { user, profile, logout, setProfile } = useAuthStore();
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const role = profile?.role || ROLES.CLIENT;
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [documentNumber, setDocumentNumber] = useState(profile?.document_number || '');
  const [saving, setSaving] = useState(false);
  const [savingDoc, setSavingDoc] = useState(false);
  const { activeCount, primaryActivity } = useClientActivity();

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getUserAddresses(user.id),
    enabled: !!user?.id,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getMyNotifications(user.id),
    enabled: !!user?.id,
  });

  const { data: coupons = [] } = useQuery({
    queryKey: ['user-coupons', user?.id],
    queryFn: () => getUserCoupons(user.id),
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const couponCount = coupons.length;
  const statusLabel = {
    active: 'Activa',
    pending: 'Pendiente verificación',
    blocked: 'Bloqueada',
    deleted: 'Eliminada',
  }[profile?.account_status || 'active'];

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        full_name: sanitizeText(fullName, 120),
        phone: phone.trim(),
      });
      if (updated) setProfile(updated);
      setEditing(false);
      toast('Perfil actualizado');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!user?.id) return;
    setSavingDoc(true);
    try {
      const updated = await saveUserDocument(user.id, documentNumber);
      if (updated) setProfile(updated);
      setDocumentNumber(updated.document_number || '');
      toast('Cédula registrada');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingDoc(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  if (!user) return null;

  return (
    <div className="space-y-5">
      <SurfaceCard className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Área de cliente
            </p>
            <h2 className="mt-1 truncate font-display text-xl font-bold">
              {profile?.full_name || 'Usuario'}
            </h2>
            <p className="truncate text-sm text-muted-foreground">{profile?.email || user.email}</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {getRoleLabel(role)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium">Cuenta {statusLabel.toLowerCase()}</span>
        </div>
        <RoleModeSwitcher />
      </SurfaceCard>

      <ClientActiveOrderBanner />

      {primaryActivity?.status === 'on_the_way'
        && primaryActivity.service !== 'shipment'
        && user?.id && (
        <ClientDeliveryHandoffPanel orderId={primaryActivity.id} compact />
      )}

      <GuestOrderRecoveryCard
        title="Recuperar pedidos de otro dispositivo"
        description="Si pediste como invitado en otro celular, verifica el mismo número aquí. Tus pedidos aparecerán en Historial al instante."
      />

      <MetricGrid layout="account">
        <Link to={CLIENT_ORDERS} className="block h-full min-h-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:rounded-3xl">
          <MetricCard
            variant="account"
            tone="green"
            label="Servicios activos"
            value={activeCount}
            icon="orders"
            trend={activeCount > 0 ? 'Pedidos y envíos en curso' : 'Sin actividad en curso'}
            accent={activeCount > 0}
            interactive
            className="h-full"
          />
        </Link>
        <Link to={CLIENT_NOTIFICATIONS} className="block h-full min-h-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:rounded-3xl">
          <MetricCard
            variant="account"
            tone="blue"
            label="Notificaciones"
            value={unreadCount}
            icon="bell"
            trend={unreadCount > 0 ? 'Por revisar' : 'Al día'}
            accent={unreadCount > 0}
            interactive
            className="h-full"
          />
        </Link>
        <Link to="/cuenta/direcciones" className="block h-full min-h-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:rounded-3xl">
          <MetricCard
            variant="account"
            tone="sky"
            label="Direcciones"
            value={addresses.length}
            icon="map"
            trend={addresses.length > 0 ? `${homeMunicipio} · principal guardada` : 'Agrega una para pedir rápido'}
            interactive
            className="h-full"
          />
        </Link>
        <Link to="/cuenta/cupones" className="block h-full min-h-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:rounded-3xl">
          <MetricCard
            variant="account"
            tone="promo"
            label="Cupones"
            value={couponCount}
            mobileValue="Ver"
            icon="tag"
            trend={couponCount > 0 ? `${couponCount} disponible${couponCount === 1 ? '' : 's'} para usar` : 'Promociones para ti'}
            accent={couponCount > 0}
            interactive
            className="h-full"
          />
        </Link>
      </MetricGrid>

      <section className="space-y-2">
        <SectionTitle>Accesos rápidos</SectionTitle>
        <ClientHubShortcuts variant="compact" />
      </section>

      <SurfaceCard className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionTitle>Estado de entrega</SectionTitle>
            <p className="text-sm text-muted-foreground">
              Zona y ubicación para pedidos y envíos
            </p>
          </div>
          <Link
            to="/cuenta/direcciones"
            className="text-xs font-bold text-primary"
          >
            Direcciones
          </Link>
        </div>
        <DetectedLocationChip className="w-full max-w-none" />
        <p className="text-xs text-muted-foreground">
          Municipio de referencia: <strong>{homeMunicipio}</strong>
        </p>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Datos personales</SectionTitle>
        {editing ? (
          <div className="space-y-3">
            <Input label="Nombre" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleSave} loading={saving}>Guardar</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nombre:</span> {profile?.full_name}</p>
            <p><span className="text-muted-foreground">Teléfono:</span> {profile?.phone || '—'}</p>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar perfil</Button>
          </div>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-3 p-5">
        <SectionTitle>Beneficio de bienvenida</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Registra tu cédula una vez. En tu primer pedido desde {formatCOP(WELCOME_BENEFIT.minOrder)} el domicilio es gratis.
        </p>
        {profile?.welcome_delivery_used_at ? (
          <p className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
            Ya usaste tu entrega gratis el {new Date(profile.welcome_delivery_used_at).toLocaleDateString('es-CO')}.
          </p>
        ) : profile?.document_number ? (
          <p className="rounded-xl bg-primary/10 p-3 text-sm text-secondary">
            Cédula ···{profile.document_number.slice(-4)} registrada. Se aplica automáticamente en checkout.
          </p>
        ) : (
          <>
            <Input
              label="Cédula de ciudadanía"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="1234567890"
              inputMode="numeric"
            />
            <Button
              className="w-full"
              disabled={savingDoc || !isValidColombianDocument(documentNumber)}
              onClick={handleSaveDocument}
            >
              {savingDoc ? 'Guardando...' : 'Registrar cédula'}
            </Button>
          </>
        )}
      </SurfaceCard>

      <SurfaceCard className="flex items-center justify-between p-5">
        <div>
          <p className="font-semibold">Tema de la app</p>
          <p className="text-sm text-muted-foreground">Claro u oscuro</p>
        </div>
        <ThemeToggle />
      </SurfaceCard>

      <Link
        to={CLIENT_NOTIFICATIONS}
        className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AppIcon name="bell" size="sm" />
          </span>
          <div>
            <p className="font-semibold">Centro de notificaciones</p>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Ver historial de avisos'}
            </p>
          </div>
        </div>
        <span className="text-muted-foreground" aria-hidden>›</span>
      </Link>

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}
