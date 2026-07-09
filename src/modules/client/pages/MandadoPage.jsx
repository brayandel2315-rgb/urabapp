import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useLocationStore } from '../../../store/locationStore';
import { useAuthStore } from '../../../store/authStore';
import { isRealAuthenticatedUser } from '@/utils/auth-session';
import ClientAuthGateCard from '@/components/client/ClientAuthGateCard';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import { quoteCourierDelivery, submitCourierRequest } from '../../../services/courier.service';
import { geocodeAddress } from '../../../services/map.service';
import { formatCOP } from '../../../utils/currency';
import { isValidColombianPhone, isValidName, isValidAddress, sanitizeText } from '../../../utils/validate';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { toast } from '../../../utils/toast';
import CourierRouteMap from '@/components/courier/CourierRouteMap';
import FareBreakdownCard from '@/components/courier/FareBreakdownCard';
import CourierPackageForm from '@/components/courier/CourierPackageForm';
import CourierUseCaseCards from '@/components/courier/CourierUseCaseCards';
import ServiceCommercialHero from '@/components/services/ServiceCommercialHero';
import ServiceJourneyShowcase from '@/components/services/ServiceJourneyShowcase';
import ServiceBookingStepper from '@/components/services/ServiceBookingStepper';
import ServiceCrossSell from '@/components/services/ServiceCrossSell';
import AppIcon from '@/design-system/icons/AppIcon';
import { buildLoginRedirect } from '@/utils/auth-routes';
import { mergeContactPrefill } from '@/utils/profile-form';
import { cn } from '@/lib/utils';

function hasRoutePrefill(state) {
  return Boolean(state?.pickup !== undefined || state?.dropoff !== undefined);
}

export default function MandadoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { municipio, setMunicipio } = useLocationStore();
  const { user, profile } = useAuthStore();
  const online = useOnlineStatus();

  const [step, setStep] = useState(() => (hasRoutePrefill(location.state) ? 'form' : 'home'));
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [activePoint, setActivePoint] = useState('pickup');
  const [quote, setQuote] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    pickup: '',
    dropoff: '',
    notes: '',
    packageType: 'package',
    weightTier: '0-2',
    priority: 'normal',
    pickupCoords: null,
    dropoffCoords: null,
  });

  useEffect(() => {
    if (location.state?.municipio) {
      setMunicipio(location.state.municipio);
    }
    if (hasRoutePrefill(location.state)) {
      setForm((f) => ({
        ...f,
        pickup: location.state.pickup ?? f.pickup,
        dropoff: location.state.dropoff ?? f.dropoff,
      }));
      setStep('form');
    }
  }, [location.state, setMunicipio]);

  useEffect(() => {
    if (!user && !profile) return;
    setForm((f) => mergeContactPrefill(f, user, profile));
  }, [user, profile]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const startWithPackageType = (packageType) => {
    setForm((f) => ({ ...f, packageType }));
    setStep('form');
  };

  const handleCalculate = async () => {
    if (!isValidAddress(form.pickup) || !isValidAddress(form.dropoff)) {
      toast('Ingresa direcciones de recogida y entrega', 'error');
      return;
    }
    setQuoting(true);
    try {
      const result = await quoteCourierDelivery({
        pickup: form.pickup,
        dropoff: form.dropoff,
        municipio,
        priority: form.priority,
        pickupCoords: form.pickupCoords,
        dropoffCoords: form.dropoffCoords,
      });
      setQuote(result);
      setForm((f) => ({
        ...f,
        pickupCoords: result.pickup,
        dropoffCoords: result.dropoff,
      }));
      setStep('quote');
    } catch (err) {
      toast(err.message || 'No se pudo calcular la tarifa', 'error');
    } finally {
      setQuoting(false);
    }
  };

  const handleSubmit = async () => {
    if (!quote) return;
    if (!user || !isRealAuthenticatedUser(user)) {
      toast('Inicia sesión para confirmar tu mandado con seguridad', 'error');
      navigate(buildLoginRedirect('/mandado'));
      return;
    }
    if (!isValidName(form.fullName)) {
      toast('Ingresa tu nombre completo', 'error');
      return;
    }
    if (!isValidColombianPhone(form.phone)) {
      toast('Celular inválido', 'error');
      return;
    }
    if (!online) {
      toast('Sin conexión', 'error');
      return;
    }

    setLoading(true);
    try {
      const order = await submitCourierRequest(
        {
          ...form,
          pickup: sanitizeText(form.pickup, 200),
          dropoff: sanitizeText(form.dropoff, 200),
          notes: sanitizeText(form.notes, 200),
          pickupCoords: quote.pickup,
          dropoffCoords: quote.dropoff,
        },
        { customerId: user.id, municipio },
      );

      toast('¡Buscando mensajero!');
      navigate(`/pedidos/${order.id}`);
    } catch (err) {
      toast(err.message || 'Error al crear mandado', 'error');
    } finally {
      setLoading(false);
    }
  };

  const geocodeField = useCallback(async (field, text) => {
    if (!text?.trim()) return;
    const result = await geocodeAddress(text, { municipio });
    if (!result) return;
    if (field === 'pickup') {
      update('pickupCoords', result);
      if (!form.pickup) update('pickup', result.label);
    } else {
      update('dropoffCoords', result);
      if (!form.dropoff) update('dropoff', result.label);
    }
  }, [municipio, form.pickup, form.dropoff]);

  if (step === 'home') {
    return (
      <div className="client-page-body space-y-5 pb-10">
        <ServiceCommercialHero
          variant="courier"
          municipio={municipio}
          onPrimary={() => setStep('form')}
        />

        <ClientActiveOrderBanner />

        <ServiceJourneyShowcase variant="courier" />

        <CourierUseCaseCards onSelect={startWithPackageType} />

        <ServiceCrossSell variant="courier" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full bg-[#0E6BA8] hover:bg-[#0B5A8C]"
            size="lg"
            onClick={() => setStep('form')}
          >
            Pedir mandado ahora
          </Button>
          <Link to="/pedidos" className="w-full">
            <Button type="button" variant="outline" className="w-full">
              Ver mis pedidos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const journeyStep = step === 'quote' ? 'quote' : 'plan';

  return (
    <div className="relative flex min-h-[calc(100dvh-8rem)] flex-col bg-background lg:mx-auto lg:max-w-7xl lg:flex-row lg:items-stretch lg:gap-6 lg:px-8 lg:py-6">
      <CourierRouteMap
        municipio={municipio}
        pickup={form.pickupCoords}
        dropoff={form.dropoffCoords}
        activePoint={activePoint}
        onPickupChange={(c) => {
          update('pickupCoords', c);
          if (c.label) update('pickup', c.label);
        }}
        onDropoffChange={(c) => {
          update('dropoffCoords', c);
          if (c.label) update('dropoff', c.label);
        }}
        className="h-[34vh] min-h-[200px] shrink-0 sm:h-[38vh] lg:h-auto lg:min-h-[560px] lg:flex-1 lg:rounded-2xl lg:shadow-md"
      />

      <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-3xl border border-border/40 bg-background/95 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:mt-0 lg:max-w-[480px] lg:shrink-0 lg:rounded-2xl lg:shadow-lg">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border lg:hidden" />

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                if (step === 'quote') setStep('form');
                else setStep('home');
              }}
              className="text-sm font-semibold text-[#0E6BA8]"
            >
              ← Volver
            </button>
            <p className="text-xs font-semibold text-[#4A6278]">{municipio}</p>
          </div>

          <ServiceBookingStepper variant="courier" currentStep={step} />

          <ServiceJourneyShowcase variant="courier" activeStep={journeyStep} compact />

          <div className="grid grid-cols-2 gap-2">
            {['pickup', 'dropoff'].map((point) => (
              <button
                key={point}
                type="button"
                onClick={() => setActivePoint(point)}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors',
                  activePoint === point
                    ? 'bg-[#0E6BA8] text-white'
                    : 'border border-[#D8E2EC] bg-white text-[#4A6278]',
                )}
              >
                {point === 'pickup' ? '① Recoger en' : '② Entregar en'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Input
              label="Recoger en"
              value={form.pickup}
              onChange={(e) => update('pickup', e.target.value)}
              onBlur={() => geocodeField('pickup', form.pickup)}
              placeholder="Dirección o toca el mapa"
            />
            <Input
              label="Entregar en"
              value={form.dropoff}
              onChange={(e) => update('dropoff', e.target.value)}
              onBlur={() => geocodeField('dropoff', form.dropoff)}
              placeholder="Dirección de entrega"
            />
          </div>

          {step === 'form' && (
            <>
              <CourierPackageForm
                value={form}
                onChange={(pkg) => setForm((f) => ({ ...f, ...pkg }))}
              />
              <Input
                label="Notas"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Instrucciones para el mensajero"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Tu nombre" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                <Input label="WhatsApp" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <Button type="button" className="w-full bg-[#0E6BA8] hover:bg-[#0B5A8C]" disabled={quoting} onClick={handleCalculate}>
                <AppIcon name="search" size="sm" className="mr-2 inline" />
                {quoting ? 'Calculando...' : 'Ver precio y continuar'}
              </Button>
            </>
          )}

          {step === 'quote' && quote && (
            <>
              <FareBreakdownCard
                fare={quote.fare}
                distanceKm={quote.distanceKm}
                estimatedMinutes={quote.estimatedMinutes}
              />
              {(!user || !isRealAuthenticatedUser(user)) && (
                <ClientAuthGateCard
                  redirectPath="/mandado"
                  title="Confirma con tu cuenta"
                  description="Los mandados requieren sesión verificada para proteger a mensajeros y tiendas."
                />
              )}
              <Button
                type="button"
                className="w-full bg-[#0E6BA8] py-3.5 text-base font-bold hover:bg-[#0B5A8C]"
                size="lg"
                disabled={loading || !online || !user || !isRealAuthenticatedUser(user)}
                onClick={handleSubmit}
              >
                {loading ? 'Publicando...' : `Buscar mensajero · ${formatCOP(quote.fare.total)}`}
              </Button>
              <p className="text-center text-xs text-[#4A6278]">
                Después podrás seguir el recorrido en vivo en Mis pedidos
              </p>
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep('form')}>
                Editar direcciones
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
