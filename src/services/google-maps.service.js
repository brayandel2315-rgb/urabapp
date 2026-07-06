/**
 * Google Maps — geocoding, direcciones, Places Autocomplete y mapas interactivos.
 * Sin API key: map.service usa Nominatim/ORS como fallback.
 */
import { getGoogleMapsApiKey, isGoogleMapsEnabled, loadGoogleMaps } from '@/lib/google-maps-loader';

export { isGoogleMapsEnabled, getGoogleMapsApiKey };

export async function googleReverseGeocode(latitude, longitude) {
  if (!isGoogleMapsEnabled()) return null;
  const maps = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();
  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) {
        resolve(null);
        return;
      }
      resolve(results[0].formatted_address);
    });
  });
}

export async function googleGeocodeAddress(query) {
  if (!isGoogleMapsEnabled() || !query?.trim()) return null;
  const maps = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();
  return new Promise((resolve) => {
    geocoder.geocode(
      { address: `${query.trim()}, Colombia`, region: 'CO' },
      (results, status) => {
        if (status !== 'OK' || !results?.[0]) {
          resolve(null);
          return;
        }
        const loc = results[0].geometry.location;
        resolve({
          latitude: loc.lat(),
          longitude: loc.lng(),
          label: results[0].formatted_address,
        });
      }
    );
  });
}

export async function googleGetDirections(origin, destination) {
  if (!isGoogleMapsEnabled()) return null;
  const maps = await loadGoogleMaps();
  const service = new maps.DirectionsService();
  const o = { lat: origin.lat ?? origin.latitude, lng: origin.lng ?? origin.longitude };
  const d = { lat: destination.lat ?? destination.latitude, lng: destination.lng ?? destination.longitude };

  return new Promise((resolve) => {
    service.route(
      { origin: o, destination: d, travelMode: maps.TravelMode.DRIVING },
      (result, status) => {
        if (status !== 'OK' || !result?.routes?.[0]) {
          resolve(null);
          return;
        }
        const leg = result.routes[0].legs[0];
        resolve({
          distanceMeters: leg.distance?.value ?? 0,
          durationSeconds: leg.duration?.value ?? 0,
          polyline: result.routes[0].overview_polyline?.points ?? null,
          etaText: leg.duration?.text,
          distanceText: leg.distance?.text,
        });
      }
    );
  });
}

export async function googleDistanceMatrix(origins, destinations) {
  if (!isGoogleMapsEnabled()) return null;
  const maps = await loadGoogleMaps();
  const service = new maps.DistanceMatrixService();
  const toLatLng = (p) => ({ lat: p.lat ?? p.latitude, lng: p.lng ?? p.longitude });

  return new Promise((resolve) => {
    service.getDistanceMatrix(
      {
        origins: origins.map(toLatLng),
        destinations: destinations.map(toLatLng),
        travelMode: maps.TravelMode.DRIVING,
        unitSystem: maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status !== 'OK') {
          resolve(null);
          return;
        }
        resolve(response);
      }
    );
  });
}

/**
 * Places Autocomplete — devuelve session token + listener cleanup.
 */
export async function attachPlacesAutocomplete(inputEl, { onSelect, bounds, types = ['establishment', 'geocode'] } = {}) {
  if (!inputEl || !isGoogleMapsEnabled()) return () => {};
  const maps = await loadGoogleMaps();
  const options = {
    componentRestrictions: { country: 'co' },
    fields: ['formatted_address', 'geometry', 'name', 'place_id'],
    types,
  };
  if (bounds) options.bounds = bounds;

  const autocomplete = new maps.places.Autocomplete(inputEl, options);
  const listener = autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place?.geometry?.location) return;
    onSelect?.({
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      label: place.formatted_address || place.name,
      placeId: place.place_id,
    });
  });

  return () => {
    if (listener?.remove) listener.remove();
    maps.event.clearInstanceListeners(autocomplete);
  };
}
