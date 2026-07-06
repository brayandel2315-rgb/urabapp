import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomerCrmList,
  getBusinessCrmList,
  getRiderCrmList,
  getAbandonedCarts,
  recoverAbandonedCartInApp,
  recoverAbandonedCartWhatsApp,
} from '../../../services/crm.service';
import { isWhatsAppApiEnabled } from '../../../services/whatsapp-api.service';
import Loader from '../../../components/ui/Loader';
import Button from '../../../components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '../../../utils/currency';
import { toast } from '../../../utils/toast';
import { openWhatsApp } from '../../../utils/whatsapp';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import PanelTabBar from '@/design-system/patterns/PanelTabBar';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { STORE } from '@/utils/marketplace-copy';

const SEGMENTS = [
  { id: null, label: 'Todos' },
  { id: 'loyal', label: 'Leales' },
  { id: 'active', label: 'Activos' },
  { id: 'new', label: 'Nuevos' },
  { id: 'at_risk', label: 'En riesgo' },
  { id: 'lead', label: 'Sin pedido' },
];

const SEGMENT_COLORS = {
  loyal: 'bg-primary-light text-primary-dark',
  active: 'bg-sky/20 text-secondary',
  new: 'bg-accent/25 text-secondary',
  at_risk: 'bg-red-100 text-red-700',
  lead: 'bg-border text-muted',
};

function SegmentPill({ segment }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${SEGMENT_COLORS[segment] || 'bg-border text-muted'}`}>
      {segment}
    </span>
  );
}

export default function AdminCrmPanel() {
  const [section, setSection] = useState('clientes');
  const [segment, setSegment] = useState(null);
  const queryClient = useQueryClient();

  const recoverMutation = useMutation({
    mutationFn: recoverAbandonedCartInApp,
    onSuccess: () => {
      toast('Notificación enviada al cliente');
      queryClient.invalidateQueries({ queryKey: ['crm-abandoned'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ['crm-customers', segment],
    queryFn: () => getCustomerCrmList({ segment }),
    enabled: section === 'clientes',
  });

  const { data: businesses = [], isLoading: loadingBusinesses } = useQuery({
    queryKey: ['crm-businesses'],
    queryFn: () => getBusinessCrmList(),
    enabled: section === 'comercios',
  });

  const { data: riders = [], isLoading: loadingRiders } = useQuery({
    queryKey: ['crm-riders'],
    queryFn: () => getRiderCrmList(),
    enabled: section === 'mensajeros',
  });

  const { data: abandoned = [], isLoading: loadingAbandoned } = useQuery({
    queryKey: ['crm-abandoned'],
    queryFn: () => getAbandonedCarts(),
    enabled: section === 'abandonados',
    refetchInterval: 60000,
  });

  const sections = [
    { id: 'clientes', label: 'Clientes' },
    { id: 'comercios', label: STORE.adminTab },
    { id: 'mensajeros', label: 'Mensajeros' },
    { id: 'abandonados', label: 'Carritos' },
  ];

  const recoverWaMutation = useMutation({
    mutationFn: recoverAbandonedCartWhatsApp,
    onSuccess: () => toast('WhatsApp API enviado al cliente'),
    onError: (err) => toast(err.message, 'error'),
  });

  const handleRecoverCart = (cart) => {
    const phone = cart.users?.phone;
    if (!phone) {
      toast('Sin teléfono registrado', 'error');
      return;
    }
    const msg = `Hola ${cart.users?.full_name || ''}, vimos que dejaste productos en ${cart.business_name || 'tu carrito'} por ${formatCOP(cart.subtotal)}. ¿Te ayudamos a completar tu pedido en Urabapp?`;
    openWhatsApp(msg, { phone: phone.replace(/\D/g, '') });
    toast('WhatsApp abierto para recuperación');
  };

  const handleRecoverWhatsApp = (cart) => {
    if (isWhatsAppApiEnabled() && cart.users?.phone) {
      recoverWaMutation.mutate(cart);
      return;
    }
    handleRecoverCart(cart);
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        tag="CRM operativo"
        title="Centro de relaciones"
        subtitle={`Clientes, ${STORE.manyLower}, mensajeros y recuperación de carritos.`}
      />

      <PanelTabBar tabs={sections} value={section} onChange={setSection} />

      {section === 'clientes' && (
        <>
          <div className="flex gap-2 overflow-x-auto">
            {SEGMENTS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSegment(s.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  segment === s.id ? 'bg-primary text-white' : 'bg-surface border border-border text-muted'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {loadingCustomers ? <Loader /> : customers.length === 0 ? (
            <p className="text-center text-sm text-muted">Sin clientes en este segmento.</p>
          ) : (
            <div className="space-y-2">
              {customers.map((c) => (
                <SurfaceCard key={c.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-secondary">{c.full_name}</p>
                      <p className="text-xs text-muted">{c.email || c.phone || '—'} · {c.municipio}</p>
                    </div>
                    <SegmentPill segment={c.segment} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-background p-2">
                      <p className="font-black text-primary">{c.order_count}</p>
                      <p className="text-muted">Pedidos</p>
                    </div>
                    <div className="rounded-xl bg-background p-2">
                      <p className="font-black text-secondary">{formatCOP(c.ltv)}</p>
                      <p className="text-muted">LTV</p>
                    </div>
                    <div className="rounded-xl bg-background p-2">
                      <p className="font-black text-secondary">
                        {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('es-CO') : '—'}
                      </p>
                      <p className="text-muted">Última compra</p>
                    </div>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </>
      )}

      {section === 'comercios' && (
        loadingBusinesses ? <Loader /> : (
          <div className="space-y-2">
            {businesses.map((b) => (
              <SurfaceCard key={b.id}>
                <div className="flex justify-between">
                  <p className="flex items-center gap-2 font-bold text-secondary">
                    <AppIcon name={b.emoji || 'store'} size="xs" />
                    {b.name}
                  </p>
                  <span className={`text-xs font-bold ${b.is_open ? 'text-primary' : 'text-muted'}`}>
                    {b.is_open ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {b.municipio} · {b.zone || '—'} · <AppIcon name="star" size="xs" className="inline" /> {Number(b.rating).toFixed(1)}
                </p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                  <div><p className="font-black">{b.orders_total}</p><p className="text-muted">Pedidos</p></div>
                  <div><p className="font-black">{formatCOP(b.gmv)}</p><p className="text-muted">GMV</p></div>
                  <div><p className="font-black">{b.orders_cancelled}</p><p className="text-muted">Cancel.</p></div>
                  <div><p className="font-black">{b.avg_accept_min ? `${Math.round(b.avg_accept_min)}m` : '—'}</p><p className="text-muted">Acept.</p></div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        )
      )}

      {section === 'mensajeros' && (
        loadingRiders ? <Loader /> : (
          <div className="space-y-2">
            {riders.map((r) => (
              <SurfaceCard key={r.id} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-secondary">{r.name}</p>
                  <p className="text-xs text-muted">
                    {r.municipio} · {r.is_online ? (
                      <span className="font-semibold text-primary">En línea</span>
                    ) : (
                      <span>Offline</span>
                    )} · <AppIcon name="star" size="xs" className="inline" /> {Number(r.rating).toFixed(1)}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-black text-primary">{r.deliveries_count} entregas</p>
                  <p className="text-muted">{formatCOP(r.earnings_month)} este mes</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        )
      )}

      {section === 'abandonados' && (
        loadingAbandoned ? <Loader /> : abandoned.length === 0 ? (
          <SurfaceCard className="text-center text-sm text-muted">Sin carritos abandonados activos.</SurfaceCard>
        ) : (
          <div className="space-y-2">
            {abandoned.map((cart) => (
              <SurfaceCard key={cart.id}>
                <p className="font-bold text-secondary">{cart.users?.full_name || 'Usuario'}</p>
                <p className="text-sm text-muted">
                  {cart.business_name} · {formatCOP(cart.subtotal)} · {(cart.items_json || []).length} items
                </p>
                <p className="text-xs text-muted">
                  Actualizado {new Date(cart.updated_at).toLocaleString('es-CO')}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    disabled={recoverMutation.isPending}
                    onClick={() => recoverMutation.mutate(cart)}
                  >
                    Notificar en app
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={recoverWaMutation.isPending}
                    onClick={() => handleRecoverWhatsApp(cart)}
                  >
                    {isWhatsAppApiEnabled() ? 'WhatsApp API' : 'WhatsApp'}
                  </Button>
                </div>
              </SurfaceCard>
            ))}
          </div>
        )
      )}
    </div>
  );
}
