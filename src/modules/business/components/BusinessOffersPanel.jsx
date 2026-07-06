import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormSelect from '@/design-system/patterns/FormSelect';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { updateBusiness } from '@/services/business.service';
import { getBusinessPromoMetrics, upsertBusinessPromotion, deactivateBusinessPromotion } from '@/services/offers.service';
import { formatBusinessPromoText } from '@/utils/promo';
import { formatCOP } from '@/utils/currency';
import { toast } from '@/utils/toast';
import { PROMO_TYPES } from '@/data/offers-filters';
import { generatePromoCopy } from '@/services/ai.service';
import AppIcon from '@/design-system/icons/AppIcon';

const BADGES = [
  { value: '', label: 'Sin badge' },
  { value: 'TOP', label: 'Top' },
  { value: 'NUEVO', label: 'Nuevo' },
  { value: 'HOT', label: 'Hot' },
  { value: 'EXPIRA_HOY', label: 'Expira hoy' },
];

function buildOffersForm(business) {
  return {
    promo_is_active: !!business.promo_is_active,
    promo_discount_type: business.promo_discount_type || 'percent',
    promo_discount_value: business.promo_discount_value ?? '',
    promo_min_order: business.promo_min_order ?? 0,
    promo_title: business.promo_title || '',
    promo_subtitle: business.promo_subtitle || '',
    promo_badge: business.promo_badge || '',
    promo_is_flash: !!business.promo_is_flash,
    promo_is_featured: !!business.promo_is_featured,
    promo_ends_at: business.promo_ends_at
      ? new Date(business.promo_ends_at).toISOString().slice(0, 16)
      : '',
  };
}

export default function BusinessOffersPanel({ business }) {
  const queryClient = useQueryClient();
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState(() => buildOffersForm(business));

  useEffect(() => {
    setForm(buildOffersForm(business));
  }, [business.id]);

  const { data: metrics } = useQuery({
    queryKey: ['promo-metrics', business.id],
    queryFn: () => getBusinessPromoMetrics(business.id),
    refetchInterval: 60000,
  });

  const previewBusiness = {
    ...business,
    ...form,
    promo_discount_value: Number(form.promo_discount_value) || 0,
  };
  const previewText = formatBusinessPromoText(previewBusiness);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await updateBusiness(business.id, {
        promo_is_active: form.promo_is_active,
        promo_discount_type: form.promo_is_active ? form.promo_discount_type : null,
        promo_discount_value: form.promo_is_active ? Number(form.promo_discount_value) : null,
        promo_min_order: form.promo_is_active ? Number(form.promo_min_order) : 0,
        promo_title: form.promo_title || null,
        promo_subtitle: form.promo_subtitle || null,
        promo_badge: form.promo_badge || null,
        promo_is_flash: form.promo_is_flash,
        promo_is_featured: form.promo_is_featured,
        promo_ends_at: form.promo_ends_at ? new Date(form.promo_ends_at).toISOString() : null,
      });

      if (form.promo_is_active) {
        await upsertBusinessPromotion(business.id, {
          title: form.promo_title || previewText || business.name,
          subtitle: form.promo_subtitle || business.description?.slice(0, 80),
          promo_type: form.promo_is_flash ? 'flash' : form.promo_discount_type,
          discount_value: Number(form.promo_discount_value),
          min_order: Number(form.promo_min_order),
          is_flash: form.promo_is_flash,
          is_featured: form.promo_is_featured,
          ends_at: form.promo_ends_at ? new Date(form.promo_ends_at).toISOString() : null,
          badge: form.promo_badge || null,
          municipio: business.municipio,
          is_active: true,
        }).catch(() => null);
      } else {
        await deactivateBusinessPromotion(business.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['offers-feed'] });
      queryClient.invalidateQueries({ queryKey: ['home-discovery'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-pulse'] });
      toast(form.promo_is_active ? 'Oferta publicada en Urabapp' : 'Oferta desactivada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const handleAiPromo = async () => {
    setAiLoading(true);
    try {
      const { title, subtitle } = await generatePromoCopy({
        business,
        discountType: form.promo_discount_type,
        discountValue: form.promo_discount_value || 10,
      });
      setForm((f) => ({
        ...f,
        promo_title: title,
        promo_subtitle: subtitle,
        promo_is_active: true,
      }));
      toast('Texto de promo sugerido');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <MetricGrid>
        <MetricCard label="Impresiones (30d)" value={metrics?.impressions ?? 0} icon="chart" />
        <MetricCard label="Toques" value={metrics?.clicks ?? 0} icon="target" />
        <MetricCard label="Tasa de clics" value={`${metrics?.ctr ?? 0}%`} icon="trend" />
        <MetricCard label="Conversión" value={`${metrics?.conversion ?? 0}%`} icon="money" accent />
      </MetricGrid>

      <SurfaceCard className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <SectionTitle>Crear / editar oferta</SectionTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={aiLoading}
            onClick={handleAiPromo}
            className="inline-flex items-center gap-1"
          >
            <AppIcon name="bolt" size="xs" />
            {aiLoading ? '…' : 'Sugerir texto'}
          </Button>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.promo_is_active}
            onChange={(e) => setForm({ ...form, promo_is_active: e.target.checked })}
          />
          Activar promo en hub de ofertas
        </label>

        {form.promo_is_active && (
          <>
            <Input
              label="Título promo"
              value={form.promo_title}
              onChange={(e) => setForm({ ...form, promo_title: e.target.value })}
              placeholder="Ej. 50% OFF en almuerzos"
            />
            <Input
              label="Subtítulo"
              value={form.promo_subtitle}
              onChange={(e) => setForm({ ...form, promo_subtitle: e.target.value })}
              placeholder="Válido en pedidos seleccionados"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelect
                label="Tipo"
                value={form.promo_discount_type}
                onChange={(e) => setForm({ ...form, promo_discount_type: e.target.value })}
              >
                <option value="percent">Porcentaje</option>
                <option value="fixed">Monto fijo</option>
              </FormSelect>
              <FormSelect label="Badge" value={form.promo_badge} onChange={(e) => setForm({ ...form, promo_badge: e.target.value })}>
                {BADGES.map((b) => (
                  <option key={b.value || 'none'} value={b.value}>{b.label}</option>
                ))}
              </FormSelect>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Descuento"
                type="number"
                value={form.promo_discount_value}
                onChange={(e) => setForm({ ...form, promo_discount_value: e.target.value })}
              />
              <Input
                label="Pedido mínimo"
                type="number"
                value={form.promo_min_order}
                onChange={(e) => setForm({ ...form, promo_min_order: e.target.value })}
              />
            </div>
            <Input
              label="Programar fin (opcional)"
              type="datetime-local"
              value={form.promo_ends_at}
              onChange={(e) => setForm({ ...form, promo_ends_at: e.target.value })}
            />
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.promo_is_flash}
                  onChange={(e) => setForm({ ...form, promo_is_flash: e.target.checked })}
                />
                Oferta flash
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.promo_is_featured}
                  onChange={(e) => setForm({ ...form, promo_is_featured: e.target.checked })}
                />
                Destacada en hero
              </label>
            </div>
          </>
        )}

        {previewText && (
          <div className="rounded-xl bg-accent/20 p-3 text-sm">
            <p className="font-bold text-secondary">Vista previa</p>
            <p className="mt-1">{previewText}</p>
            {form.promo_min_order > 0 && (
              <p className="text-muted">Mínimo {formatCOP(Number(form.promo_min_order))}</p>
            )}
          </div>
        )}

        <Button className="w-full" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Guardando…' : (form.promo_is_active ? 'Publicar oferta' : 'Desactivar oferta')}
        </Button>
      </SurfaceCard>

      <SurfaceCard variant="muted" className="text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Tipos disponibles en Urabapp</p>
        <p className="mt-1">{Object.values(PROMO_TYPES).join(' · ')}</p>
        <p className="mt-2">Tu oferta aparece en /ofertas, inicio y checkout automático.</p>
      </SurfaceCard>
    </div>
  );
}
