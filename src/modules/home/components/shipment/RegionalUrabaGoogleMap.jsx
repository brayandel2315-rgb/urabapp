import { useEffect, useRef, useState } from 'react';
import AppIcon from '@/design-system/icons/AppIcon';
import { createMapProvider } from '@/lib/map-provider';
import { getGoogleMapsApiKey, isGoogleMapsEnabled, loadGoogleMaps } from '@/lib/google-maps-loader';
import { URABA_MUNICIPIO_MARKERS, URABA_REGION_VIEW } from '@/utils/municipio-geo';
import { cn } from '@/lib/utils';

const FIT_PADDING = 52;

function buildGoogleEmbedSrc() {
  const key = getGoogleMapsApiKey();
  const { lat, lng, zoom } = URABA_REGION_VIEW;
  if (key) {
    return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap&language=es&region=CO`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent('Urabá Antioquia Colombia')}&hl=es&z=${zoom}&ll=${lat},${lng}&output=embed`;
}

function MunicipiosLegend({ originMunicipio }) {
  return (
    <ul className="home-regional-map__municipios" aria-label="Municipios con cobertura">
      {URABA_MUNICIPIO_MARKERS.map((city) => (
        <li
          key={city.name}
          className={cn(
            'home-regional-map__municipio',
            city.name === originMunicipio && 'home-regional-map__municipio--origin',
          )}
        >
          <span className="home-regional-map__municipio-dot" aria-hidden />
          {city.name}
        </li>
      ))}
    </ul>
  );
}

function addGoogleMarkers(maps, map, originMunicipio) {
  const markers = [];

  URABA_MUNICIPIO_MARKERS.forEach((city) => {
    const isOrigin = city.name === originMunicipio;
    const marker = new maps.Marker({
      map,
      position: { lat: city.lat, lng: city.lng },
      title: city.name,
      label: {
        text: city.name,
        color: '#0D2B45',
        fontWeight: '700',
        fontSize: '12px',
        className: 'home-regional-map__g-label',
      },
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: isOrigin ? 12 : 9,
        fillColor: isOrigin ? '#FFC107' : '#2E7D32',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2.5,
      },
      zIndex: isOrigin ? 100 : 10,
    });
    markers.push(marker);
  });

  return () => markers.forEach((marker) => marker.setMap(null));
}

function MapChrome({ originMunicipio, mapMode, children }) {
  return (
    <div className="home-regional-map">
      <div className="home-regional-map__frame home-regional-map__frame--google">
        {children}
        <span className="home-regional-map__badge">
          <AppIcon name="map" size="xs" />
          7 municipios · cobertura activa
        </span>
      </div>
      <MunicipiosLegend originMunicipio={originMunicipio} />
      <p className="home-regional-map__credit">
        {mapMode === 'osm' ? 'OpenStreetMap · Urabá' : 'Google Maps · Urabá'}
      </p>
    </div>
  );
}

export default function RegionalUrabaGoogleMap({ originMunicipio, className }) {
  const containerRef = useRef(null);
  const [mode, setMode] = useState('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let cleanupMarkers = () => {};
    let mapProvider = null;

    async function initGoogleMap() {
      const maps = await loadGoogleMaps();
      if (cancelled || !containerRef.current) return true;

      const bounds = new maps.LatLngBounds();
      URABA_MUNICIPIO_MARKERS.forEach((city) => {
        bounds.extend({ lat: city.lat, lng: city.lng });
      });

      const map = new maps.Map(containerRef.current, {
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
        clickableIcons: false,
        keyboardShortcuts: false,
        scrollwheel: false,
        styles: [
          { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        ],
      });

      map.fitBounds(bounds, FIT_PADDING);
      maps.event.addListenerOnce(map, 'idle', () => {
        const zoom = map.getZoom();
        if (zoom > 10) map.setZoom(10);
        if (zoom < 8) map.setZoom(8);
      });

      cleanupMarkers = addGoogleMarkers(maps, map, originMunicipio);
      if (!cancelled) setMode('google');
      return true;
    }

    async function initMapLibre() {
      if (!containerRef.current) return false;
      mapProvider = await createMapProvider(containerRef.current, {
        center: { lat: URABA_REGION_VIEW.lat, lng: URABA_REGION_VIEW.lng },
        zoom: URABA_REGION_VIEW.zoom,
        interactive: false,
      });

      await Promise.all(
        URABA_MUNICIPIO_MARKERS.map((city) => mapProvider.addMarker(
          { lat: city.lat, lng: city.lng },
          {
            color: city.name === originMunicipio ? '#FFC107' : '#2E7D32',
            title: city.name,
          },
        )),
      );

      mapProvider.fitToPoints(
        URABA_MUNICIPIO_MARKERS.map((c) => ({ lat: c.lat, lng: c.lng })),
        { padding: 44, maxZoom: 10 },
      );

      if (!cancelled) setMode('osm');
      return true;
    }

    async function init() {
      setMode('loading');

      if (isGoogleMapsEnabled()) {
        try {
          await initGoogleMap();
          return;
        } catch {
          /* fallback */
        }
      }

      try {
        await initMapLibre();
      } catch {
        if (!cancelled) setMode('embed');
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanupMarkers();
      mapProvider?.destroy();
    };
  }, [originMunicipio]);

  if (mode === 'embed') {
    return (
      <div className={cn(className)}>
        <MapChrome originMunicipio={originMunicipio} mapMode="google">
          <iframe
            title="Mapa de cobertura Urabá"
            className="home-regional-map__embed"
            src={buildGoogleEmbedSrc()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </MapChrome>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <MapChrome originMunicipio={originMunicipio} mapMode={mode}>
        <div ref={containerRef} className="home-regional-map__canvas" aria-label="Mapa de cobertura Urabá" />
        {mode === 'loading' && (
          <div className="home-regional-map__loading">
            <AppIcon name="loading" size="md" className="animate-spin text-[#2E7D32]" />
            <span>Cargando mapa…</span>
          </div>
        )}
      </MapChrome>
    </div>
  );
}
