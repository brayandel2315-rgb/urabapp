import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ImageUpload from '../../../components/ui/ImageUpload';
import { updateBusiness } from '../../../services/business.service';
import { uploadBusinessLogo, uploadBusinessCover } from '../../../services/storage.service';
import { resolveBusinessCover } from '../../../utils/catalog-images';
import { formatCOP } from '../../../utils/currency';
import { formatBusinessHours } from '../../../utils/schedule';
import { MUNICIPALITIES } from '../../../utils/constants';
import { toast } from '../../../utils/toast';
import { copyToClipboard } from '../../../utils/app';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { BUSINESS_MEDIA_SPECS } from '@/utils/business-registration';
import BusinessVerificationSection from './BusinessVerificationSection';
import BusinessFinancesPanel from './BusinessFinancesPanel';
import { generateStoreDescription } from '@/services/ai.service';
import AppIcon from '@/design-system/icons/AppIcon';

function buildFormState(business) {
  return {
    phone: business.phone || '',
    description: business.description || '',
    delivery_fee: business.delivery_fee ?? 3000,
    min_order: business.min_order ?? 0,
    opens_at: String(business.opens_at || '08:00').slice(0, 5),
    closes_at: String(business.closes_at || '22:00').slice(0, 5),
    prep_time_minutes: business.prep_time_minutes ?? business.delivery_time ?? 25,
    delivery_radius_km: business.delivery_radius_km ?? 8,
    intermunicipal_enabled: !!business.intermunicipal_enabled,
    municipios_soportados: Array.isArray(business.municipios_soportados) ? business.municipios_soportados : [],
  };
}

export default function BusinessStoreSettings({ business, storeLink }) {
  const queryClient = useQueryClient();
  const [aiLoading, setAiLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(business.logo_url || '');
  const [coverUrl, setCoverUrl] = useState(business.cover_url || '');
  const [form, setForm] = useState(() => buildFormState(business));

  useEffect(() => {
    setForm(buildFormState(business));
    setLogoUrl(business.logo_url || '');
    setCoverUrl(business.cover_url || '');
  }, [business.id]);

  const saveMutation = useMutation({
    mutationFn: () => updateBusiness(business.id, {
      phone: form.phone.trim(),
      description: form.description.trim(),
      delivery_fee: Number(form.delivery_fee),
      min_order: Number(form.min_order),
      opens_at: form.opens_at,
      closes_at: form.closes_at,
      logo_url: logoUrl || business.logo_url,
      cover_url: coverUrl || business.cover_url,
      prep_time_minutes: Number(form.prep_time_minutes) || 25,
      delivery_time: Number(form.prep_time_minutes) || 25,
      delivery_radius_km: Number(form.delivery_radius_km) || 8,
      intermunicipal_enabled: form.intermunicipal_enabled,
      municipios_soportados: form.intermunicipal_enabled ? form.municipios_soportados : [],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['business'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast('Cambios guardados');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const handleLogoUpload = async (file) => {
    const url = await uploadBusinessLogo(business.id, file);
    setLogoUrl(url);
    await updateBusiness(business.id, { logo_url: url });
    queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
    toast('Logo actualizado');
    return url;
  };

  const handleCoverUpload = async (file) => {
    const url = await uploadBusinessCover(business.id, file);
    setCoverUrl(url);
    await updateBusiness(business.id, { cover_url: url });
    queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
    toast('Portada actualizada');
    return url;
  };

  const handleCopyLink = async () => {
    const copied = await copyToClipboard(storeLink);
    toast(copied ? 'Link copiado' : 'No se pudo copiar', copied ? 'info' : 'error');
  };

  const handleAiDescription = async () => {
    setAiLoading(true);
    try {
      const { text } = await generateStoreDescription({ business });
      setForm((f) => ({ ...f, description: text }));
      toast('Descripción sugerida');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <BusinessVerificationSection business={business} />

      <SurfaceCard className="space-y-4">
        <SectionTitle>Imagen de marca</SectionTitle>
        <p className="text-sm text-muted">Logo y portada visibles en tu tienda pública.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload
            label="Logo"
            currentUrl={logoUrl || business.logo_url}
            onUpload={handleLogoUpload}
            hint={BUSINESS_MEDIA_SPECS.logo.hint}
          />
          <ImageUpload
            label="Portada"
            currentUrl={coverUrl || resolveBusinessCover(business)}
            onUpload={handleCoverUpload}
            aspect="banner"
            hint={BUSINESS_MEDIA_SPECS.cover.hint}
          />
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <SectionTitle>Operación diaria</SectionTitle>
        <p className="text-sm text-muted">
          Horario: {formatBusinessHours(business)} · Domicilio {formatCOP(form.delivery_fee)}
        </p>

        <Input
          label="Teléfono de contacto"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="3001234567"
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-secondary">Descripción</span>
            <Button type="button" size="sm" variant="outline" disabled={aiLoading} onClick={handleAiDescription}>
              {aiLoading ? 'Generando…' : 'Sugerir'}
            </Button>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Abre" type="time" value={form.opens_at} onChange={(e) => setForm({ ...form, opens_at: e.target.value })} />
          <Input label="Cierra" type="time" value={form.closes_at} onChange={(e) => setForm({ ...form, closes_at: e.target.value })} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Domicilio ($)" type="number" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })} />
          <Input label="Pedido mínimo ($)" type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Preparación (min)"
            type="number"
            min={5}
            max={120}
            value={form.prep_time_minutes}
            onChange={(e) => setForm({ ...form, prep_time_minutes: e.target.value })}
          />
          <Input
            label="Radio entrega (km)"
            type="number"
            min={1}
            max={50}
            value={form.delivery_radius_km}
            onChange={(e) => setForm({ ...form, delivery_radius_km: e.target.value })}
          />
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
          <input
            type="checkbox"
            checked={form.intermunicipal_enabled}
            onChange={(e) => setForm({ ...form, intermunicipal_enabled: e.target.checked })}
            className="mt-1 accent-primary"
          />
          <span className="text-sm">
            <strong className="text-foreground">Envíos intermunicipales</strong>
            <span className="mt-0.5 block text-muted">Entregas a otros municipios del Urabá.</span>
          </span>
        </label>

        {form.intermunicipal_enabled && (
          <div className="flex flex-wrap gap-2">
            {MUNICIPALITIES.filter((m) => m !== business.municipio).map((m) => {
              const on = form.municipios_soportados.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    const next = on
                      ? form.municipios_soportados.filter((x) => x !== m)
                      : [...form.municipios_soportados, m];
                    setForm({ ...form, municipios_soportados: next });
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    on ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        )}

        <Button className="w-full" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
          {saveMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Link de tu tienda</SectionTitle>
        <p className="break-all rounded-xl bg-background px-3 py-2 font-mono text-xs text-muted">{storeLink}</p>
        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
          <AppIcon name="link" size="xs" className="mr-2" />
          Copiar link
        </Button>
      </SurfaceCard>

      <BusinessFinancesPanel business={business} />
    </div>
  );
}
