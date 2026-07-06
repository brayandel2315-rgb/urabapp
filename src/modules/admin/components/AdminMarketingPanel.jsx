import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ImageUpload from '../../../components/ui/ImageUpload';
import Loader from '../../../components/ui/Loader';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  getAllCouponsAdmin,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../../../services/marketing.service';
import { uploadBannerImage } from '../../../services/storage.service';
import { BUSINESS_COVER_BY_SLUG } from '../../../utils/business-covers';
import { MUNICIPALITIES } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import { toast } from '../../../utils/toast';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import PanelTabBar from '@/design-system/patterns/PanelTabBar';
import FormSelect from '@/design-system/patterns/FormSelect';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

const EMPTY_BANNER = {
  title: '',
  subtitle: '',
  link: '',
  municipio: '',
  sort_order: 0,
  is_active: true,
  image_url: '',
};

const EMPTY_COUPON = {
  code: '',
  description: '',
  discount_type: 'fixed',
  discount_value: '',
  min_order: '',
  is_active: true,
  expires_at: '',
};

export default function AdminMarketingPanel() {
  const queryClient = useQueryClient();
  const [section, setSection] = useState('banners');
  const [bannerForm, setBannerForm] = useState(EMPTY_BANNER);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const { data: banners = [], isLoading: loadingBanners } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: getAllBannersAdmin,
    enabled: section === 'banners',
  });

  const { data: coupons = [], isLoading: loadingCoupons } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: getAllCouponsAdmin,
    enabled: section === 'cupones',
  });

  const invalidateBanners = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    queryClient.invalidateQueries({ queryKey: ['banners'] });
    queryClient.invalidateQueries({ queryKey: ['marketplace-pulse'] });
  };

  const invalidateCoupons = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
    queryClient.invalidateQueries({ queryKey: ['marketplace-pulse'] });
  };

  const saveBannerMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...bannerForm,
        municipio: bannerForm.municipio || null,
        sort_order: Number(bannerForm.sort_order) || 0,
      };
      if (editingBannerId) return updateBanner(editingBannerId, payload);
      return createBanner(payload);
    },
    onSuccess: () => {
      invalidateBanners();
      setBannerForm(EMPTY_BANNER);
      setEditingBannerId(null);
      toast(editingBannerId ? 'Banner actualizado' : 'Banner creado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      invalidateBanners();
      toast('Banner eliminado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const saveCouponMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...couponForm,
        discount_value: Number(couponForm.discount_value),
        min_order: Number(couponForm.min_order) || 0,
        expires_at: couponForm.expires_at || null,
      };
      if (editingCouponId) return updateCoupon(editingCouponId, payload);
      return createCoupon(payload);
    },
    onSuccess: () => {
      invalidateCoupons();
      setCouponForm(EMPTY_COUPON);
      setEditingCouponId(null);
      toast(editingCouponId ? 'Cupón actualizado' : 'Cupón creado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteCouponMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      invalidateCoupons();
      toast('Cupón eliminado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const applyCatalogBannerImage = () => {
    const slug = bannerForm.link?.replace(/^\/tienda\//, '').trim();
    const url = slug && BUSINESS_COVER_BY_SLUG[slug];
    if (!url) {
      toast('Usa un link tipo /tienda/slug de un comercio destacado', 'error');
      return;
    }
    setBannerForm((f) => ({ ...f, image_url: url }));
    toast('Imagen del catálogo aplicada');
  };

  const handleBannerImage = async (file) => {
    const url = await uploadBannerImage(file);
    setBannerForm((f) => ({ ...f, image_url: url }));
    toast('Imagen subida');
    return url;
  };

  const startEditBanner = (b) => {
    setEditingBannerId(b.id);
    setBannerForm({
      title: b.title,
      subtitle: b.subtitle || '',
      link: b.link || '',
      municipio: b.municipio || '',
      sort_order: b.sort_order ?? 0,
      is_active: b.is_active !== false,
      image_url: b.image_url || '',
    });
  };

  const startEditCoupon = (c) => {
    setEditingCouponId(c.id);
    setCouponForm({
      code: c.code,
      description: c.description || '',
      discount_type: c.discount_type || 'fixed',
      discount_value: String(c.discount_value),
      min_order: String(c.min_order || ''),
      is_active: c.is_active !== false,
      expires_at: c.expires_at ? c.expires_at.slice(0, 16) : '',
    });
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        tag="Marketing"
        title="Banners y cupones"
        subtitle="Gestiona ofertas visibles en /search y checkout."
      />

      <PanelTabBar
        tabs={[{ id: 'banners', label: 'Banners' }, { id: 'cupones', label: 'Cupones' }]}
        value={section}
        onChange={setSection}
      />

      {section === 'banners' && (
        <>
          <SurfaceCard className="space-y-3">
            <SectionTitle>{editingBannerId ? 'Editar banner' : 'Nuevo banner'}</SectionTitle>
            <ImageUpload
              label="Imagen del banner"
              currentUrl={bannerForm.image_url}
              onUpload={handleBannerImage}
              aspect="banner"
            />
            <p className="text-xs text-muted-foreground">
              Sube foto real del plato, local o producto (JPG/WebP, máx. 5 MB). Recomendado: 1280×680 px, comida bien iluminada.
            </p>
            {bannerForm.link?.startsWith('/tienda/') && (
              <Button type="button" variant="outline" size="sm" onClick={applyCatalogBannerImage}>
                Usar imagen del catálogo
              </Button>
            )}
            <Input label="Título" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} />
            <Input label="Subtítulo" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} />
            <Input
              label="Link (ruta o URL)"
              value={bannerForm.link}
              onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
              placeholder="/search?category=comida o /tienda/slug"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelect
                label="Municipio"
                value={bannerForm.municipio}
                onChange={(e) => setBannerForm({ ...bannerForm, municipio: e.target.value })}
              >
                <option value="">Todos</option>
                {MUNICIPALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
              </FormSelect>
              <Input
                label="Orden"
                type="number"
                value={bannerForm.sort_order}
                onChange={(e) => setBannerForm({ ...bannerForm, sort_order: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={bannerForm.is_active}
                onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
              />
              Activo
            </label>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={!bannerForm.title || saveBannerMutation.isPending}
                onClick={() => saveBannerMutation.mutate()}
              >
                {saveBannerMutation.isPending ? 'Guardando...' : editingBannerId ? 'Actualizar' : 'Crear banner'}
              </Button>
              {editingBannerId && (
                <Button variant="outline" onClick={() => { setEditingBannerId(null); setBannerForm(EMPTY_BANNER); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </SurfaceCard>

          {loadingBanners ? <Loader /> : (
            <div className="space-y-2">
              {banners.map((b) => (
                <SurfaceCard key={b.id}>
                  <div className="flex gap-3">
                    {b.image_url ? (
                      <img src={b.image_url} alt="" className="h-16 w-24 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-primary-light">
                        <AppIcon name="target" size="md" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-secondary">{b.title}</p>
                      <p className="text-sm text-muted">{b.subtitle}</p>
                      <p className="text-xs text-muted">{b.link || 'Sin link'} · {b.is_active ? 'Activo' : 'Inactivo'}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEditBanner(b)}>Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteBannerMutation.mutate(b.id)}>Eliminar</Button>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </>
      )}

      {section === 'cupones' && (
        <>
          <SurfaceCard className="space-y-3">
            <SectionTitle>{editingCouponId ? 'Editar cupón' : 'Nuevo cupón'}</SectionTitle>
            <Input label="Código" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} />
            <Input label="Descripción" value={couponForm.description} onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelect
                label="Tipo"
                value={couponForm.discount_type}
                onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
              >
                <option value="fixed">Monto fijo ($)</option>
                <option value="percent">Porcentaje (%)</option>
              </FormSelect>
              <Input
                label="Valor"
                type="number"
                value={couponForm.discount_value}
                onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
              />
            </div>
            <Input
              label="Pedido mínimo ($)"
              type="number"
              value={couponForm.min_order}
              onChange={(e) => setCouponForm({ ...couponForm, min_order: e.target.value })}
            />
            <Input
              label="Expira (opcional)"
              type="datetime-local"
              value={couponForm.expires_at}
              onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={couponForm.is_active}
                onChange={(e) => setCouponForm({ ...couponForm, is_active: e.target.checked })}
              />
              Activo
            </label>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={!couponForm.code || !couponForm.discount_value || saveCouponMutation.isPending}
                onClick={() => saveCouponMutation.mutate()}
              >
                {saveCouponMutation.isPending ? 'Guardando...' : editingCouponId ? 'Actualizar' : 'Crear cupón'}
              </Button>
              {editingCouponId && (
                <Button variant="outline" onClick={() => { setEditingCouponId(null); setCouponForm(EMPTY_COUPON); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </SurfaceCard>

          {loadingCoupons ? <Loader /> : (
            <div className="space-y-2">
              {coupons.map((c) => (
                <SurfaceCard key={c.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono font-bold text-secondary">{c.code}</p>
                    <p className="text-sm text-muted">{c.description}</p>
                    <p className="text-xs text-primary">
                      {c.discount_type === 'percent' ? `${c.discount_value}%` : formatCOP(c.discount_value)}
                      {c.min_order ? ` · mín ${formatCOP(c.min_order)}` : ''}
                      {c.is_active ? '' : ' · Inactivo'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEditCoupon(c)}>Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteCouponMutation.mutate(c.id)}>Eliminar</Button>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
