import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import FormSelect from '@/design-system/patterns/FormSelect';
import { useAuthStore } from '@/store/authStore';
import ClientAuthGateCard from '@/components/client/ClientAuthGateCard';
import { isRealAuthenticatedUser } from '@/utils/auth-session';
import { quoteShipment, createShipment, getShipmentRoutes } from '@/services/shipment.service';
import { uploadShipmentPhoto } from '@/services/storage.service';
import { SHIPMENT_PACKAGE_TYPES, SHIPMENT_WEIGHT_TIERS } from '@/data/shipment-catalog';
import { isValidColombianPhone, isValidName, isValidAddress, sanitizeText } from '@/utils/validate';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { toast } from '@/utils/toast';
import { isWompiEnabled, startShipmentWompiCheckout } from '@/services/wompi.service';
import ServiceCommercialHero from '@/components/services/ServiceCommercialHero';
import ServiceJourneyShowcase from '@/components/services/ServiceJourneyShowcase';
import ServiceBookingStepper from '@/components/services/ServiceBookingStepper';
import ServiceCrossSell from '@/components/services/ServiceCrossSell';
import CustomerShipmentsPanel from '@/modules/client/components/CustomerShipmentsPanel';
import ShipmentRouteCards from '@/components/shipment/ShipmentRouteCards';
import ShipmentMunicipioPairPicker from '@/components/shipment/ShipmentMunicipioPairPicker';
import ShipmentQuoteCard from '@/components/shipment/ShipmentQuoteCard';
import ErrorState from '@/components/ErrorState';
import Loader from '@/components/ui/Loader';
import { buildLoginRedirect } from '@/utils/auth-routes';
import { mergeContactPrefill } from '@/utils/profile-form';
import { useLocationStore } from '@/store/locationStore';

const EMPTY_FORM = {
  senderName: '',
  senderPhone: '',
  senderWhatsapp: '',
  senderDocument: '',
  originMunicipio: '',
  destMunicipio: '',
  packageType: 'package',
  weightTier: '0-2',
  dimensions: '',
  declaredValue: '',
  packageNotes: '',
  pickupAddress: '',
  pickupReference: '',
  deliveryAddress: '',
  deliveryReference: '',
  photoFile: null,
};

function journeyStepForBooking(step) {
  if (step === 'quote') return 'pay';
  if (step === 'form') return 'package';
  return 'route';
}

export default function EnviosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { municipio } = useLocationStore();
  const { user, profile } = useAuthStore();
  const online = useOnlineStatus();

  const [step, setStep] = useState('home');
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    originMunicipio: location.state?.origin || municipio || '',
    destMunicipio: location.state?.dest || '',
  }));
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const { data: routes = [], isLoading: routesLoading, isError: routesError, refetch } = useQuery({
    queryKey: ['shipment-routes'],
    queryFn: getShipmentRoutes,
    staleTime: 120_000,
  });

  useEffect(() => {
    if (!user && !profile) return;
    setForm((f) => mergeContactPrefill(f, user, profile, { nameKey: 'senderName', phoneKey: 'senderPhone' }));
    if (profile?.phone || user?.phone) {
      const phone = profile?.phone || user?.phone?.replace(/^\+57/, '') || '';
      if (phone) {
        setForm((f) => ({
          ...f,
          senderWhatsapp: f.senderWhatsapp || phone,
        }));
      }
    }
  }, [user, profile]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRouteSelect = (route) => {
    setForm((f) => ({
      ...f,
      originMunicipio: route.origin_municipio,
      destMunicipio: route.dest_municipio,
    }));
    setStep('form');
  };

  const handleQuote = async () => {
    if (!form.originMunicipio || !form.destMunicipio) {
      toast('Selecciona origen y destino', 'error');
      return;
    }
    if (!isValidName(form.senderName) || !isValidColombianPhone(form.senderPhone)) {
      toast('Completa nombre y celular del remitente', 'error');
      return;
    }
    if (!isValidAddress(form.pickupAddress) || !isValidAddress(form.deliveryAddress)) {
      toast('Direcciones de recogida y entrega más detalladas', 'error');
      return;
    }

    setQuoting(true);
    try {
      const q = await quoteShipment({
        customerId: user?.id,
        originMunicipio: form.originMunicipio,
        destMunicipio: form.destMunicipio,
        packageType: form.packageType,
        weightTier: form.weightTier,
      });
      setQuote(q);
      setStep('quote');
    } catch (err) {
      toast(err.message || 'No se pudo cotizar', 'error');
    } finally {
      setQuoting(false);
    }
  };

  const handleCreate = async () => {
    if (!quote || !online) return;
    if (!user || !isRealAuthenticatedUser(user)) {
      toast('Inicia sesión para crear envíos con trazabilidad', 'error');
      navigate(buildLoginRedirect('/envios'));
      return;
    }
    setLoading(true);
    try {
      let photoUrl = null;
      if (form.photoFile) {
        photoUrl = await uploadShipmentPhoto('draft', form.photoFile);
      }

      const shipment = await createShipment({
        customerId: user.id,
        quoteId: quote.id,
        quote,
        originMunicipio: form.originMunicipio,
        destMunicipio: form.destMunicipio,
        senderName: sanitizeText(form.senderName, 80),
        senderPhone: sanitizeText(form.senderPhone, 15),
        senderWhatsapp: sanitizeText(form.senderWhatsapp || form.senderPhone, 15),
        senderDocument: form.senderDocument ? sanitizeText(form.senderDocument, 20) : null,
        packageType: form.packageType,
        weightTier: form.weightTier,
        dimensions: sanitizeText(form.dimensions, 80),
        declaredValue: Number(form.declaredValue) || 0,
        packageNotes: sanitizeText(form.packageNotes, 300),
        photoUrl,
        pickupAddress: sanitizeText(form.pickupAddress, 200),
        pickupReference: sanitizeText(form.pickupReference, 120),
        deliveryAddress: sanitizeText(form.deliveryAddress, 200),
        deliveryReference: sanitizeText(form.deliveryReference, 120),
        paymentMethod,
      });

      if (paymentMethod === 'wompi' && isWompiEnabled()) {
        toast('Envío creado. Redirigiendo al pago...');
        try {
          const { url } = await startShipmentWompiCheckout(shipment.id);
          if (url) {
            window.location.href = url;
            return;
          }
        } catch (payErr) {
          toast(payErr.message || 'Envío creado; paga desde el detalle', 'error');
        }
      } else {
        toast('¡Envío creado! Buscando transportista...');
      }
      navigate(`/envios/${shipment.id}`);
    } catch (err) {
      toast(err.message || 'Error al crear envío', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title={false} maxWidth="full" chrome="compact">
      <div className="space-y-5">
        {step === 'home' && (
          <>
            <ServiceCommercialHero
              variant="shipment"
              municipio={municipio}
              onPrimary={() => setStep('form')}
            />

            <ServiceJourneyShowcase variant="shipment" />

            <CustomerShipmentsPanel onNewShipment={() => setStep('form')} />

            {routesLoading ? (
              <div className="flex justify-center py-8"><Loader /></div>
            ) : routesError ? (
              <ErrorState onRetry={refetch} />
            ) : (
              <section className="space-y-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#0D2B45]">Rutas disponibles</h2>
                  <p className="text-sm text-[#4A6278]">Toca una ruta para empezar con origen y destino listos</p>
                </div>
                <ShipmentRouteCards routes={routes} onSelect={handleRouteSelect} />
              </section>
            )}

            <ServiceCrossSell variant="shipment" />
          </>
        )}

        {step !== 'home' && (
          <>
            <button
              type="button"
              onClick={() => setStep(step === 'quote' ? 'form' : 'home')}
              className="text-sm font-semibold text-[#0E6BA8]"
            >
              ← Volver
            </button>

            <ServiceBookingStepper variant="shipment" currentStep={step} />
            <ServiceJourneyShowcase
              variant="shipment"
              activeStep={journeyStepForBooking(step)}
              compact
            />
          </>
        )}

        {(step === 'form' || step === 'quote') && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 'form') handleQuote();
            }}
          >
            <SurfaceCard className="space-y-3">
              <h2 className="font-display text-base font-bold text-[#0D2B45]">Quién envía</h2>
              <Input label="Nombre" value={form.senderName} onChange={(e) => update('senderName', e.target.value)} required />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Celular" type="tel" value={form.senderPhone} onChange={(e) => update('senderPhone', e.target.value)} required />
                <Input label="WhatsApp" type="tel" value={form.senderWhatsapp} onChange={(e) => update('senderWhatsapp', e.target.value)} />
              </div>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h2 className="font-display text-base font-bold text-[#0D2B45]">Ruta del paquete</h2>
              <ShipmentMunicipioPairPicker
                origin={form.originMunicipio}
                dest={form.destMunicipio}
                onOriginChange={(v) => update('originMunicipio', v)}
                onDestChange={(v) => update('destMunicipio', v)}
              />
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h2 className="font-display text-base font-bold text-[#0D2B45]">Qué envías</h2>
              <FormSelect label="Tipo" value={form.packageType} onChange={(e) => update('packageType', e.target.value)}>
                {SHIPMENT_PACKAGE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </FormSelect>
              <FormSelect label="Peso" value={form.weightTier} onChange={(e) => update('weightTier', e.target.value)}>
                {SHIPMENT_WEIGHT_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </FormSelect>
              <Input label="Valor declarado (COP)" type="number" value={form.declaredValue} onChange={(e) => update('declaredValue', e.target.value)} />
              <Input label="Notas del paquete" value={form.packageNotes} onChange={(e) => update('packageNotes', e.target.value)} />
              <label className="block text-sm font-medium text-foreground">
                Foto del paquete (opcional)
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm"
                  onChange={(e) => update('photoFile', e.target.files?.[0] || null)}
                />
              </label>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <h2 className="font-display text-base font-bold text-[#0D2B45]">Dónde recogemos y entregamos</h2>
              <Input label={`Recoger en ${form.originMunicipio || 'origen'}`} value={form.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} required />
              <Input label="Referencia recogida" value={form.pickupReference} onChange={(e) => update('pickupReference', e.target.value)} />
              <Input label={`Entregar en ${form.destMunicipio || 'destino'}`} value={form.deliveryAddress} onChange={(e) => update('deliveryAddress', e.target.value)} required />
              <Input label="Referencia entrega" value={form.deliveryReference} onChange={(e) => update('deliveryReference', e.target.value)} />
            </SurfaceCard>

            {step === 'form' && (
              <Button type="submit" className="w-full bg-[#0E6BA8] hover:bg-[#0B5A8C]" disabled={quoting || !online}>
                {quoting ? 'Cotizando...' : !online ? 'Sin conexión' : 'Ver cotización'}
              </Button>
            )}
          </form>
        )}

        {step === 'quote' && quote && (
          <>
            {(!user || !isRealAuthenticatedUser(user)) && (
              <ClientAuthGateCard
                redirectPath="/envios"
                title="Confirma con tu cuenta"
                description="Los envíos intermunicipales requieren identidad verificada para trazabilidad y protección del paquete."
              />
            )}
            <ShipmentQuoteCard
              quote={quote}
              onContinue={handleCreate}
              loading={loading}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              disabled={!user || !isRealAuthenticatedUser(user)}
            />
            <p className="text-center text-xs text-[#4A6278]">
              Tras confirmar, sigue el viaje de tu paquete en tiempo real
            </p>
            <Link to="/pedidos" className="block text-center text-sm font-semibold text-[#0E6BA8]">
              Ver envíos en curso →
            </Link>
          </>
        )}
      </div>
    </PageLayout>
  );
}
