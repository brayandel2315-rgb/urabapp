let loadPromise = null;

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
}

export function isGoogleMapsEnabled() {
  return Boolean(getGoogleMapsApiKey());
}

export function loadGoogleMaps() {
  const key = getGoogleMapsApiKey();
  if (!key) return Promise.reject(new Error('Google Maps API key no configurada'));
  if (typeof window !== 'undefined' && window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places,geometry&language=es&region=CO`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error('Google Maps no cargó'));
    };
    script.onerror = () => reject(new Error('Error cargando Google Maps'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
