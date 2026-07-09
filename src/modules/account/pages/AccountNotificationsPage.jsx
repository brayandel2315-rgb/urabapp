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
import { trackCommunicationEngagement } from '@/communication/engagement.service';

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
        <p className="text-sm text-[#4A6278]">
          {unreadCount > 0 ? `${unreadCount} aviso${unreadCount === 1 ? '' : 's'} sin leer` : 'Estás al día con tus avisos'}
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

      {(
        <>
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
    </div>
  );
}
