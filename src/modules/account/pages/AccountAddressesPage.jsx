import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Input from '@/components/ui/Input';
import FormSelect from '@/design-system/patterns/FormSelect';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore, selectHomeMunicipio } from '@/store/locationStore';
import { getUserAddresses, createAddress, deleteAddress, setDefaultAddress } from '@/services/address.service';
import { isValidAddress } from '@/utils/validate';
import { toast } from '@/utils/toast';
import { emitCommEvent } from '@/communication';
import PlacesAutocomplete from '@/components/geo/PlacesAutocomplete';
import AppIcon from '@/design-system/icons/AppIcon';

const LABELS = ['Casa', 'Trabajo', 'Otro'];

export default function AccountAddressesPage() {
  const { user } = useAuthStore();
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const queryClient = useQueryClient();
  const [newAddr, setNewAddr] = useState({
    label: 'Casa', address: '', reference: '', barrio: '', latitude: null, longitude: null,
  });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getUserAddresses(user.id),
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: () => createAddress(user.id, {
      municipio: homeMunicipio,
      barrio: newAddr.barrio,
      address: newAddr.address,
      reference: newAddr.reference,
      label: newAddr.label,
      isDefault: addresses.length === 0,
      latitude: newAddr.latitude,
      longitude: newAddr.longitude,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setNewAddr({ label: 'Casa', address: '', reference: '', barrio: '', latitude: null, longitude: null });
      toast('Dirección guardada');
      emitCommEvent('account_address_added', {
        recipientId: user.id,
        actorId: user.id,
        payload: { label: newAddr.label, municipio: homeMunicipio },
      }).catch(() => {});
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

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para gestionar direcciones.</p>;

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Direcciones guardadas</SectionTitle>
        {isLoading ? <Loader variant="section" message="Cargando direcciones…" className="min-h-[8rem]" /> : addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no tienes direcciones. Agrega una para pedir más rápido.</p>
        ) : (
          <ul className="space-y-2">
            {addresses.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1 font-semibold">
                    <AppIcon name="map" size="xs" />
                    {a.label} {a.is_default && <span className="text-xs text-primary">· Principal</span>}
                  </p>
                  <p className="text-sm">{a.address}</p>
                  <p className="text-xs text-muted-foreground">{a.barrio}, {a.municipio}</p>
                  {a.latitude != null && (
                    <p className="mt-1 text-[10px] text-muted-foreground">GPS guardado para entrega precisa</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {!a.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      loading={defaultMutation.isPending}
                      onClick={() => defaultMutation.mutate(a.id)}
                    >
                      Principal
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(a.id)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Nueva dirección</SectionTitle>
        <FormSelect label="Tipo" value={newAddr.label} onChange={(e) => setNewAddr((s) => ({ ...s, label: e.target.value }))} options={LABELS.map((l) => ({ value: l, label: l }))} />
        <Input label="Barrio" value={newAddr.barrio} onChange={(e) => setNewAddr((s) => ({ ...s, barrio: e.target.value }))} />
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Dirección</label>
          <PlacesAutocomplete
            value={newAddr.address}
            onChange={(v) => setNewAddr((s) => ({ ...s, address: v }))}
            onPlaceSelect={(place) => setNewAddr((s) => ({
              ...s,
              address: place.label || s.address,
              latitude: place.latitude,
              longitude: place.longitude,
            }))}
            placeholder="Calle, número, barrio…"
          />
        </div>
        <Input label="Referencia" value={newAddr.reference} onChange={(e) => setNewAddr((s) => ({ ...s, reference: e.target.value }))} />
        <Button
          onClick={() => {
            if (!isValidAddress(newAddr.address)) return toast('Dirección inválida', 'error');
            addMutation.mutate();
          }}
          loading={addMutation.isPending}
        >
          Guardar dirección
        </Button>
      </SurfaceCard>
    </div>
  );
}
