import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Input from '@/components/ui/Input';
import FormSelect from '@/design-system/patterns/FormSelect';
import UrabaBarrioPicker from '@/components/uraba/UrabaBarrioPicker';
import PlacesAutocomplete from '@/components/geo/PlacesAutocomplete';
import AppIcon from '@/design-system/icons/AppIcon';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore, selectHomeMunicipio } from '@/store/locationStore';
import { getUserAddresses, createAddress, deleteAddress, setDefaultAddress } from '@/services/address.service';
import { isCompleteDeliveryAddress, validateAddressForm } from '@/utils/delivery-address';
import { safeRedirectPath } from '@/utils/validate';
import { toast } from '@/utils/toast';
import { emitCommEvent } from '@/communication';

const LABELS = ['Casa', 'Trabajo', 'Otro'];

export default function AccountAddressesPage() {
  const { user } = useAuthStore();
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setupMode = searchParams.get('setup') === '1' || searchParams.get('required') === '1';
  const returnTo = safeRedirectPath(searchParams.get('redirect'), '/checkout');
  const [fieldErrors, setFieldErrors] = useState({});
  const [newAddr, setNewAddr] = useState({
    label: 'Casa',
    address: '',
    reference: '',
    barrio: '',
    latitude: null,
    longitude: null,
  });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getUserAddresses(user.id),
    enabled: !!user?.id,
  });

  const completeAddresses = addresses.filter(isCompleteDeliveryAddress);

  const addMutation = useMutation({
    mutationFn: () => createAddress(user.id, {
      municipio: homeMunicipio,
      barrio: newAddr.barrio,
      address: newAddr.address.trim(),
      reference: newAddr.reference.trim(),
      label: newAddr.label,
      isDefault: addresses.length === 0 || newAddr.label === 'Casa',
      latitude: newAddr.latitude,
      longitude: newAddr.longitude,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setNewAddr({ label: 'Casa', address: '', reference: '', barrio: '', latitude: null, longitude: null });
      setFieldErrors({});
      toast('Dirección de casa guardada');
      emitCommEvent('account_address_added', {
        recipientId: user.id,
        actorId: user.id,
        payload: { label: newAddr.label, municipio: homeMunicipio },
      }).catch(() => {});
      if (setupMode) {
        navigate(returnTo || '/checkout');
      }
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast('Dirección eliminada');
    },
  });

  const defaultMutation = useMutation({
    mutationFn: (addressId) => setDefaultAddress(user.id, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast('Dirección principal actualizada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const handleSave = () => {
    const result = validateAddressForm({ ...newAddr, municipio: homeMunicipio });
    setFieldErrors(result.errors);
    if (!result.valid) {
      toast(Object.values(result.errors)[0], 'error');
      return;
    }
    addMutation.mutate();
  };

  if (!user) {
    return <p className="text-sm text-muted-foreground">Inicia sesión para gestionar direcciones.</p>;
  }

  return (
    <div className="space-y-4">
      {(setupMode || completeAddresses.length === 0) && (
        <SurfaceCard className="border-primary/25 bg-primary/5 space-y-1 p-4">
          <p className="text-sm font-bold text-foreground">Dirección de casa obligatoria</p>
          <p className="text-sm text-muted-foreground">
            Antes de pedir necesitas guardar barrio, dirección y una referencia clara.
            Así el mensajero llega sin llamarte a cada rato.
          </p>
        </SurfaceCard>
      )}

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Tus direcciones</SectionTitle>
        {isLoading ? (
          <Loader variant="section" message="Cargando direcciones…" className="min-h-[8rem]" />
        ) : addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no tienes ninguna. Completa el formulario de abajo (todos los campos son obligatorios).
          </p>
        ) : (
          <ul className="space-y-2">
            {addresses.map((a) => {
              const complete = isCompleteDeliveryAddress(a);
              return (
                <li key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1 font-semibold">
                      <AppIcon name="map" size="xs" />
                      {a.label}
                      {a.is_default && <span className="text-xs text-primary">· Principal</span>}
                      {!complete && (
                        <span className="text-xs font-bold text-urgency">· Incompleta</span>
                      )}
                    </p>
                    <p className="text-sm">{a.address || 'Sin dirección'}</p>
                    <p className="text-xs text-muted-foreground">
                      {[a.barrio, a.municipio].filter(Boolean).join(', ') || 'Sin barrio'}
                    </p>
                    {a.reference ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">Ref: {a.reference}</p>
                    ) : (
                      <p className="mt-0.5 text-xs font-medium text-urgency">Falta referencia</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    {!a.is_default && complete && (
                      <Button
                        variant="outline"
                        size="sm"
                        loading={defaultMutation.isPending}
                        onClick={() => defaultMutation.mutate(a.id)}
                      >
                        Principal
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(a.id)}>
                      Eliminar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>
          {completeAddresses.length === 0 ? 'Registra tu dirección de casa' : 'Nueva dirección'}
        </SectionTitle>
        <p className="text-sm text-muted-foreground">
          Tipo, barrio, dirección y referencia son obligatorios.
        </p>

        <FormSelect
          label="Tipo *"
          value={newAddr.label}
          onChange={(e) => {
            setNewAddr((s) => ({ ...s, label: e.target.value }));
            setFieldErrors((err) => ({ ...err, label: undefined }));
          }}
          options={LABELS.map((l) => ({ value: l, label: l }))}
        />
        {fieldErrors.label && <p className="text-xs text-destructive">{fieldErrors.label}</p>}

        <div className="space-y-2">
          <UrabaBarrioPicker
            municipio={homeMunicipio}
            value={newAddr.barrio}
            onChange={(v) => {
              setNewAddr((s) => ({ ...s, barrio: v }));
              setFieldErrors((err) => ({ ...err, barrio: undefined }));
            }}
            variant="checkout"
            purpose="address"
            showAllOption={false}
            label={`Barrio * (${homeMunicipio})`}
            className="w-full max-w-none"
          />
          {fieldErrors.barrio && <p className="text-xs text-destructive">{fieldErrors.barrio}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Dirección *</label>
          <PlacesAutocomplete
            value={newAddr.address}
            municipio={homeMunicipio}
            onChange={(v) => {
              setNewAddr((s) => ({ ...s, address: v }));
              setFieldErrors((err) => ({ ...err, address: undefined }));
            }}
            onPlaceSelect={(place) => setNewAddr((s) => ({
              ...s,
              address: place.label || s.address,
              latitude: place.latitude,
              longitude: place.longitude,
            }))}
            placeholder="Calle, número, conjunto o edificio"
          />
          {fieldErrors.address && <p className="text-xs text-destructive">{fieldErrors.address}</p>}
        </div>

        <div>
          <Input
            label="Referencia *"
            value={newAddr.reference}
            onChange={(e) => {
              setNewAddr((s) => ({ ...s, reference: e.target.value }));
              setFieldErrors((err) => ({ ...err, reference: undefined }));
            }}
            placeholder="Ej: Casa blanca, portón negro, apto 302"
            required
          />
          {fieldErrors.reference && <p className="mt-1 text-xs text-destructive">{fieldErrors.reference}</p>}
        </div>

        <Button onClick={handleSave} loading={addMutation.isPending}>
          Guardar dirección de casa
        </Button>
      </SurfaceCard>
    </div>
  );
}
