import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppIcon from '@/design-system/icons/AppIcon';
import { Badge } from '@/design-system/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  COMM_CATEGORY_LABELS,
  COMM_CATEGORY_ICONS,
  COMM_PRIORITY_LABELS,
} from '@/communication';
import {
  getInboxNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
  toggleFavoriteNotification,
  toggleMuteNotification,
  notificationDeepLink,
} from '@/communication/inbox.service';
import { normalizeAppPath } from '@/utils/navigation';
import { getCommunicationStats, getCommunicationTimeline } from '@/communication/dispatch.service';
import { getEngagementStats, trackCommunicationEngagement } from '@/communication/engagement.service';
import CommunicationPreferencesPanel from '../components/CommunicationPreferencesPanel';

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

const PRIORITY_OPTIONS = [
  { id: 'all', label: 'Todas las prioridades' },
  ...Object.entries(COMM_PRIORITY_LABELS).map(([id, label]) => ({ id, label })),
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Todas las categorías' },
  ...Object.entries(COMM_CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
];

function iconForNotification(n) {
  const cat = n.category || n.type;
  return COMM_CATEGORY_ICONS[cat] || (n.type === 'order' ? 'orders' : 'bell');
}

export default function AccountNotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('inbox');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id, category, priority, filter, dateRange, sort, search],
    queryFn: () => getInboxNotifications(user.id, {
      category, priority, filter, dateRange, sort, search,
    }),
    enabled: !!user?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ['comm-stats', user?.id],
    queryFn: () => getCommunicationStats(user.id),
    enabled: !!user?.id,
  });

  const { data: timeline = [] } = useQuery({
    queryKey: ['comm-timeline', user?.id, category],
    queryFn: () => getCommunicationTimeline(user.id, { category, limit: 30 }),
    enabled: !!user?.id && tab === 'timeline',
  });

  const { data: engagement } = useQuery({
    queryKey: ['comm-engagement', user?.id],
    queryFn: () => getEngagementStats(user.id),
    enabled: !!user?.id && tab === 'stats',
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
    queryClient.invalidateQueries({ queryKey: ['comm-stats'] });
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <SurfaceCard variant="highlight" className="text-sm">
        <p className="font-semibold text-primary-dark">Centro de Comunicación UrabApp</p>
        <p className="mt-1 text-muted">
          Pedidos, pagos, soporte y avisos del sistema en un solo lugar — con deep links a cada pantalla.
        </p>
        {stats && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Badge variant="muted">{stats.total} en bandeja</Badge>
            <Badge variant="muted">{stats.unread} sin leer</Badge>
            {Object.entries(stats.byCategory || {}).slice(0, 4).map(([cat, count]) => (
              <Badge key={cat} variant="outline">{COMM_CATEGORY_LABELS[cat] || cat}: {count}</Badge>
            ))}
          </div>
        )}
      </SurfaceCard>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === 'inbox' ? 'primary' : 'outline'} onClick={() => setTab('inbox')}>
          Bandeja
        </Button>
        <Button size="sm" variant={tab === 'timeline' ? 'primary' : 'outline'} onClick={() => setTab('timeline')}>
          Cronología
        </Button>
        <Button size="sm" variant={tab === 'prefs' ? 'primary' : 'outline'} onClick={() => setTab('prefs')}>
          Preferencias
        </Button>
        <Button size="sm" variant={tab === 'stats' ? 'primary' : 'outline'} onClick={() => setTab('stats')}>
          Métricas
        </Button>
      </div>

      {tab === 'prefs' && <CommunicationPreferencesPanel />}

      {tab === 'stats' && engagement && (
        <SurfaceCard className="grid gap-3 p-5 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-black text-primary">{engagement.opened}</p>
            <p className="text-xs text-muted-foreground">Avisos abiertos (30d)</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary">{engagement.clicked}</p>
            <p className="text-xs text-muted-foreground">Clics en avisos</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary">{engagement.ctr}%</p>
            <p className="text-xs text-muted-foreground">CTR aproximado</p>
          </div>
        </SurfaceCard>
      )}

      {tab === 'inbox' && (
        <>
          <Input
            placeholder="Buscar en avisos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
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

          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
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

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Estás al día'}
            </p>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                loading={markAllMutation.isPending}
                onClick={() => markAllMutation.mutate()}
              >
                Marcar todas leídas
              </Button>
            )}
          </div>

          {isLoading ? (
            <SurfaceCard className="p-6 text-center text-sm text-muted-foreground">
              Cargando bandeja…
            </SurfaceCard>
          ) : notifications.length === 0 ? (
            <SurfaceCard className="space-y-3 p-8 text-center">
              <AppIcon name="bell" className="mx-auto text-muted-foreground" size="xl" />
              <p className="font-semibold">Sin comunicaciones</p>
              <p className="text-sm text-muted-foreground">
                Cuando ocurra algo en UrabApp, aparecerá aquí con enlace directo.
              </p>
              <Link to="/pedidos"><Button variant="outline" size="sm">Ver pedidos</Button></Link>
            </SurfaceCard>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => {
                const href = notificationDeepLink(n);
                return (
                  <li key={n.id}>
                    <div
                      className={cn(
                        'rounded-2xl border p-4 transition',
                        n.is_read ? 'border-border bg-card' : 'border-primary/25 bg-primary/5',
                        n.is_muted && 'opacity-60',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Link
                          to={href}
                          onClick={() => {
                            trackCommunicationEngagement(user.id, {
                              notificationId: n.id,
                              eventId: n.event_id,
                              eventKey: n.data?.event_key,
                              action: 'clicked',
                            });
                            if (!n.is_read) {
                              markNotificationRead(n.id).then(invalidate);
                              trackCommunicationEngagement(user.id, {
                                notificationId: n.id,
                                eventId: n.event_id,
                                eventKey: n.data?.event_key,
                                action: 'opened',
                              });
                            }
                          }}
                          className="flex min-w-0 flex-1 items-start gap-3"
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                              n.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground',
                            )}
                          >
                            <AppIcon name={iconForNotification(n)} size="sm" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-foreground">{n.title}</p>
                              {n.category && (
                                <Badge variant="muted" className="text-[10px]">
                                  {COMM_CATEGORY_LABELS[n.category] || n.category}
                                </Badge>
                              )}
                              {n.priority && n.priority !== 'medium' && (
                                <Badge variant="outline" className="text-[10px]">
                                  {COMM_PRIORITY_LABELS[n.priority] || n.priority}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                            <p className="mt-2 text-[11px] font-medium text-primary">
                              {n.is_read ? 'Abrir' : 'Nuevo · tocar para abrir'}
                            </p>
                          </div>
                        </Link>
                        <div className="flex shrink-0 flex-col gap-1">
                          <button
                            type="button"
                            aria-label="Favorito"
                            className="rounded-lg p-1 text-muted hover:bg-muted"
                            onClick={() => toggleFavoriteNotification(n.id, !n.is_favorite).then(invalidate)}
                          >
                            <AppIcon name="star" size="xs" className={n.is_favorite ? 'text-promo' : 'opacity-40'} />
                          </button>
                          <button
                            type="button"
                            aria-label="Archivar"
                            className="rounded-lg p-1 text-muted hover:bg-muted"
                            onClick={() => archiveNotification(n.id).then(invalidate)}
                          >
                            <AppIcon name="check" size="xs" />
                          </button>
                          <button
                            type="button"
                            aria-label="Silenciar"
                            className="rounded-lg p-1 text-muted hover:bg-muted"
                            onClick={() => toggleMuteNotification(n.id, !n.is_muted).then(invalidate)}
                          >
                            <AppIcon name="bell" size="xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === 'timeline' && (
        <ul className="space-y-2">
          {timeline.length === 0 ? (
            <SurfaceCard className="p-6 text-center text-sm text-muted">Sin eventos en cronología.</SurfaceCard>
          ) : (
            timeline.map((ev) => (
              <li key={ev.id}>
                <SurfaceCard className="p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{ev.title || ev.event_key}</p>
                    <Badge variant="muted" className="text-[10px]">
                      {COMM_CATEGORY_LABELS[ev.category] || ev.category}
                    </Badge>
                  </div>
                  {ev.body && <p className="mt-1 text-muted-foreground">{ev.body}</p>}
                  {ev.deep_link && (
                    <Link to={normalizeAppPath(ev.deep_link) || '/cuenta/notificaciones'} className="mt-2 inline-block text-xs font-semibold text-primary">
                      Abrir →
                    </Link>
                  )}
                  <p className="mt-1 text-[10px] text-muted">
                    {new Date(ev.created_at).toLocaleString('es-CO')}
                  </p>
                </SurfaceCard>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
