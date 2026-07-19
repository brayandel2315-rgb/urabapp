import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppIcon from '@/design-system/icons/AppIcon';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { COMM_CATEGORY_LABELS } from '@/communication';
import {
  getInboxNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
  toggleFavoriteNotification,
  toggleMuteNotification,
  notificationDeepLink,
} from '@/communication/inbox.service';
import { trackCommunicationEngagement } from '@/communication/engagement.service';
import {
  resolveNotifImage,
  resolveNotifKind,
  notifChipLabel,
  notifAccentClass,
  notifFallbackIcon,
} from '@/communication/notification-visuals';

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'unread', label: 'No leídas' },
  { id: 'favorite', label: 'Favoritas' },
  { id: 'archived', label: 'Archivadas' },
];

const DATE_RANGES = [
  { id: 'all', label: 'Todo el tiempo' },
  { id: '24h', label: 'Últimas 24h' },
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Más recientes' },
  { id: 'oldest', label: 'Más antiguas' },
  { id: 'priority', label: 'Por prioridad' },
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Todas las categorías' },
  ...Object.entries(COMM_CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
];

function relativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} d`;
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function InboxRow({ n, userId, onChanged }) {
  const navigate = useNavigate();
  const href = notificationDeepLink(n);
  const kind = resolveNotifKind({
    type: n.type,
    category: n.category,
    eventKey: n.data?.event_key,
    stage: n.data?.stage || n.data?.milestone || n.data?.eventType,
  });
  const image = resolveNotifImage(n);
  const chip = notifChipLabel(kind, {
    category: n.category,
    stage: n.data?.stage || n.data?.milestone || n.data?.eventType,
    eventType: n.data?.eventType,
  });
  const iconName = notifFallbackIcon(kind, n.category);

  const open = () => {
    trackCommunicationEngagement(userId, {
      notificationId: n.id,
      eventId: n.event_id,
      eventKey: n.data?.event_key,
      action: 'clicked',
    });
    if (!n.is_read) {
      markNotificationRead(n.id).then(onChanged);
      trackCommunicationEngagement(userId, {
        notificationId: n.id,
        eventId: n.event_id,
        eventKey: n.data?.event_key,
        action: 'opened',
      });
    }
    navigate(href);
  };

  return (
    <li>
      <article
        className={cn(
          'urabapp-notif urabapp-notif--inbox',
          notifAccentClass(kind),
          n.is_read && 'urabapp-notif--read',
          n.is_muted && 'opacity-60',
        )}
      >
        <button type="button" className="urabapp-notif__banner-hit" onClick={open}>
          <span className="urabapp-notif__media" aria-hidden>
            {image ? (
              <img
                src={image}
                alt=""
                className="urabapp-notif__img"
                width={52}
                height={52}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="urabapp-notif__icon-fallback">
                <AppIcon name={iconName} size={20} />
              </span>
            )}
          </span>
          <span className="urabapp-notif__body">
            <span className="urabapp-notif__meta-row">
              <span className="urabapp-notif__chip">{chip}</span>
              <span className="urabapp-notif__time">{relativeTime(n.created_at)}</span>
            </span>
            <span className={cn('urabapp-notif__title', !n.is_read && 'urabapp-notif__title--unread')}>
              {n.title}
            </span>
            {n.body ? <span className="urabapp-notif__desc">{n.body}</span> : null}
            <span className="urabapp-notif__cta">
              {n.is_read ? 'Abrir' : 'Nuevo · tocar para abrir'}
            </span>
          </span>
        </button>

        <div className="urabapp-notif__actions">
          <button
            type="button"
            aria-label="Favorito"
            className="urabapp-notif__action-btn"
            onClick={() => toggleFavoriteNotification(n.id, !n.is_favorite).then(onChanged)}
          >
            <AppIcon name="star" size="xs" className={n.is_favorite ? 'text-promo' : 'opacity-40'} />
          </button>
          <button
            type="button"
            aria-label="Archivar"
            className="urabapp-notif__action-btn"
            onClick={() => archiveNotification(n.id).then(onChanged)}
          >
            <AppIcon name="check" size="xs" />
          </button>
          <button
            type="button"
            aria-label="Silenciar"
            className="urabapp-notif__action-btn"
            onClick={() => toggleMuteNotification(n.id, !n.is_muted).then(onChanged)}
          >
            <AppIcon name="bell" size="xs" />
          </button>
        </div>
      </article>
    </li>
  );
}

export default function AccountNotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('all');
  const [priority] = useState('all');
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id, category, priority, filter, dateRange, sort, search],
    queryFn: () => getInboxNotifications(user.id, {
      category, priority, filter, dateRange, sort, search,
    }),
    enabled: !!user?.id,
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(user.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} aviso${unreadCount === 1 ? '' : 's'} sin leer`
            : 'Estás al día con tus avisos'}
        </p>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              loading={markAllMutation.isPending}
              onClick={() => markAllMutation.mutate()}
            >
              Marcar leídas
            </Button>
          )}
          <Link to="/cuenta/preferencias">
            <Button variant="outline" size="sm">Preferencias</Button>
          </Link>
        </div>
      </div>

      <Input
        placeholder="Buscar en avisos…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.slice(0, 2).map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? 'primary' : 'outline'}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? 'Menos filtros' : 'Más filtros'}
        </Button>
      </div>

      {showFilters && (
        <>
          <div className="flex flex-wrap gap-2">
            {FILTERS.slice(2).map((f) => (
              <Button
                key={f.id}
                size="sm"
                variant={filter === f.id ? 'primary' : 'outline'}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {DATE_RANGES.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {isLoading ? (
        <SurfaceCard className="p-6 text-center text-sm text-muted-foreground">
          Cargando bandeja…
        </SurfaceCard>
      ) : notifications.length === 0 ? (
        <SurfaceCard className="space-y-3 p-8 text-center">
          <AppIcon name="bell" className="mx-auto text-muted-foreground" size="xl" />
          <p className="font-semibold">Sin comunicaciones</p>
          <p className="text-sm text-muted-foreground">
            Cuando ocurra algo en tu pedido, carrito o cuenta, aparecerá aquí con imagen y enlace directo.
          </p>
          <Link to="/pedidos"><Button variant="outline" size="sm">Ver pedidos</Button></Link>
        </SurfaceCard>
      ) : (
        <ul className="space-y-2.5">
          {notifications.map((n) => (
            <InboxRow
              key={n.id}
              n={n}
              userId={user.id}
              onChanged={invalidate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
