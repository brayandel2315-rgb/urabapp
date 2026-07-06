import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import JoinAuthPanel from '@/components/auth/JoinAuthPanel';
import LiveCameraCapture from '@/components/media/LiveCameraCapture';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import FormSelect from '@/design-system/patterns/FormSelect';
import AppIcon from '@/design-system/icons/AppIcon';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import { renderRiderProfileGate } from '../components/RiderProfileGate';
import {
  registerCourierStep1,
  registerCourierStep2,
  saveCourierLiveSelfie,
  submitCourierForReview,
} from '@/services/courier-panel.service';
import { getProfile } from '@/services/auth.service';
import { emitCommEvent } from '@/communication';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { MUNICIPALITIES, ECONOMICS } from '@/utils/constants';
import { formatCOP } from '@/utils/currency';
import { isValidColombianPhone, isValidName, sanitizeText } from '@/utils/validate';
import { toast } from '@/utils/toast';
import RiderOnboardingStepper from '../components/RiderOnboardingStepper';
import { VEHICLE_TYPES } from '../constants';

const STEP_LABELS = ['Tu perfil', 'Foto en vivo', 'Confirmar'];
const TOTAL_STEPS = 3;

export default function RiderOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile, setProfile } = useAuthStore();
  const { municipio: storeMunicipio } = useLocationStore();
  const [step, setStep] = useState(1);
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    location: false,
    livePhoto: false,
  });
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    birthDate: '',
    phone: '',
    email: '',
    city: 'Urabá',
    municipio: storeMunicipio || 'Apartadó',
    language: 'es',
    vehicleType: 'moto',
    plate: '',
    capacity: '',
    intermunicipal: false,
    brand: '',
    model: '',
  });

  const driverQuery = useMyDriverProfile();
  const { data: driver } = driverQuery;

  const hasLivePhoto = Boolean(selfieUrl || driver?.profile_photo_url);

  useEffect(() => {
    if (!driver) return;
    if (driver.verification_status === 'approved' || driver.is_verified) {
      navigate('/domiciliario', { replace: true });
      return;
    }
    if (driver.profile_photo_url) setSelfieUrl(driver.profile_photo_url);
    if (driver.verification_status === 'in_review' || driver.onboarding_step >= 4) {
      setStep(4);
      return;
    }
    const saved = Math.max(1, Math.min(driver.onboarding_step || 1, TOTAL_STEPS));
    if (driver.profile_photo_url && saved < 3) setStep(3);
    else setStep(saved);
    setForm((f) => ({
      ...f,
      firstName: driver.first_name || f.firstName,
      lastName: driver.last_name || f.lastName,
      phone: driver.phone || f.phone,
      email: driver.email || user?.email || f.email,
      municipio: driver.municipio || f.municipio,
      vehicleType: driver.vehicle || f.vehicleType,
      plate: driver.plate || f.plate,
      intermunicipal: driver.intermunicipal_enabled ?? f.intermunicipal,
    }));
  }, [driver, navigate, user?.email]);

  useEffect(() => {
    if (!user && !profile) return;
    setForm((f) => ({
      ...f,
      firstName: f.firstName || profile?.full_name?.split(' ')[0] || '',
      lastName: f.lastName || profile?.full_name?.split(' ').slice(1).join(' ') || '',
      phone: f.phone || profile?.phone?.replace(/^\+57/, '') || '',
      email: f.email || user?.email || '',
    }));
  }, [profile, user]);

  const persistProfileSteps = async () => {
    const d = await registerCourierStep1({
      firstName: sanitizeText(form.firstName, 40),
      lastName: sanitizeText(form.lastName, 40),
      documentType: form.documentType,
      documentNumber: sanitizeText(form.documentNumber, 20),
      birthDate: form.birthDate || null,
      phone: sanitizeText(form.phone, 20),
      email: form.email,
      city: form.city,
      municipio: form.municipio,
      language: form.language,
    });
    await registerCourierStep2({
      vehicleType: form.vehicleType,
      plate: form.plate,
      capacity: form.capacity,
      intermunicipal: form.intermunicipal,
      brand: form.brand,
      model: form.model,
    });
    await queryClient.invalidateQueries({ queryKey: ['my-driver'] });
    if (user?.id) {
      const nextProfile = await getProfile(user.id);
      if (nextProfile) setProfile(nextProfile);
      if (d) queryClient.setQueryData(['my-driver', user.id], d);
    }
    return d;
  };

  const handleContinueStep1 = async () => {
    setSavingProfile(true);
    try {
      await persistProfileSteps();
      setStep(2);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSelfieCapture = async (file) => {
    let driverId = driver?.id;
    if (!driverId) {
      const d = await persistProfileSteps();
      driverId = d?.id;
      await queryClient.invalidateQueries({ queryKey: ['my-driver'] });
    }
    if (!driverId) throw new Error('No se pudo crear tu perfil de mensajero');
    const url = await saveCourierLiveSelfie(driverId, file);
    setSelfieUrl(url);
    await queryClient.invalidateQueries({ queryKey: ['my-driver'] });
    toast('Foto guardada correctamente', 'success');
    setStep(3);
  };

  const finishMutation = useMutation({
    mutationFn: async () => {
      if (!hasLivePhoto) {
        throw new Error('Debes tomar tu foto en vivo con la cámara antes de activar tu cuenta.');
      }
      return submitCourierForReview();
    },
    onSuccess: async () => {
      const nextProfile = await getProfile(user.id);
      if (nextProfile) setProfile(nextProfile);
      emitCommEvent('rider_registered', {
        recipientId: user.id,
        actorId: user.id,
        payload: { municipio: form.municipio },
      }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ['my-driver'] });
      setStep(4);
      toast('¡Cuenta activa! Ya puedes conectarte y recibir entregas');
    },
    onError: (e) => toast(e.message, 'error'),
  });

  const canContinueStep1 = isValidName(form.firstName)
    && isValidColombianPhone(form.phone)
    && form.municipio;

  const canFinish = consents.terms
    && consents.privacy
    && consents.location
    && consents.livePhoto
    && hasLivePhoto;

  if (!user) {
    return (
      <div className="mx-auto max-w-lg space-y-4 pb-8">
        <PanelHeader
          tag="Únete"
          title="Sé repartidor en Urabá"
          subtitle={`${formatCOP(ECONOMICS.riderPayout)} por entrega · Horario flexible`}
        />
        <JoinAuthPanel title="Crea tu cuenta" subtitle="Email y contraseña para empezar." />
      </div>
    );
  }

  const blocked = renderRiderProfileGate(driverQuery, {
    loadingTitle: 'Preparando tu registro…',
    requireDriver: false,
  });
  if (blocked) return blocked;

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-8">
      {step <= TOTAL_STEPS && (
        <>
          <PanelHeader
            tag="Registro"
            title={STEP_LABELS[step - 1]}
            subtitle={`Paso ${step} de ${TOTAL_STEPS} · Verificación obligatoria`}
          />
          <RiderOnboardingStepper step={step} total={TOTAL_STEPS} />
        </>
      )}

      {step === 1 && (
        <SurfaceCard className="space-y-4">
          <p className="text-sm text-muted-foreground">Datos básicos para operar en tu municipio.</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="Celular" value={form.phone} inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="300 123 4567" />
          <FormSelect label="Municipio base" value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })}>
            {MUNICIPALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
          </FormSelect>
          <FormSelect label="Vehículo" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>
            {VEHICLE_TYPES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </FormSelect>
          {form.vehicleType !== 'pie' && (
            <Input label="Placa (opcional)" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })} />
          )}
          <Button className="w-full" disabled={!canContinueStep1 || savingProfile} onClick={handleContinueStep1}>
            {savingProfile ? 'Guardando…' : 'Continuar'}
          </Button>
        </SurfaceCard>
      )}

      {step === 2 && (
        <SurfaceCard className="space-y-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-foreground">
            <p className="font-semibold">Verificación de identidad</p>
            <p className="mt-1 text-muted-foreground">
              Por seguridad y cumplimiento legal, debes abrir la cámara y tomarte una foto en este momento.
              No se aceptan imágenes de galería ni archivos subidos.
            </p>
          </div>

          {selfieUrl && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
              <img src={selfieUrl} alt="" className="h-16 w-16 rounded-xl object-cover ring-2 ring-primary/30" />
              <div>
                <p className="text-sm font-semibold text-foreground">Foto registrada</p>
                <p className="text-xs text-muted-foreground">Puedes continuar o repetir la captura</p>
              </div>
            </div>
          )}

          <LiveCameraCapture
            label="Foto del mensajero (obligatoria)"
            hint="Rostro visible, buena luz, sin gorras ni gafas de sol."
            onCapture={handleSelfieCapture}
          />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Atrás</Button>
            <Button className="flex-1" disabled={!hasLivePhoto} onClick={() => setStep(3)}>
              Continuar
            </Button>
          </div>
        </SurfaceCard>
      )}

      {step === 3 && (
        <SurfaceCard className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
            {selfieUrl ? (
              <img src={selfieUrl} alt="" className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                <AppIcon name="profile" size="lg" className="text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-semibold">{form.firstName} {form.lastName}</p>
              <p className="text-sm text-muted-foreground">{form.municipio} · {VEHICLE_TYPES.find((v) => v.value === form.vehicleType)?.label}</p>
              <p className="mt-1 text-primary font-bold">{formatCOP(ECONOMICS.riderPayout)} por entrega</p>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" checked={consents.livePhoto} onChange={(e) => setConsents({ ...consents, livePhoto: e.target.checked })} className="mt-0.5" />
            Autorizo el uso de mi foto en tiempo real para verificación de identidad (Ley 1581 de 2012)
          </label>
          <label className="flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" checked={consents.terms} onChange={(e) => setConsents({ ...consents, terms: e.target.checked })} className="mt-0.5" />
            Acepto operar como mensajero independiente en Colombia
          </label>
          <label className="flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" checked={consents.privacy} onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })} className="mt-0.5" />
            Autorizo el tratamiento de mis datos personales
          </label>
          <label className="flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" checked={consents.location} onChange={(e) => setConsents({ ...consents, location: e.target.checked })} className="mt-0.5" />
            Compartir ubicación cuando esté en línea
          </label>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Atrás</Button>
            <Button
              className="flex-1"
              disabled={!canFinish || finishMutation.isPending}
              onClick={() => finishMutation.mutate()}
            >
              {finishMutation.isPending ? 'Enviando…' : 'Enviar registro'}
            </Button>
          </div>
        </SurfaceCard>
      )}

      {step === 4 && (
        <SurfaceCard className="space-y-4 text-center">
          <AppIcon name="mensajeria" size="3xl" className="mx-auto text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">¡Cuenta activa!</h2>
          <p className="text-sm text-muted-foreground">
            Conéctate en línea desde Pedidos y empieza a recibir entregas en {form.municipio}.
          </p>
          <Button className="w-full" onClick={() => navigate('/domiciliario')}>
            Ir a pedidos
          </Button>
        </SurfaceCard>
      )}
    </div>
  );
}
