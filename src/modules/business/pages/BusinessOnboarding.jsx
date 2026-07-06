import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/ui/Loader';
import IconPicker from '../../../components/ui/IconPicker';
import AppIcon from '@/design-system/icons/AppIcon';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { getProfile } from '../../../services/auth.service';
import { createBusiness, createProduct, updateBusiness, updateProduct as saveProduct, getMyBusinesses } from '../../../services/business.service';
import {
  uploadBusinessLogo,
  uploadBusinessCover,
  uploadBusinessVerificationDoc,
  uploadProductImage,
} from '../../../services/storage.service';
import { getLegalDocument, recordConsent } from '../../../services/legal.service';
import { emitCommEvent } from '@/communication';
import { useAuthStore } from '../../../store/authStore';
import { MUNICIPALITIES, ECONOMICS, EXPRESS_PRODUCT_TEMPLATES, getOnboardingCategories } from '../../../utils/constants';
import { toast } from '../../../utils/toast';
import { mapApiError } from '../../../utils/errors';
import { isValidColombianPhone, isValidColombianDocument, isValidAddress, sanitizeText } from '../../../utils/validate';
import {
  BUSINESS_MEDIA_SPECS,
  LEGAL_ENTITY_TYPES,
  ONBOARDING_STEPS,
  getRequiredLegalDocuments,
  validateBusinessTaxId,
} from '../../../utils/business-registration';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import FormSelect from '@/design-system/patterns/FormSelect';
import UrabaBarrioPicker from '../../../components/uraba/UrabaBarrioPicker';
import JoinAuthPanel from '../../../components/auth/JoinAuthPanel';
import BusinessOnboardingStepper from '../components/BusinessOnboardingStepper';
import { STORE } from '@/utils/marketplace-copy';
import BusinessMediaGuide from '../components/BusinessMediaGuide';
import BusinessPendingFileUpload, { BusinessPendingDocUpload } from '../components/BusinessPendingFileUpload';
import BusinessLegalConsentPanel, { allMerchantConsentsAccepted } from '../components/BusinessLegalConsentPanel';

const BUSINESS_CATEGORIES = getOnboardingCategories();
const TOTAL_MINUTES = ONBOARDING_STEPS.reduce((s, x) => s + x.minutes, 0);

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setProfile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    merchant: false,
    truthful: false,
  });

  const [form, setForm] = useState({
    name: '',
    category: 'comida',
    description: '',
    emoji: 'store',
    phone: '',
    municipio: 'Apartadó',
    zone: '',
    address: '',
    legal_entity_type: 'natural',
    nit: '',
    legal_representative_name: '',
    representative_document_number: '',
    intermunicipal_enabled: false,
    municipios_soportados: [],
    prep_time_minutes: 25,
    daily_capacity: 100,
    delivery_radius_km: 8,
  });

  const [media, setMedia] = useState({ logo: null, cover: null });
  const [legalFiles, setLegalFiles] = useState({});
  const [products, setProducts] = useState([
    { name: '', price: '', emoji: 'package', imageFile: null },
  ]);

  const { data: existingBusinesses = [], isLoading: checkingBusiness } = useQuery({
    queryKey: ['my-businesses', user?.id],
    queryFn: () => getMyBusinesses(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (existingBusinesses.length > 0) {
      navigate('/negocio', { replace: true });
    }
  }, [existingBusinesses.length, navigate]);

  const requiredDocs = getRequiredLegalDocuments({
    legalEntityType: form.legal_entity_type,
    categoryId: form.category,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const safeForm = {
        ...form,
        name: sanitizeText(form.name, 120),
        description: sanitizeText(form.description, 500),
        phone: form.phone.trim(),
        zone: sanitizeText(form.zone, 80),
        address: sanitizeText(form.address, 200),
        legal_representative_name: sanitizeText(form.legal_representative_name, 120),
      };
      const business = await createBusiness(user.id, safeForm);

      let logoUrl = null;
      let coverUrl = null;
      if (media.logo) logoUrl = await uploadBusinessLogo(business.id, media.logo);
      if (media.cover) coverUrl = await uploadBusinessCover(business.id, media.cover);

      const verificationDocuments = {};
      for (const doc of requiredDocs) {
        const file = legalFiles[doc.key];
        if (file) {
          verificationDocuments[doc.key] = await uploadBusinessVerificationDoc(business.id, doc.key, file);
        }
      }

      const updatedBusiness = await updateBusiness(business.id, {
        logo_url: logoUrl,
        cover_url: coverUrl,
        nit: form.nit.trim(),
        legal_entity_type: form.legal_entity_type,
        legal_representative_name: form.legal_representative_name.trim(),
        representative_document_number: form.representative_document_number.trim(),
        verification_documents: verificationDocuments,
        verification_submitted_at: new Date().toISOString(),
        registration_consent_at: new Date().toISOString(),
      });

      for (const consent of ['terms', 'privacy', 'merchant']) {
        if (!consents[consent]) continue;
        const slugMap = { terms: 'terminos', privacy: 'privacidad', merchant: 'comercio' };
        try {
          const doc = await getLegalDocument(slugMap[consent]);
          if (doc?.id) await recordConsent(user.id, doc.id, doc.version);
        } catch {
          /* consent opcional si doc no existe aún */
        }
      }

      for (const p of products.filter((x) => x.name && x.price)) {
        const product = await createProduct(business.id, {
          name: sanitizeText(p.name, 120),
          price: Number(p.price),
          emoji: p.emoji || 'package',
        });
        if (p.imageFile) {
          const imageUrl = await uploadProductImage(business.id, product.id, p.imageFile);
          await saveProduct(product.id, { image_url: imageUrl });
        }
      }

      return updatedBusiness || business;
    },
    onSuccess: async (business) => {
      try {
        queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
        const profile = await getProfile(user.id);
        if (profile) setProfile(profile);
        emitCommEvent('business_registered', {
          recipientId: user?.id,
          actorId: user?.id,
          payload: {
            businessId: business?.id,
            category: form.category,
            municipio: form.municipio,
            legal_entity_type: form.legal_entity_type,
          },
        }).catch(() => {});
        toast('Solicitud enviada. Revisaremos tus documentos en aprox. 48 h.');
        navigate('/negocio', { state: { newBusiness: business, pendingReview: true } });
      } catch (err) {
        toast(mapApiError(err), 'error');
      }
    },
    onError: (err) => toast(mapApiError(err), 'error'),
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateProduct = (index, key, value) => {
    setProducts((list) => list.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  };

  const addProductRow = () => setProducts((list) => [...list, { name: '', price: '', emoji: 'package', imageFile: null }]);

  const applyTemplate = () => {
    const template = EXPRESS_PRODUCT_TEMPLATES[form.category] || EXPRESS_PRODUCT_TEMPLATES.default;
    setProducts(template.map((p) => ({ name: p.name, price: String(p.price), emoji: p.icon || 'package', imageFile: null })));
    toast('Plantilla aplicada — edita precios y fotos');
  };

  const setConsent = (id, value) => setConsents((c) => ({ ...c, [id]: value }));

  const validateStep1 = () => {
    if (!form.name.trim()) {
      toast('Ingresa el nombre de la tienda', 'error');
      return false;
    }
    if (form.phone && !isValidColombianPhone(form.phone)) {
      toast('Teléfono inválido. Usa 10 dígitos (3xx xxx xxxx)', 'error');
      return false;
    }
    if (!isValidAddress(form.address)) {
      toast('Ingresa la dirección completa del local (mín. 8 caracteres)', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!media.logo) {
      toast('Sube el logo de tu tienda (obligatorio)', 'error');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const taxErr = validateBusinessTaxId({ legalEntityType: form.legal_entity_type, taxId: form.nit });
    if (taxErr) {
      toast(taxErr, 'error');
      return false;
    }
    if (!form.legal_representative_name.trim()) {
      toast('Ingresa el nombre del titular o representante legal', 'error');
      return false;
    }
    if (!isValidColombianDocument(form.representative_document_number)) {
      toast('Cédula del representante inválida', 'error');
      return false;
    }
    for (const doc of requiredDocs.filter((d) => d.required)) {
      if (!legalFiles[doc.key]) {
        toast(`Falta: ${doc.label}`, 'error');
        return false;
      }
    }
    if (!allMerchantConsentsAccepted(consents)) {
      toast('Debes aceptar todas las declaraciones legales', 'error');
      return false;
    }
    return true;
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <PanelHeader
          tag="Registro de tienda"
          title="Abre tu tienda en Urabapp"
          subtitle="Cuenta + datos legales colombianos + imágenes estandarizadas"
        />
        <JoinAuthPanel
          title="Primero, tu cuenta de tienda"
          subtitle="Email y contraseña para gestionar pedidos y catálogo."
        />
      </div>
    );
  }

  if (checkingBusiness) {
    return <div className="flex justify-center py-20"><Loader size="lg" /></div>;
  }

  if (existingBusinesses.length > 0) {
    return (
      <SurfaceCard className="space-y-4 p-6 text-center">
        <p className="font-semibold text-foreground">Ya tienes una tienda registrada</p>
        <p className="text-sm text-muted">Te llevamos al panel para gestionar pedidos y catálogo.</p>
        <Button className="w-full" onClick={() => navigate('/negocio', { replace: true })}>
          Ir al panel de tienda
        </Button>
      </SurfaceCard>
    );
  }

  const currentStepMeta = ONBOARDING_STEPS.find((s) => s.id === step);

  return (
    <div className="space-y-6">
      <PanelHeader
        tag="Registro de tienda · Colombia"
        title="Registra tu emprendimiento"
        subtitle={`Paso ${step} de ${ONBOARDING_STEPS.length} · ~${currentStepMeta?.minutes || 3} min · total ~${TOTAL_MINUTES} min`}
      >
        <div className="mt-4 space-y-3">
          <BusinessOnboardingStepper step={step} />
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(step / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </PanelHeader>

      {step === 1 && (
        <SurfaceCard className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Datos básicos de tu tienda en el Urabá. La dirección debe coincidir con la del RUT o Cámara de Comercio.
          </p>
          <Input label="Nombre comercial *" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ej. Corrientes Doña María" required />
          <FormSelect
            label="Categoría *"
            value={form.category}
            onChange={(e) => {
              const cat = e.target.value;
              update('category', cat);
              update('emoji', iconForCategory(cat));
            }}
          >
            {BUSINESS_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </FormSelect>
          <IconPicker value={form.emoji} onChange={(v) => update('emoji', v)} label="Icono (si aún no tienes logo)" />
          <Input label="Descripción corta" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Qué vendes y qué te hace especial" />
          <Input
            label="Teléfono WhatsApp / contacto *"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="3001234567"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormSelect label="Municipio *" value={form.municipio} onChange={(e) => update('municipio', e.target.value)}>
              {MUNICIPALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
            </FormSelect>
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Barrio del local</p>
              <UrabaBarrioPicker
                municipio={form.municipio}
                value={form.zone}
                onChange={(b) => update('zone', b)}
                variant="default"
                className="w-full max-w-none"
                showAllOption={false}
                label="Elegir barrio"
              />
            </div>
          </div>
          <Input label="Dirección del local *" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Calle, número, referencia" />

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left text-sm font-semibold text-foreground"
          >
            Opciones avanzadas de entrega
            <AppIcon name="chevronDown" size="sm" className={showAdvanced ? 'rotate-180' : ''} />
          </button>
          {showAdvanced && (
            <SurfaceCard className="space-y-3 border-primary/20 bg-primary/5">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.intermunicipal_enabled}
                  onChange={(e) => update('intermunicipal_enabled', e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span><strong>Envíos intermunicipales</strong><span className="mt-0.5 block text-xs text-muted-foreground">Aparecer en otros municipios de la red.</span></span>
              </label>
              {form.intermunicipal_enabled && (
                <div className="flex flex-wrap gap-2">
                  {MUNICIPALITIES.filter((m) => m !== form.municipio).map((m) => {
                    const on = form.municipios_soportados.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          const next = on ? form.municipios_soportados.filter((x) => x !== m) : [...form.municipios_soportados, m];
                          update('municipios_soportados', next);
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-bold ${on ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              )}
            </SurfaceCard>
          )}

          <p className="text-xs text-muted-foreground">
            Comisión Urabapp {ECONOMICS.commissionPct}% · Domicilio sugerido ${ECONOMICS.defaultDeliveryFee.toLocaleString('es-CO')}
          </p>
          <Button className="w-full" onClick={() => validateStep1() && setStep(2)}>
            Siguiente: imágenes de tu tienda
          </Button>
        </SurfaceCard>
      )}

      {step === 2 && (
        <SurfaceCard className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Imágenes estandarizadas para que tu tienda se vea profesional en listados, búsqueda y página de tienda.
          </p>
          <BusinessMediaGuide spec={BUSINESS_MEDIA_SPECS.logo} />
          <BusinessPendingFileUpload
            label={BUSINESS_MEDIA_SPECS.logo.label}
            hint={BUSINESS_MEDIA_SPECS.logo.hint}
            accept={BUSINESS_MEDIA_SPECS.logo.accept}
            maxMb={BUSINESS_MEDIA_SPECS.logo.maxMb}
            aspect="square"
            required
            value={media.logo}
            onChange={(file) => setMedia((m) => ({ ...m, logo: file }))}
          />
          <BusinessMediaGuide spec={BUSINESS_MEDIA_SPECS.cover} />
          <BusinessPendingFileUpload
            label={BUSINESS_MEDIA_SPECS.cover.label}
            hint={BUSINESS_MEDIA_SPECS.cover.hint}
            accept={BUSINESS_MEDIA_SPECS.cover.accept}
            maxMb={BUSINESS_MEDIA_SPECS.cover.maxMb}
            aspect="banner"
            value={media.cover}
            onChange={(file) => setMedia((m) => ({ ...m, cover: file }))}
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Atrás</Button>
            <Button className="flex-1" onClick={() => validateStep2() && setStep(3)}>Siguiente: legal Colombia</Button>
          </div>
        </SurfaceCard>
      )}

      {step === 3 && (
        <SurfaceCard className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Según la normativa colombiana, validamos tu identidad tributaria antes de publicar en el catálogo.
          </p>

          <FormSelect
            label="Tipo de comerciante *"
            value={form.legal_entity_type}
            onChange={(e) => {
              update('legal_entity_type', e.target.value);
              setLegalFiles({});
            }}
          >
            {Object.values(LEGAL_ENTITY_TYPES).map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </FormSelect>
          <p className="-mt-2 text-xs text-muted-foreground">
            {LEGAL_ENTITY_TYPES[form.legal_entity_type]?.hint}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={form.legal_entity_type === 'juridica' ? 'NIT de la empresa *' : 'NIT o cédula (RUT) *'}
              value={form.nit}
              onChange={(e) => update('nit', e.target.value)}
              placeholder={form.legal_entity_type === 'juridica' ? '900.123.456-7' : '1234567890'}
            />
            <Input
              label="Titular / representante legal *"
              value={form.legal_representative_name}
              onChange={(e) => update('legal_representative_name', e.target.value)}
              placeholder="Nombre completo"
            />
          </div>
          <Input
            label="Cédula del titular *"
            value={form.representative_document_number}
            onChange={(e) => update('representative_document_number', e.target.value)}
            placeholder="Solo números, sin puntos"
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Documentos requeridos</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {requiredDocs.map((doc) => (
                <BusinessPendingDocUpload
                  key={doc.key}
                  label={doc.label}
                  description={doc.description}
                  hint={doc.hint}
                  accept={doc.accept}
                  maxMb={8}
                  required={doc.required}
                  value={legalFiles[doc.key]}
                  onChange={(file) => setLegalFiles((f) => ({ ...f, [doc.key]: file }))}
                />
              ))}
            </div>
          </div>

          <BusinessLegalConsentPanel consents={consents} onChange={setConsent} />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Atrás</Button>
            <Button className="flex-1" onClick={() => validateStep3() && setStep(4)}>Siguiente: catálogo</Button>
          </div>
        </SurfaceCard>
      )}

      {step === 4 && (
        <SurfaceCard className="space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">Catálogo inicial</h2>
          <p className="text-sm text-muted-foreground">
            Agrega al menos un producto. Las fotos cuadradas (600×600 px mín.) mantienen tu menú uniforme en la app.
          </p>
          <Button variant="outline" size="sm" className="inline-flex items-center gap-2" onClick={applyTemplate}>
            <AppIcon name="bolt" size="xs" /> Usar plantilla rápida
          </Button>
          {products.map((p, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input label="Producto" value={p.name} onChange={(e) => updateProduct(i, 'name', e.target.value)} />
                <Input label="Precio (COP)" type="number" value={p.price} onChange={(e) => updateProduct(i, 'price', e.target.value)} />
              </div>
              <IconPicker value={p.emoji} onChange={(v) => updateProduct(i, 'emoji', v)} label="Icono (si no hay foto)" />
              <BusinessPendingFileUpload
                label="Foto del producto (opcional)"
                hint={BUSINESS_MEDIA_SPECS.product.hint}
                accept={BUSINESS_MEDIA_SPECS.product.accept}
                maxMb={BUSINESS_MEDIA_SPECS.product.maxMb}
                aspect="square"
                value={p.imageFile}
                onChange={(file) => updateProduct(i, 'imageFile', file)}
              />
            </div>
          ))}
          <Button variant="outline" onClick={addProductRow}>+ Otro producto</Button>
          <SurfaceCard className="border-dashed border-primary/30 bg-primary/[0.02] p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Después del registro</p>
            <p className="mt-1">
              Urabapp revisará tus documentos en ~48 h. Mientras tanto puedes editar tu tienda en{' '}
              <Link to="/negocio" className="font-semibold text-primary">{STORE.panel}</Link>.
            </p>
          </SurfaceCard>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>Atrás</Button>
            <Button
              className="flex-1"
              disabled={mutation.isPending || !products.some((p) => p.name && p.price)}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? 'Enviando solicitud…' : 'Enviar solicitud de registro'}
            </Button>
          </div>
        </SurfaceCard>
      )}
    </div>
  );
}
