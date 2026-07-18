import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PlacesAutocomplete from '@/components/geo/PlacesAutocomplete';
import AddressMapPicker from '@/components/maps/AddressMapPicker';
import UrabaBarrioPicker from '@/components/uraba/UrabaBarrioPicker';
import { isValidDeliveryCoordinates } from '../utils/checkout-validation';
import { isSpecificBarrio } from '@/utils/barrio';

export default function CheckoutDeliveryStep({
  user,
  profile,
  municipio,
  barrio,
  setBarrio,
  fullName,
  setFullName,
  phone,
  setPhone,
  address,
  setAddress,
  reference,
  setReference,
  savedAddresses,
  selectedAddressId,
  selectSavedAddress,
  useNewAddress,
  mapLat,
  mapLng,
  latitude,
  longitude,
  hasCoords,
  gpsLoading,
  locationHint,
  detect,
  onMapChange,
  onPlaceSelect,
  saveAddress,
  setSaveAddress,
  fieldErrors,
  setFieldErrors,
}) {
  const coordsOk = isValidDeliveryCoordinates(mapLat ?? latitude, mapLng ?? longitude);
  const barrioOk = isSpecificBarrio(barrio);

  const clearError = (key) => setFieldErrors((e) => ({ ...e, [key]: undefined }));

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-3">
        <SectionTitle>Datos de contacto</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Usamos tu cuenta <strong>{profile?.email || user?.email}</strong>. El nombre y celular quedan guardados en tu perfil.
        </p>
        <div>
          <Input
            label="Nombre completo"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
            required
            autoComplete="name"
          />
          {fieldErrors.fullName && <p className="mt-1 text-xs text-destructive">{fieldErrors.fullName}</p>}
        </div>
        <div>
          <Input
            label="Celular de contacto"
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
            placeholder="300 123 4567"
            required
            autoComplete="tel"
          />
          {fieldErrors.phone && <p className="mt-1 text-xs text-destructive">{fieldErrors.phone}</p>}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <SectionTitle>¿Dónde entregamos?</SectionTitle>
            <p className="text-sm text-muted-foreground">
              Elige una dirección guardada o marca el punto exacto en el mapa.
            </p>
          </div>
          {coordsOk ? (
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              Punto listo
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-urgency/15 px-2.5 py-1 text-[11px] font-bold text-urgency">
              Marca el mapa
            </span>
          )}
        </div>

        {savedAddresses.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tus direcciones</p>
            {savedAddresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-component)] border p-3 transition-colors ${
                  selectedAddressId === addr.id
                    ? 'border-primary bg-primary/5 shadow-soft'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <input
                  type="radio"
                  name="savedAddress"
                  checked={selectedAddressId === addr.id}
                  onChange={() => selectSavedAddress(addr)}
                  className="mt-1 accent-primary"
                />
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-foreground">{addr.label || 'Mi dirección'}</p>
                  <p className="text-muted-foreground">{addr.address}</p>
                  {addr.barrio && (
                    <p className="mt-0.5 text-xs font-medium text-foreground/80">{addr.barrio}</p>
                  )}
                  {addr.latitude != null && (
                    <p className="mt-0.5 text-[11px] font-semibold text-primary">GPS guardado</p>
                  )}
                </div>
              </label>
            ))}
            <button type="button" className="text-sm font-semibold text-primary" onClick={useNewAddress}>
              + Usar otra dirección
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Dirección</label>
          <PlacesAutocomplete
            value={address}
            municipio={municipio}
            biasCoords={mapLat != null ? { latitude: mapLat, longitude: mapLng } : (hasCoords ? { latitude, longitude } : null)}
            onChange={(v) => {
              setAddress(v);
              clearError('address');
            }}
            onPlaceSelect={(place) => {
              onPlaceSelect?.(place);
              clearError('address');
              clearError('location');
            }}
            placeholder="Calle, número, conjunto o edificio"
          />
          {fieldErrors.address && (
            <p className="text-xs text-destructive">{fieldErrors.address}</p>
          )}
        </div>

        <div>
          <Input
            label="Referencia para el repartidor"
            placeholder="Ej: Casa blanca, portón negro, frente al parque, apto 302"
            value={reference}
            onChange={(e) => { setReference(e.target.value); clearError('reference'); }}
            required
          />
          {fieldErrors.reference && <p className="mt-1 text-xs text-destructive">{fieldErrors.reference}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">Barrio de entrega</p>
            {barrioOk && (
              <span className="text-[11px] font-bold text-primary">✓ {barrio}</span>
            )}
          </div>
          <UrabaBarrioPicker
            municipio={municipio}
            value={barrio}
            onChange={(v) => { setBarrio(v); clearError('barrio'); }}
            variant="checkout"
            purpose="checkout"
            showAllOption={false}
            label="Seleccionar barrio de entrega"
            className="w-full max-w-none"
          />
          <p className="text-xs text-muted-foreground">
            Lista completa de barrios en {municipio}. Si mueves el pin en el mapa, intentamos detectarlo automáticamente.
          </p>
          {fieldErrors.barrio && (
            <p className="text-xs text-destructive">{fieldErrors.barrio}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={gpsLoading} onClick={detect}>
            <AppIcon name="map" size="sm" />
            {gpsLoading ? 'Detectando…' : hasCoords ? 'Usar mi ubicación actual' : 'Usar mi GPS'}
          </Button>
          {locationHint && (
            <span className="text-xs text-amber-700 dark:text-amber-300">{locationHint}</span>
          )}
          {coordsOk && (
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <AppIcon name="check" size="sm" />
              Punto marcado en el mapa
            </span>
          )}
        </div>

        <AddressMapPicker
          municipio={municipio}
          latitude={mapLat ?? latitude}
          longitude={mapLng ?? longitude}
          addressHint={address}
          onChange={onMapChange}
        />
        {fieldErrors.location && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{fieldErrors.location}</p>
        )}

        {user && !selectedAddressId && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="accent-primary"
            />
            Guardar esta dirección para próximos pedidos
          </label>
        )}
      </SurfaceCard>
    </div>
  );
}
